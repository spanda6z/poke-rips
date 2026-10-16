use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("PokeRips11111111111111111111111111111111111"); // replace after anchor keys list

#[program]
pub mod poke_rips {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        fee_bps: u16,
        refund_timeout_slots: u64,
    ) -> Result<()> {
        require!(fee_bps <= 1000, PokeError::InvalidFee);

        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.treasury = ctx.accounts.treasury.key();
        config.fee_bps = fee_bps;
        config.refund_timeout_slots = refund_timeout_slots;
        config.paused = false;
        config.bump = ctx.bumps.config;
        config.total_rips = 0;
        config.total_volume_lamports = 0;
        Ok(())
    }

    pub fn update_top20(ctx: Context<UpdateTop20>, tokens: [Pubkey; 20]) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require_keys_eq!(config.authority, ctx.accounts.authority.key());
        require!(!config.paused, PokeError::Paused);
        config.top20 = tokens;
        Ok(())
    }

    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require_keys_eq!(config.authority, ctx.accounts.authority.key());
        config.paused = paused;
        Ok(())
    }

    /// User pays SOL and creates an order.
    /// Client/executor then requests ORAO VRF with seed = sha256(order_pubkey).
    pub fn create_order(
        ctx: Context<CreateOrder>,
        pack_id: u8,
        price_lamports: u64,
        vrf_seed: [u8; 32],
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, PokeError::Paused);
        require!(pack_id < 5, PokeError::InvalidPack);
        require!(price_lamports > 0, PokeError::InvalidPrice);

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                },
            ),
            price_lamports,
        )?;

        let order = &mut ctx.accounts.order;
        order.user = ctx.accounts.user.key();
        order.pack_id = pack_id;
        order.price_lamports = price_lamports;
        order.vrf_seed = vrf_seed;
        order.status = OrderStatus::Pending as u8;
        order.rarity = 0;
        order.token_index = 0;
        order.value_band = 0;
        order.created_slot = Clock::get()?.slot;
        order.bump = ctx.bumps.order;

        // Optional: CPI into ORAO request_v2 here (see docs/RANDOMNESS.md).
        // Current design: executor/client requests ORAO off-chain with the same seed.

        emit!(OrderCreated {
            order: order.key(),
            user: order.user,
            pack_id,
            price_lamports,
            vrf_seed,
        });

        Ok(())
    }

    pub fn fulfill_order(ctx: Context<FulfillOrder>, random_bytes: [u8; 32]) -> Result<()> {
        let order = &mut ctx.accounts.order;
        require!(order.status == OrderStatus::Pending as u8, PokeError::InvalidStatus);

        let rarity = derive_rarity(&random_bytes);
        let token_index = (random_bytes[8] % 20) as u8;
        let value_band = random_bytes[9] % 100;

        order.rarity = rarity;
        order.token_index = token_index;
        order.value_band = value_band;
        order.status = OrderStatus::Fulfilled as u8;

        let config = &mut ctx.accounts.config;
        config.total_rips = config.total_rips.saturating_add(1);
        config.total_volume_lamports = config
            .total_volume_lamports
            .saturating_add(order.price_lamports);

        emit!(OrderFulfilled {
            order: order.key(),
            user: order.user,
            rarity,
            token_index,
            value_band,
        });

        Ok(())
    }

    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        let order = &mut ctx.accounts.order;
        let config = &ctx.accounts.config;

        require!(order.status == OrderStatus::Pending as u8, PokeError::InvalidStatus);
        require_keys_eq!(order.user, ctx.accounts.user.key());

        let current_slot = Clock::get()?.slot;
        require!(
            current_slot > order.created_slot + config.refund_timeout_slots,
            PokeError::RefundNotReady
        );

        order.status = OrderStatus::Refunded as u8;

        // TODO: transfer SOL from treasury PDA back to user

        emit!(OrderRefunded {
            order: order.key(),
            user: order.user,
        });

        Ok(())
    }
}

fn derive_rarity(random: &[u8; 32]) -> u8 {
    let roll = u16::from_le_bytes([random[0], random[1]]) % 1000;
    if roll < 550 {
        0
    } else if roll < 800 {
        1
    } else if roll < 920 {
        2
    } else if roll < 980 {
        3
    } else if roll < 998 {
        4
    } else {
        5
    }
}

#[account]
pub struct Config {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub fee_bps: u16,
    pub refund_timeout_slots: u64,
    pub paused: bool,
    pub total_rips: u64,
    pub total_volume_lamports: u64,
    pub top20: [Pubkey; 20],
    pub bump: u8,
}

#[account]
pub struct Order {
    pub user: Pubkey,
    pub pack_id: u8,
    pub price_lamports: u64,
    pub vrf_seed: [u8; 32],
    pub status: u8,
    pub rarity: u8,
    pub token_index: u8,
    pub value_band: u8,
    pub created_slot: u64,
    pub bump: u8,
}

#[repr(u8)]
pub enum OrderStatus {
    Pending = 0,
    Fulfilled = 1,
    Refunded = 2,
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 2 + 8 + 1 + 8 + 8 + (32 * 20) + 1,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: treasury receives pack payments
    pub treasury: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTop20<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(pack_id: u8)]
pub struct CreateOrder<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 1 + 8 + 32 + 1 + 1 + 1 + 1 + 8 + 1,
        seeds = [b"order", user.key().as_ref(), &pack_id.to_le_bytes()],
        bump
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: treasury receives payment
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FulfillOrder<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub order: Account<'info, Order>,
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub order: Account<'info, Order>,
    pub user: Signer<'info>,
}

#[event]
pub struct OrderCreated {
    pub order: Pubkey,
    pub user: Pubkey,
    pub pack_id: u8,
    pub price_lamports: u64,
    pub vrf_seed: [u8; 32],
}

#[event]
pub struct OrderFulfilled {
    pub order: Pubkey,
    pub user: Pubkey,
    pub rarity: u8,
    pub token_index: u8,
    pub value_band: u8,
}

#[event]
pub struct OrderRefunded {
    pub order: Pubkey,
    pub user: Pubkey,
}

#[error_code]
pub enum PokeError {
    #[msg("Protocol is paused")]
    Paused,
    #[msg("Invalid pack id")]
    InvalidPack,
    #[msg("Invalid order status")]
    InvalidStatus,
    #[msg("Refund timeout not reached")]
    RefundNotReady,
    #[msg("Invalid fee")]
    InvalidFee,
    #[msg("Invalid price")]
    InvalidPrice,
}