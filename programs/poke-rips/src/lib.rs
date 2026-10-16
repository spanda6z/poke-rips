use anchor_lang::prelude::*;

declare_id!("PokeRips11111111111111111111111111111111111"); // replace after anchor keys list

#[program]
pub mod poke_rips {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        fee_bps: u16,
        refund_timeout_slots: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.fee_bps = fee_bps;
        config.refund_timeout_slots = refund_timeout_slots;
        config.paused = false;
        config.bump = ctx.bumps.config;
        config.total_rips = 0;
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

    /// Creates a new order and prepares for VRF request.
    /// In production this will also CPI into Switchboard to request randomness.
    pub fn create_order(ctx: Context<CreateOrder>, pack_id: u8) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, PokeError::Paused);
        require!(pack_id < 5, PokeError::InvalidPack);

        let order = &mut ctx.accounts.order;
        order.user = ctx.accounts.user.key();
        order.pack_id = pack_id;
        order.status = OrderStatus::Pending as u8;
        order.rarity = 0;
        order.token_index = 0;
        order.value_band = 0;
        order.created_slot = Clock::get()?.slot;
        order.bump = ctx.bumps.order;

        // TODO: Switchboard VRF request CPI goes here
        // 1. Create / use a randomness account
        // 2. Request randomness with callback to fulfill_order

        emit!(OrderCreated {
            order: order.key(),
            user: order.user,
            pack_id,
        });

        Ok(())
    }

    /// Called after VRF reveal (by executor or as VRF callback).
    /// Takes the random bytes and derives rarity + token + value band.
    pub fn fulfill_order(
        ctx: Context<FulfillOrder>,
        random_bytes: [u8; 32],
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        require!(order.status == OrderStatus::Pending as u8, PokeError::InvalidStatus);

        // Derive values from randomness
        let rarity = derive_rarity(&random_bytes);
        let token_index = (random_bytes[8] % 20) as u8;
        let value_band = random_bytes[9] % 100; // 0-99 scale inside the pack range

        order.rarity = rarity;
        order.token_index = token_index;
        order.value_band = value_band;
        order.status = OrderStatus::Fulfilled as u8;

        let config = &mut ctx.accounts.config;
        config.total_rips = config.total_rips.checked_add(1).unwrap();

        emit!(OrderFulfilled {
            order: order.key(),
            user: order.user,
            rarity,
            token_index,
            value_band,
        });

        Ok(())
    }

    /// User can claim refund if order is still Pending after timeout.
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

        // TODO: transfer SOL back to user

        emit!(OrderRefunded {
            order: order.key(),
            user: order.user,
        });

        Ok(())
    }
}

// ─── Helpers ───────────────────────────────────────────────

fn derive_rarity(random: &[u8; 32]) -> u8 {
    // Simple weighted rarity from first two bytes
    let roll = u16::from_le_bytes([random[0], random[1]]) % 1000;

    // Common 55%, Uncommon 25%, Rare 12%, Ultra 6%, Secret 1.8%, Legendary 0.2%
    if roll < 550 {
        0 // Common
    } else if roll < 800 {
        1 // Uncommon
    } else if roll < 920 {
        2 // Rare
    } else if roll < 980 {
        3 // Ultra Rare
    } else if roll < 998 {
        4 // Secret Rare
    } else {
        5 // Legendary
    }
}

// ─── Accounts ──────────────────────────────────────────────

#[account]
pub struct Config {
    pub authority: Pubkey,
    pub fee_bps: u16,
    pub refund_timeout_slots: u64,
    pub paused: bool,
    pub total_rips: u64,
    pub top20: [Pubkey; 20],
    pub bump: u8,
}

#[account]
pub struct Order {
    pub user: Pubkey,
    pub pack_id: u8,
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

// ─── Contexts ──────────────────────────────────────────────

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 8 + 1 + 8 + (32 * 20) + 1,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
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
        space = 8 + 32 + 1 + 1 + 1 + 1 + 1 + 8 + 1,
        seeds = [b"order", user.key().as_ref(), &pack_id.to_le_bytes()],
        bump
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FulfillOrder<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub order: Account<'info, Order>,
    // In production: add Switchboard randomness account here
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub order: Account<'info, Order>,
    pub user: Signer<'info>,
}

// ─── Events ────────────────────────────────────────────────

#[event]
pub struct OrderCreated {
    pub order: Pubkey,
    pub user: Pubkey,
    pub pack_id: u8,
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

// ─── Errors ────────────────────────────────────────────────

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
}