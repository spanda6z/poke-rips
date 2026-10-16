use anchor_lang::prelude::*;

declare_id!("PokeRips11111111111111111111111111111111111"); // replace after `anchor keys list`

#[program]
pub mod poke_rips {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, fee_bps: u16) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.fee_bps = fee_bps;
        config.bump = ctx.bumps.config;
        config.paused = false;
        Ok(())
    }

    pub fn update_top20(ctx: Context<UpdateTop20>, tokens: [Pubkey; 20]) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require_keys_eq!(config.authority, ctx.accounts.authority.key());
        config.top20 = tokens;
        Ok(())
    }

    // Placeholder — full create_order + VRF integration comes next
    pub fn create_order(ctx: Context<CreateOrder>, pack_id: u8) -> Result<()> {
        let order = &mut ctx.accounts.order;
        order.user = ctx.accounts.user.key();
        order.pack_id = pack_id;
        order.status = OrderStatus::Pending;
        order.bump = ctx.bumps.order;
        // TODO: request Switchboard VRF here
        Ok(())
    }
}

#[account]
pub struct Config {
    pub authority: Pubkey,
    pub fee_bps: u16,
    pub paused: bool,
    pub top20: [Pubkey; 20],
    pub bump: u8,
}

#[account]
pub struct Order {
    pub user: Pubkey,
    pub pack_id: u8,
    pub status: OrderStatus,
    pub rarity: u8,
    pub token_index: u8,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OrderStatus {
    Pending,
    Fulfilled,
    Refunded,
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 1 + (32 * 20) + 1,
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
#[instruction(pack_id: u8)]
pub struct CreateOrder<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 1 + 1 + 1 + 1 + 1,
        seeds = [b"order", user.key().as_ref(), &pack_id.to_le_bytes()],
        bump
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}