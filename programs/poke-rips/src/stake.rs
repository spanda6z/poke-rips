//! $POKE stake + vote skeleton
//! Include from lib.rs when ready: `pub mod stake;`

use anchor_lang::prelude::*;

/// Per-user stake account
#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub amount: u64,
    pub boost_tier: u8,
    pub bump: u8,
}

/// Global vote tallies for Top 20 slots
#[account]
pub struct VoteBoard {
    pub authority: Pubkey,
    /// votes[i] = total weight for top20[i]
    pub votes: [u64; 20],
    pub bump: u8,
}

/// Boost tiers (must match frontend BOOST_TIERS)
/// 0 = none, 1 = Spark (250k), 2 = Charge (1M), 3 = Surge (2.5M), 4 = Apex (5M)
pub fn boost_tier_for_amount(amount: u64) -> u8 {
    if amount >= 5_000_000 { 4 }
    else if amount >= 2_500_000 { 3 }
    else if amount >= 1_000_000 { 2 }
    else if amount >= 250_000 { 1 }
    else { 0 }
}

// Example instruction shapes (implement when $POKE mint exists):
//
// stake_poke(ctx, amount)
//   - transfer $POKE from user ATA → vault PDA
//   - update StakeAccount.amount + boost_tier
//
// unstake_poke(ctx, amount)
//   - reverse transfer, update account
//
// cast_vote(ctx, token_index, weight)
//   - require StakeAccount.amount > 0
//   - add weight to VoteBoard.votes[token_index]
//   - weight can equal stake amount or a capped value per epoch
