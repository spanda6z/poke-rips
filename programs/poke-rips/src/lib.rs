use anchor_lang::prelude::*;

declare_id!("PokeRips11111111111111111111111111111111111"); // replace after deploy

#[program]
pub mod poke_rips {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.bump = ctx.bumps.config;
        Ok(())
    }

    // TODO: create_order, fulfill_order, stake, vote, etc.
}

#[account]
pub struct Config {
    pub authority: Pubkey,
    pub bump: u8,
    // odds tables, top 20 list, fees, etc. to be added
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 1,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}