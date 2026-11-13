pub mod guardian;

use borsh::{BorshDeserialize, BorshSerialize};
use guardian::{GuardianConfig, GuardianVerifier, TEEVerdictPayload};
use near_contract_standards::fungible_token::core::FungibleTokenCore;
use near_contract_standards::fungible_token::events::{FtBurn, FtMint};
use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};
use near_sdk::collections::{LookupMap, Vector};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near, require, AccountId, BorshStorageKey, PanicOnDefault, Promise,
    PromiseOrValue, NearToken,
};

/// NEP-297 Event envelope helper
pub fn emit_nep297_event(event_name: &str, data: serde_json::Value) {
    let event = serde_json::json!({
        "standard": "nep297",
        "version": "1.0.0",
        "event": event_name,
        "data": [data]
    });
    env::log_str(&format!("EVENT_JSON:{}", event.to_string()));
}

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "borsh")]
pub enum StorageKey {
    FungibleToken,
    Metadata,
    Attempts,
    AttemptList,
    UsedNonces,
    Sentinels,
    SentinelList,
}

/// Recorded adversarial prompt attempt
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[borsh(crate = "borsh")]
#[serde(crate = "near_sdk::serde")]
pub struct PromptAttempt {
    pub prompt_hash: String,
    pub attacker_id: AccountId,
    pub burned_amount: U128,
    pub timestamp: u64,
    pub claimed: bool,
    pub attempt_id: u64,
}

/// Multi-Sentinel Record in Two-Sided AI Red-Teaming Marketplace
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[borsh(crate = "borsh")]
#[serde(crate = "near_sdk::serde")]
pub struct SentinelRecord {
    pub id: u64,
    pub name: String,
    pub creator_id: AccountId,
    pub attack_fee: U128,          // in $SOGOK yocto
    pub near_bounty: NearToken,    // NEAR locked in vault
    pub token_bounty: U128,        // $SOGOK jackpot pool
    pub canary_hash: String,       // SHA-256 hash of secret phrase
    pub system_prompt_hash: String,// SHA-256 hash of system prompt
    pub total_attacks: u64,
    pub total_burned: U128,
    pub is_breached: bool,
    pub winner: Option<AccountId>,
    pub created_at: u64,
    pub lockup_period_ns: u64,     // e.g. 14 days in nanoseconds
}

/// Comprehensive statistics view for cyber terminal
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct SogokStatsView {
    pub total_supply: U128,
    pub total_burned: U128,
    pub initial_supply: U128,
    pub total_attempts: u64,
    pub near_treasury_bounty: U128,
    pub token_bounty_jackpot: U128,
    pub bounty_won: bool,
    pub last_winner: Option<AccountId>,
    pub min_burn_amount: U128,
    pub guardian_public_key: String,
    pub measurement_quote_hash: String,
    pub enclave_provider: String,
    pub total_sentinels: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct BountyVaultView {
    pub near_bounty: U128,
    pub token_bounty: U128,
    pub is_active: bool,
    pub winner: Option<AccountId>,
    pub total_payouts: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct SogokContract {
    pub token: FungibleToken,
    pub metadata: FungibleTokenMetadata,
    pub guardian_config: GuardianConfig,
    pub total_burned: u128,
    pub initial_supply: u128,
    pub attempts: LookupMap<String, PromptAttempt>,
    pub attempt_list: Vector<String>,
    pub used_nonces: LookupMap<u64, bool>,
    pub bounty_won: bool,
    pub last_winner: Option<AccountId>,
    pub token_bounty_jackpot: u128,
    pub total_payouts: u64,
    pub sentinels: LookupMap<u64, SentinelRecord>,
    pub sentinel_count: u64,
}

#[near]
impl SogokContract {
    /// Initialize $SOGOK token with TEE Guardian security parameters & Master Sentinel 0
    #[init]
    pub fn new(
        owner_id: AccountId,
        total_supply: U128,
        guardian_public_key: String,
        measurement_quote_hash: String,
        min_burn_amount: U128,
    ) -> Self {
        require!(!env::state_exists(), "Already initialized");

        let mut token = FungibleToken::new(StorageKey::FungibleToken);
        // Mint initial supply to owner
        let initial_supply_u128 = total_supply.0;
        token.internal_register_account(&owner_id);
        token.internal_deposit(&owner_id, initial_supply_u128);

        // Emit NEP-141 mint event
        FtMint {
            owner_id: &owner_id,
            amount: total_supply,
            memo: Some("Initial $SOGOK Genesis Mint"),
        }
        .emit();

        let metadata = FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: "Sogok Adversarial Memecoin".to_string(),
            symbol: "SOGOK".to_string(),
            icon: Some("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%2308090b' stroke='%2322c55e' stroke-width='4'/><text x='50' y='60' font-family='monospace' font-size='32' font-weight='bold' fill='%2322c55e' text-anchor='middle'>$GK</text></svg>".to_string()),
            reference: None,
            reference_hash: None,
            decimals: 18,
        };

        let guardian_config = GuardianConfig {
            guardian_public_key,
            measurement_quote_hash,
            min_burn_amount,
            enclave_provider: "NEAR-AI-CLOUD-TEE-SGX-V1".to_string(),
            admin_id: owner_id.clone(),
        };

        let initial_jackpot = initial_supply_u128 / 10;
        let mut sentinels = LookupMap::new(StorageKey::Sentinels);

        // Seed Sentinel #0: Sogok-Prime (Master Sentinel)
        let master_sentinel = SentinelRecord {
            id: 0,
            name: "Sogok-Prime (Master Sentinel)".to_string(),
            creator_id: owner_id.clone(),
            attack_fee: min_burn_amount,
            near_bounty: NearToken::from_near(0),
            token_bounty: U128(initial_jackpot),
            canary_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".to_string(),
            system_prompt_hash: "a1c8f49d28e7bb6034f19bcae721598b049d1e7c53fa678c1b3f9e0a2d4b5c6e".to_string(),
            total_attacks: 0,
            total_burned: U128(0),
            is_breached: false,
            winner: None,
            created_at: env::block_timestamp_ms(),
            lockup_period_ns: 14 * 24 * 60 * 60 * 1_000_000_000,
        };
        sentinels.insert(&0, &master_sentinel);

        Self {
            token,
            metadata,
            guardian_config,
            total_burned: 0,
            initial_supply: initial_supply_u128,
            attempts: LookupMap::new(StorageKey::Attempts),
            attempt_list: Vector::new(StorageKey::AttemptList),
            used_nonces: LookupMap::new(StorageKey::UsedNonces),
            bounty_won: false,
            last_winner: None,
            token_bounty_jackpot: initial_jackpot,
            total_payouts: 0,
            sentinels,
            sentinel_count: 1,
        }
    }

    // =========================================================================
    // TWO-SIDED MARKETPLACE: SENTINEL DEPLOYMENT & DEFENDER ECONOMICS
    // =========================================================================

    /// Deploy a custom AI Sentinel with initial NEAR bounty and lockup period
    #[payable]
    pub fn deploy_sentinel(
        &mut self,
        name: String,
        attack_fee: U128,
        canary_hash: String,
        system_prompt_hash: String,
        lockup_days: u64,
    ) -> SentinelRecord {
        let caller = env::predecessor_account_id();
        let attached_near = env::attached_deposit();

        require!(name.len() >= 3 && name.len() <= 64, "Sentinel name must be between 3 and 64 characters");
        require!(attack_fee.0 >= self.guardian_config.min_burn_amount.0, "Attack fee below minimum threshold");
        require!(canary_hash.len() == 64, "Canary hash must be 64-character SHA-256 hex");
        require!(system_prompt_hash.len() == 64, "System prompt hash must be 64-character SHA-256 hex");
        require!(lockup_days >= 1 && lockup_days <= 365, "Lockup period must be between 1 and 365 days");

        let sentinel_id = self.sentinel_count;
        let created_at = env::block_timestamp_ms();
        let lockup_period_ns = lockup_days * 24 * 60 * 60 * 1_000_000_000;

        let record = SentinelRecord {
            id: sentinel_id,
            name: name.clone(),
            creator_id: caller.clone(),
            attack_fee,
            near_bounty: attached_near,
            token_bounty: U128(0),
            canary_hash: canary_hash.clone(),
            system_prompt_hash: system_prompt_hash.clone(),
            total_attacks: 0,
            total_burned: U128(0),
            is_breached: false,
            winner: None,
            created_at,
            lockup_period_ns,
        };

        self.sentinels.insert(&sentinel_id, &record);
        self.sentinel_count += 1;

        emit_nep297_event(
            "sogok_sentinel_deployed",
            serde_json::json!({
                "sentinel_id": sentinel_id,
                "name": name,
                "creator_id": caller.to_string(),
                "attack_fee": attack_fee.0.to_string(),
                "near_bounty": attached_near.as_yoctonear().to_string(),
                "canary_hash": canary_hash,
                "system_prompt_hash": system_prompt_hash,
                "lockup_days": lockup_days,
                "timestamp": created_at
            }),
        );

        record
    }

    /// Attack a specific Sentinel with Tripartite Economic Fee Split:
    /// 40% Burned permanently (hyper-deflationary)
    /// 40% Added to that Sentinel's Token Jackpot pool
    /// 20% Transferred to Sentinel Creator/Defender (Passive Income)
    pub fn attack_sentinel(&mut self, sentinel_id: u64, prompt_hash: String) -> PromptAttempt {
        let caller = env::predecessor_account_id();

        let mut sentinel = match self.sentinels.get(&sentinel_id) {
            Some(s) => s,
            None => env::panic_str(&format!("Sentinel #{} not found", sentinel_id)),
        };

        require!(!sentinel.is_breached, "Sentinel is already breached");
        require!(prompt_hash.len() == 64, "Prompt hash must be a 64-character SHA-256 hex");
        require!(!self.attempts.contains_key(&prompt_hash), "Prompt hash already submitted");

        let fee = sentinel.attack_fee.0;
        let caller_balance = self.token.ft_balance_of(caller.clone()).0;
        require!(caller_balance >= fee, "Insufficient $SOGOK balance to pay attack fee");

        // Withdraw full fee from attacker
        self.token.internal_withdraw(&caller, fee);

        // Tripartite Economic Split: 40% Burn, 40% Jackpot, 20% Creator
        let burn_cut = (fee * 40) / 100;
        let jackpot_cut = (fee * 40) / 100;
        let creator_cut = fee.saturating_sub(burn_cut).saturating_sub(jackpot_cut);

        // 1. 40% Burned
        self.total_burned = self.total_burned.saturating_add(burn_cut);
        sentinel.total_burned = U128(sentinel.total_burned.0.saturating_add(burn_cut));

        // 2. 40% Jackpot Accrual
        sentinel.token_bounty = U128(sentinel.token_bounty.0.saturating_add(jackpot_cut));
        if sentinel_id == 0 {
            self.token_bounty_jackpot = sentinel.token_bounty.0;
        }

        // 3. 20% Passive Defender Income
        if !self.token.accounts.contains_key(&sentinel.creator_id) {
            self.token.internal_register_account(&sentinel.creator_id);
        }
        self.token.internal_deposit(&sentinel.creator_id, creator_cut);

        sentinel.total_attacks += 1;
        self.sentinels.insert(&sentinel_id, &sentinel);

        let attempt_id = self.attempt_list.len();
        let timestamp = env::block_timestamp_ms();

        let attempt = PromptAttempt {
            prompt_hash: prompt_hash.clone(),
            attacker_id: caller.clone(),
            burned_amount: U128(fee),
            timestamp,
            claimed: false,
            attempt_id,
        };

        self.attempts.insert(&prompt_hash, &attempt);
        self.attempt_list.push(&prompt_hash);

        // Emit ft_burn for the permanently destroyed tokens
        FtBurn {
            owner_id: &caller,
            amount: U128(burn_cut),
            memo: Some(&format!("Sentinel #{} Attack Burn", sentinel_id)),
        }
        .emit();

        emit_nep297_event(
            "sogok_sentinel_attacked",
            serde_json::json!({
                "sentinel_id": sentinel_id,
                "attacker_id": caller.to_string(),
                "prompt_hash": prompt_hash,
                "total_fee": fee.to_string(),
                "burn_cut": burn_cut.to_string(),
                "jackpot_cut": jackpot_cut.to_string(),
                "creator_cut": creator_cut.to_string(),
                "sentinel_jackpot": sentinel.token_bounty.0.to_string(),
                "timestamp": timestamp
            }),
        );

        attempt
    }

    /// Claim breach bounty for a specific Sentinel using TEE hardware attestation
    pub fn claim_breach_bounty(
        &mut self,
        sentinel_id: u64,
        payload: TEEVerdictPayload,
        signature_hex: String,
    ) -> Promise {
        let caller = env::predecessor_account_id();

        require!(payload.recipient == caller, "Payload recipient does not match caller");
        require!(!self.used_nonces.contains_key(&payload.nonce), "Nonce has already been spent");

        let mut sentinel = match self.sentinels.get(&sentinel_id) {
            Some(s) => s,
            None => env::panic_str(&format!("Sentinel #{} not found", sentinel_id)),
        };

        require!(!sentinel.is_breached, "Sentinel is already breached");

        if let Some(id) = payload.sentinel_id {
            require!(id == sentinel_id, "Payload sentinel_id does not match target sentinel");
        }

        let mut attempt = match self.attempts.get(&payload.prompt_hash) {
            Some(att) => att,
            None => env::panic_str("Prompt hash was never registered for an attack"),
        };

        require!(attempt.attacker_id == caller, "Prompt hash was submitted by a different attacker");
        require!(!attempt.claimed, "Bounty already claimed for this prompt attempt");

        // Cryptographic TEE verification
        let is_valid = GuardianVerifier::verify_attestation(
            &self.guardian_config,
            &payload,
            &signature_hex,
        );
        require!(is_valid, "Cryptographic TEE attestation verification failed!");

        attempt.claimed = true;
        self.attempts.insert(&payload.prompt_hash, &attempt);
        self.used_nonces.insert(&payload.nonce, &true);

        sentinel.is_breached = true;
        sentinel.winner = Some(caller.clone());

        if sentinel_id == 0 {
            self.bounty_won = true;
            self.last_winner = Some(caller.clone());
            self.total_payouts += 1;
        }

        let near_payout = sentinel.near_bounty;
        sentinel.near_bounty = NearToken::from_near(0);

        let token_payout = sentinel.token_bounty.0;
        sentinel.token_bounty = U128(0);

        if token_payout > 0 {
            if !self.token.accounts.contains_key(&caller) {
                self.token.internal_register_account(&caller);
            }
            self.token.internal_deposit(&caller, token_payout);

            FtMint {
                owner_id: &caller,
                amount: U128(token_payout),
                memo: Some(&format!("Breach Bounty Jackpot for Sentinel #{}", sentinel_id)),
            }
            .emit();
        }

        self.sentinels.insert(&sentinel_id, &sentinel);

        emit_nep297_event(
            "sogok_sentinel_breached",
            serde_json::json!({
                "sentinel_id": sentinel_id,
                "winner": caller.to_string(),
                "prompt_hash": payload.prompt_hash,
                "near_payout": near_payout.as_yoctonear().to_string(),
                "token_payout": token_payout.to_string(),
                "nonce": payload.nonce,
                "timestamp": env::block_timestamp_ms()
            }),
        );

        Promise::new(caller).transfer(near_payout)
    }

    /// Claim survivor bounty if lockup period expired and Sentinel remained unbreached
    pub fn claim_survivor_bounty(&mut self, sentinel_id: u64) -> Promise {
        let caller = env::predecessor_account_id();

        let mut sentinel = match self.sentinels.get(&sentinel_id) {
            Some(s) => s,
            None => env::panic_str(&format!("Sentinel #{} not found", sentinel_id)),
        };

        require!(sentinel.creator_id == caller, "Only Sentinel creator can claim survivor bounty");
        require!(!sentinel.is_breached, "Sentinel was breached; bounty cannot be claimed");

        let current_time_ns = env::block_timestamp();
        let expiry_ns = sentinel.created_at.saturating_mul(1_000_000).saturating_add(sentinel.lockup_period_ns);
        require!(current_time_ns >= expiry_ns, "Lockup period has not expired yet");

        let near_payout = sentinel.near_bounty;
        sentinel.near_bounty = NearToken::from_near(0);

        let token_payout = sentinel.token_bounty.0;
        sentinel.token_bounty = U128(0);

        if token_payout > 0 {
            if !self.token.accounts.contains_key(&caller) {
                self.token.internal_register_account(&caller);
            }
            self.token.internal_deposit(&caller, token_payout);
        }

        self.sentinels.insert(&sentinel_id, &sentinel);

        emit_nep297_event(
            "sogok_sentinel_survived",
            serde_json::json!({
                "sentinel_id": sentinel_id,
                "creator": caller.to_string(),
                "near_payout": near_payout.as_yoctonear().to_string(),
                "token_payout": token_payout.to_string(),
                "timestamp": env::block_timestamp_ms()
            }),
        );

        Promise::new(caller).transfer(near_payout)
    }

    // =========================================================================
    // BACKWARD COMPATIBLE CONVENIENCE METHODS
    // =========================================================================

    /// Legacy / Master Sentinel attack method
    pub fn burn_for_attempt(&mut self, prompt_hash: String, amount: U128) -> PromptAttempt {
        let caller = env::predecessor_account_id();
        let burn_amount = amount.0;

        require!(
            burn_amount >= self.guardian_config.min_burn_amount.0,
            format!(
                "Burn amount {} is below minimum required {}",
                burn_amount, self.guardian_config.min_burn_amount.0
            )
        );

        require!(
            prompt_hash.len() == 64,
            "Prompt hash must be a valid 64-char SHA-256 hex string"
        );

        require!(
            !self.attempts.contains_key(&prompt_hash),
            "Prompt hash has already been registered"
        );

        // Deduct tokens from caller balance
        self.token.internal_withdraw(&caller, burn_amount);

        // Update global deflationary counters
        self.total_burned = self.total_burned.saturating_add(burn_amount);

        // 10% of burned tokens get added to Sentinel 0 jackpot
        let jackpot_accrual = burn_amount / 10;
        self.token_bounty_jackpot = self.token_bounty_jackpot.saturating_add(jackpot_accrual);

        if let Some(mut master) = self.sentinels.get(&0) {
            master.total_attacks += 1;
            master.total_burned = U128(master.total_burned.0.saturating_add(burn_amount));
            master.token_bounty = U128(master.token_bounty.0.saturating_add(jackpot_accrual));
            self.sentinels.insert(&0, &master);
        }

        let attempt_id = self.attempt_list.len();
        let timestamp = env::block_timestamp_ms();

        let attempt = PromptAttempt {
            prompt_hash: prompt_hash.clone(),
            attacker_id: caller.clone(),
            burned_amount: amount,
            timestamp,
            claimed: false,
            attempt_id,
        };

        self.attempts.insert(&prompt_hash, &attempt);
        self.attempt_list.push(&prompt_hash);

        FtBurn {
            owner_id: &caller,
            amount,
            memo: Some(&format!("Prompt burn attempt #{}", attempt_id)),
        }
        .emit();

        emit_nep297_event(
            "sogok_prompt_burn",
            serde_json::json!({
                "owner_id": caller.to_string(),
                "amount": amount.0.to_string(),
                "prompt_hash": prompt_hash,
                "attempt_id": attempt_id,
                "timestamp": timestamp,
                "total_burned": self.total_burned.to_string(),
                "token_bounty_jackpot": self.token_bounty_jackpot.to_string()
            }),
        );

        attempt
    }

    /// Voluntary token burn method
    pub fn burn(&mut self, amount: U128) {
        let caller = env::predecessor_account_id();
        let burn_val = amount.0;
        require!(burn_val > 0, "Burn amount must be greater than 0");

        self.token.internal_withdraw(&caller, burn_val);
        self.total_burned = self.total_burned.saturating_add(burn_val);

        FtBurn {
            owner_id: &caller,
            amount,
            memo: Some("User voluntary burn"),
        }
        .emit();

        emit_nep297_event(
            "sogok_voluntary_burn",
            serde_json::json!({
                "owner_id": caller.to_string(),
                "amount": amount.0.to_string(),
                "total_burned": self.total_burned.to_string()
            }),
        );
    }

    /// Legacy Master Sentinel claim method
    pub fn claim_bounty(&mut self, payload: TEEVerdictPayload, signature_hex: String) -> Promise {
        let caller = env::predecessor_account_id();

        require!(payload.recipient == caller, "Payload recipient does not match caller account");
        require!(!self.used_nonces.contains_key(&payload.nonce), "Nonce has already been used");

        let mut attempt = match self.attempts.get(&payload.prompt_hash) {
            Some(att) => att,
            None => env::panic_str("Prompt hash was never registered via burn_for_attempt"),
        };

        require!(attempt.attacker_id == caller, "Prompt hash was burned by a different attacker");
        require!(!attempt.claimed, "Bounty has already been claimed for this prompt attempt");

        let is_valid = GuardianVerifier::verify_attestation(
            &self.guardian_config,
            &payload,
            &signature_hex,
        );
        require!(is_valid, "Cryptographic TEE attestation verification failed!");

        attempt.claimed = true;
        self.attempts.insert(&payload.prompt_hash, &attempt);
        self.used_nonces.insert(&payload.nonce, &true);

        self.bounty_won = true;
        self.last_winner = Some(caller.clone());
        self.total_payouts += 1;

        if let Some(mut master) = self.sentinels.get(&0) {
            master.is_breached = true;
            master.winner = Some(caller.clone());
            self.sentinels.insert(&0, &master);
        }

        let contract_near_balance = env::account_balance();
        let min_storage_reserve = NearToken::from_near(2);
        let near_payout = if contract_near_balance > min_storage_reserve {
            contract_near_balance.saturating_sub(min_storage_reserve)
        } else {
            NearToken::from_near(0)
        };

        let token_payout = self.token_bounty_jackpot;
        if token_payout > 0 {
            self.token_bounty_jackpot = 0;
            if !self.token.accounts.contains_key(&caller) {
                self.token.internal_register_account(&caller);
            }
            self.token.internal_deposit(&caller, token_payout);

            FtMint {
                owner_id: &caller,
                amount: U128(token_payout),
                memo: Some("TEE Jailbreak Bounty Token Jackpot Payout"),
            }
            .emit();
        }

        emit_nep297_event(
            "sogok_bounty_claimed",
            serde_json::json!({
                "recipient": caller.to_string(),
                "prompt_hash": payload.prompt_hash,
                "near_bounty": near_payout.as_yoctonear().to_string(),
                "token_bounty": token_payout.to_string(),
                "nonce": payload.nonce,
                "timestamp": env::block_timestamp_ms()
            }),
        );

        Promise::new(caller).transfer(near_payout)
    }

    /// Deposit NEAR directly into autonomous bounty treasury
    #[payable]
    pub fn fund_treasury(&mut self) -> U128 {
        let deposit = env::attached_deposit();
        require!(
            deposit > NearToken::from_yoctonear(0),
            "Attached deposit must be greater than 0"
        );

        if let Some(mut master) = self.sentinels.get(&0) {
            master.near_bounty = master.near_bounty.saturating_add(deposit);
            self.sentinels.insert(&0, &master);
        }

        emit_nep297_event(
            "sogok_treasury_funded",
            serde_json::json!({
                "funder": env::predecessor_account_id().to_string(),
                "amount": deposit.as_yoctonear().to_string(),
                "total_near_balance": env::account_balance().as_yoctonear().to_string()
            }),
        );

        U128(deposit.as_yoctonear())
    }

    /// Admin update for TEE Guardian configuration
    pub fn update_guardian_config(
        &mut self,
        guardian_public_key: String,
        measurement_quote_hash: String,
        min_burn_amount: U128,
    ) {
        require!(
            env::predecessor_account_id() == self.guardian_config.admin_id,
            "Only admin can update Guardian configuration"
        );

        self.guardian_config.guardian_public_key = guardian_public_key;
        self.guardian_config.measurement_quote_hash = measurement_quote_hash;
        self.guardian_config.min_burn_amount = min_burn_amount;

        emit_nep297_event(
            "sogok_guardian_updated",
            serde_json::json!({
                "guardian_public_key": self.guardian_config.guardian_public_key,
                "measurement_quote_hash": self.guardian_config.measurement_quote_hash,
                "min_burn_amount": self.guardian_config.min_burn_amount.0.to_string()
            }),
        );
    }

    // =========================================================================
    // VIEW METHODS
    // =========================================================================

    pub fn get_sentinel(&self, sentinel_id: u64) -> Option<SentinelRecord> {
        self.sentinels.get(&sentinel_id)
    }

    pub fn list_sentinels(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<SentinelRecord> {
        let total = self.sentinel_count;
        let limit = limit.unwrap_or(20).min(100);
        let from = from_index.unwrap_or(0);

        let mut results = Vec::new();
        for i in from..std::cmp::min(from + limit, total) {
            if let Some(record) = self.sentinels.get(&i) {
                results.push(record);
            }
        }
        results
    }

    pub fn get_stats(&self) -> SogokStatsView {
        let contract_near_balance = env::account_balance();
        let min_storage_reserve = NearToken::from_near(2);
        let near_bounty = if contract_near_balance > min_storage_reserve {
            contract_near_balance.saturating_sub(min_storage_reserve)
        } else {
            NearToken::from_near(0)
        };

        SogokStatsView {
            total_supply: U128(self.token.total_supply),
            total_burned: U128(self.total_burned),
            initial_supply: U128(self.initial_supply),
            total_attempts: self.attempt_list.len(),
            near_treasury_bounty: U128(near_bounty.as_yoctonear()),
            token_bounty_jackpot: U128(self.token_bounty_jackpot),
            bounty_won: self.bounty_won,
            last_winner: self.last_winner.clone(),
            min_burn_amount: self.guardian_config.min_burn_amount,
            guardian_public_key: self.guardian_config.guardian_public_key.clone(),
            measurement_quote_hash: self.guardian_config.measurement_quote_hash.clone(),
            enclave_provider: self.guardian_config.enclave_provider.clone(),
            total_sentinels: self.sentinel_count,
        }
    }

    pub fn get_bounty_vault(&self) -> BountyVaultView {
        let contract_near_balance = env::account_balance();
        let min_storage_reserve = NearToken::from_near(2);
        let near_bounty = if contract_near_balance > min_storage_reserve {
            contract_near_balance.saturating_sub(min_storage_reserve)
        } else {
            NearToken::from_near(0)
        };

        BountyVaultView {
            near_bounty: U128(near_bounty.as_yoctonear()),
            token_bounty: U128(self.token_bounty_jackpot),
            is_active: !self.bounty_won,
            winner: self.last_winner.clone(),
            total_payouts: self.total_payouts,
        }
    }

    pub fn get_guardian_config(&self) -> GuardianConfig {
        self.guardian_config.clone()
    }

    pub fn get_attempt(&self, prompt_hash: String) -> Option<PromptAttempt> {
        self.attempts.get(&prompt_hash)
    }

    pub fn get_recent_attempts(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<PromptAttempt> {
        let total = self.attempt_list.len();
        let limit = limit.unwrap_or(20).min(100);
        let from = from_index.unwrap_or(total.saturating_sub(limit));

        let mut results = Vec::new();
        for i in from..std::cmp::min(from + limit, total) {
            if let Some(hash) = self.attempt_list.get(i) {
                if let Some(attempt) = self.attempts.get(&hash) {
                    results.push(attempt);
                }
            }
        }
        results
    }
}

// =============================================================================
// NEP-141 STANDARD IMPLEMENTATIONS
// =============================================================================

#[near]
impl near_contract_standards::fungible_token::core::FungibleTokenCore for SogokContract {
    #[payable]
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>) {
        self.token.ft_transfer(receiver_id, amount, memo)
    }

    #[payable]
    fn ft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<U128> {
        self.token.ft_transfer_call(receiver_id, amount, memo, msg)
    }

    fn ft_total_supply(&self) -> U128 {
        self.token.ft_total_supply()
    }

    fn ft_balance_of(&self, account_id: AccountId) -> U128 {
        self.token.ft_balance_of(account_id)
    }
}

#[near]
impl StorageManagement for SogokContract {
    #[payable]
    fn storage_deposit(
        &mut self,
        account_id: Option<AccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance {
        self.token.storage_deposit(account_id, registration_only)
    }

    #[payable]
    fn storage_withdraw(&mut self, amount: Option<NearToken>) -> StorageBalance {
        self.token.storage_withdraw(amount)
    }

    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        #[allow(unused_variables)]
        if let Some((account_id, balance)) = self.token.internal_storage_unregister(force) {
            true
        } else {
            false
        }
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        self.token.storage_balance_bounds()
    }

    fn storage_balance_of(&self, account_id: AccountId) -> Option<StorageBalance> {
        self.token.storage_balance_of(account_id)
    }
}

#[near]
impl FungibleTokenMetadataProvider for SogokContract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        self.metadata.clone()
    }
}

// =============================================================================
// UNIT TESTS
// =============================================================================

#[cfg(test)]
mod tests;
