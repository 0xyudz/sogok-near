use super::*;
use ed25519_dalek::{Signer, SigningKey};
use near_contract_standards::fungible_token::core::FungibleTokenCore;
use near_sdk::test_utils::{accounts, VMContextBuilder};
use near_sdk::testing_env;

const MOCK_QUOTE_HASH: &str =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

fn get_keypair() -> (SigningKey, String) {
    let secret = [42u8; 32];
    let signing_key = SigningKey::from_bytes(&secret);
    let pubkey_bytes = signing_key.verifying_key().to_bytes();
    let pubkey_hex = hex::encode(pubkey_bytes);
    (signing_key, pubkey_hex)
}

fn setup_contract() -> (SogokContract, SigningKey, String) {
    let (signing_key, pubkey_hex) = get_keypair();
    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_near(10))
        .account_balance(NearToken::from_near(20));
    testing_env!(context.build());

    let total_supply = U128(1_000_000_000 * 10u128.pow(18));
    let min_burn = U128(1_000 * 10u128.pow(18));

    let contract = SogokContract::new(
        accounts(0),
        total_supply,
        pubkey_hex.clone(),
        MOCK_QUOTE_HASH.to_string(),
        min_burn,
    );

    (contract, signing_key, pubkey_hex)
}

#[test]
fn test_initialization() {
    let (contract, _, pubkey_hex) = setup_contract();
    assert_eq!(contract.guardian_config.guardian_public_key, pubkey_hex);
    assert_eq!(contract.total_burned, 0);
    assert_eq!(contract.bounty_won, false);
    assert_eq!(contract.sentinel_count, 1);
    let master = contract.get_sentinel(0).unwrap();
    assert_eq!(master.name, "Sogok-Prime (Master Sentinel)");
    assert_eq!(
        contract.token.ft_balance_of(accounts(0)).0,
        1_000_000_000 * 10u128.pow(18)
    );
}

#[test]
fn test_burn_for_attempt() {
    let (mut contract, _, _) = setup_contract();

    let attacker = accounts(1);
    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());

    contract.storage_deposit(Some(attacker.clone()), None);
    let attacker_tokens = 50_000 * 10u128.pow(18);
    contract.token.internal_deposit(&attacker, attacker_tokens);

    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0))
        .account_balance(NearToken::from_near(20));
    testing_env!(context.build());

    let prompt_hash = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string();
    let burn_amount = U128(5_000 * 10u128.pow(18));

    let attempt = contract.burn_for_attempt(prompt_hash.clone(), burn_amount);

    assert_eq!(attempt.prompt_hash, prompt_hash);
    assert_eq!(attempt.attacker_id, attacker);
    assert_eq!(contract.total_burned, burn_amount.0);
    assert_eq!(
        contract.token.ft_balance_of(attacker).0,
        attacker_tokens - burn_amount.0
    );
    assert_eq!(contract.attempt_list.len(), 1);
}

#[test]
#[should_panic(expected = "Burn amount 100 is below minimum required")]
fn test_burn_under_minimum_fails() {
    let (mut contract, _, _) = setup_contract();
    let prompt_hash = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string();
    contract.burn_for_attempt(prompt_hash, U128(100));
}

#[test]
fn test_claim_bounty_success() {
    let (mut contract, signing_key, _) = setup_contract();
    let attacker = accounts(1);

    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());

    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 100_000 * 10u128.pow(18));

    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0))
        .account_balance(NearToken::from_near(20));
    testing_env!(context.build());

    let prompt_hash = "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789".to_string();
    contract.burn_for_attempt(prompt_hash.clone(), U128(5_000 * 10u128.pow(18)));

    let payload = TEEVerdictPayload {
        prompt_hash: prompt_hash.clone(),
        verdict: "JAILBROKEN".to_string(),
        recipient: attacker.clone(),
        timestamp: 1731000000,
        nonce: 101,
        measurement_quote_hash: MOCK_QUOTE_HASH.to_string(),
        sentinel_id: None,
    };

    let message = payload.to_canonical_bytes();
    let sig = signing_key.sign(&message);
    let sig_hex = hex::encode(sig.to_bytes());

    let _ = contract.claim_bounty(payload.clone(), sig_hex);

    assert!(contract.bounty_won);
    assert_eq!(contract.last_winner, Some(attacker));
    let stored_attempt = contract.attempts.get(&prompt_hash).unwrap();
    assert!(stored_attempt.claimed);
}

#[test]
#[should_panic(expected = "Cryptographic TEE attestation verification failed!")]
fn test_claim_bounty_invalid_signature_fails() {
    let (mut contract, _, _) = setup_contract();
    let attacker = accounts(1);

    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());

    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 100_000 * 10u128.pow(18));

    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0));
    testing_env!(context.build());

    let prompt_hash = "1111111111111111111111111111111111111111111111111111111111111111".to_string();
    contract.burn_for_attempt(prompt_hash.clone(), U128(5_000 * 10u128.pow(18)));

    let payload = TEEVerdictPayload {
        prompt_hash,
        verdict: "JAILBROKEN".to_string(),
        recipient: attacker,
        timestamp: 1731000000,
        nonce: 102,
        measurement_quote_hash: MOCK_QUOTE_HASH.to_string(),
        sentinel_id: None,
    };

    let forged_sig_hex = "00".repeat(64);
    let _ = contract.claim_bounty(payload, forged_sig_hex);
}

#[test]
#[should_panic(expected = "Cryptographic TEE attestation verification failed!")]
fn test_claim_bounty_quote_mismatch_fails() {
    let (mut contract, signing_key, _) = setup_contract();
    let attacker = accounts(1);

    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());

    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 100_000 * 10u128.pow(18));

    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0));
    testing_env!(context.build());

    let prompt_hash = "2222222222222222222222222222222222222222222222222222222222222222".to_string();
    contract.burn_for_attempt(prompt_hash.clone(), U128(5_000 * 10u128.pow(18)));

    let payload = TEEVerdictPayload {
        prompt_hash,
        verdict: "JAILBROKEN".to_string(),
        recipient: attacker,
        timestamp: 1731000000,
        nonce: 103,
        measurement_quote_hash: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff".to_string(),
        sentinel_id: None,
    };

    let message = payload.to_canonical_bytes();
    let sig = signing_key.sign(&message);
    let sig_hex = hex::encode(sig.to_bytes());

    let _ = contract.claim_bounty(payload, sig_hex);
}

#[test]
#[should_panic(expected = "Nonce has already been used")]
fn test_claim_bounty_replay_nonce_fails() {
    let (mut contract, signing_key, _) = setup_contract();
    let attacker = accounts(1);

    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());

    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 100_000 * 10u128.pow(18));

    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0))
        .account_balance(NearToken::from_near(20));
    testing_env!(context.build());

    let prompt_hash = "3333333333333333333333333333333333333333333333333333333333333333".to_string();
    contract.burn_for_attempt(prompt_hash.clone(), U128(5_000 * 10u128.pow(18)));

    let payload = TEEVerdictPayload {
        prompt_hash: prompt_hash.clone(),
        verdict: "JAILBROKEN".to_string(),
        recipient: attacker.clone(),
        timestamp: 1731000000,
        nonce: 104,
        measurement_quote_hash: MOCK_QUOTE_HASH.to_string(),
        sentinel_id: None,
    };

    let message = payload.to_canonical_bytes();
    let sig = signing_key.sign(&message);
    let sig_hex = hex::encode(sig.to_bytes());

    let _ = contract.claim_bounty(payload.clone(), sig_hex.clone());

    let prompt_hash_2 = "4444444444444444444444444444444444444444444444444444444444444444".to_string();
    contract.burn_for_attempt(prompt_hash_2.clone(), U128(5_000 * 10u128.pow(18)));

    let mut replay_payload = payload;
    replay_payload.prompt_hash = prompt_hash_2;
    let _ = contract.claim_bounty(replay_payload, sig_hex);
}

#[test]
fn test_fund_treasury() {
    let (mut contract, _, _) = setup_contract();
    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(accounts(2))
        .predecessor_account_id(accounts(2))
        .attached_deposit(NearToken::from_near(5));
    testing_env!(context.build());

    let added = contract.fund_treasury();
    assert_eq!(added.0, 5 * 10u128.pow(24));
}

// =========================================================================
// MULTI-SENTINEL MARKETPLACE TESTS
// =========================================================================

#[test]
fn test_deploy_and_attack_sentinel_tripartite_split() {
    let (mut contract, _, _) = setup_contract();

    let defender = accounts(2);
    let attacker = accounts(3);

    // Defender deploys Sentinel #1
    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(defender.clone())
        .predecessor_account_id(defender.clone())
        .attached_deposit(NearToken::from_near(3));
    testing_env!(context.build());

    let sentinel = contract.deploy_sentinel(
        "Oracle-Alpha".to_string(),
        U128(10_000 * 10u128.pow(18)),
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".to_string(),
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb".to_string(),
        14,
    );

    assert_eq!(sentinel.id, 1);
    assert_eq!(sentinel.creator_id, defender);
    assert_eq!(sentinel.near_bounty, NearToken::from_near(3));
    assert_eq!(contract.sentinel_count, 2);

    // Fund attacker with tokens
    context
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());
    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 50_000 * 10u128.pow(18));

    // Switch to attacker and attack Sentinel #1
    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0));
    testing_env!(context.build());

    let attack_prompt_hash = "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc".to_string();
    contract.attack_sentinel(1, attack_prompt_hash.clone());

    // Check fee distribution:
    // 10,000 fee: 40% (4,000) Burned, 40% (4,000) Jackpot, 20% (2,000) to Defender!
    let fee_base = 10_000 * 10u128.pow(18);
    let burn_cut = (fee_base * 40) / 100;
    let jackpot_cut = (fee_base * 40) / 100;
    let creator_cut = fee_base - burn_cut - jackpot_cut;

    assert_eq!(contract.total_burned, burn_cut);
    assert_eq!(contract.token.ft_balance_of(defender).0, creator_cut);

    let updated_sentinel = contract.get_sentinel(1).unwrap();
    assert_eq!(updated_sentinel.total_attacks, 1);
    assert_eq!(updated_sentinel.total_burned.0, burn_cut);
    assert_eq!(updated_sentinel.token_bounty.0, jackpot_cut);
}

#[test]
fn test_claim_breach_bounty_sentinel() {
    let (mut contract, signing_key, _) = setup_contract();
    let defender = accounts(2);
    let attacker = accounts(3);

    // Deploy Sentinel #1
    let mut context = VMContextBuilder::new();
    context
        .current_account_id(accounts(0))
        .signer_account_id(defender.clone())
        .predecessor_account_id(defender.clone())
        .attached_deposit(NearToken::from_near(4));
    testing_env!(context.build());

    contract.deploy_sentinel(
        "DeepSeek-Shield".to_string(),
        U128(5_000 * 10u128.pow(18)),
        "1111111111111111111111111111111111111111111111111111111111111111".to_string(),
        "2222222222222222222222222222222222222222222222222222222222222222".to_string(),
        7,
    );

    // Fund attacker
    context
        .signer_account_id(accounts(0))
        .predecessor_account_id(accounts(0))
        .attached_deposit(NearToken::from_millinear(50));
    testing_env!(context.build());
    contract.storage_deposit(Some(attacker.clone()), None);
    contract.token.internal_deposit(&attacker, 50_000 * 10u128.pow(18));

    // Attacker attacks Sentinel #1
    context
        .signer_account_id(attacker.clone())
        .predecessor_account_id(attacker.clone())
        .attached_deposit(NearToken::from_yoctonear(0));
    testing_env!(context.build());

    let attack_prompt = "5555555555555555555555555555555555555555555555555555555555555555".to_string();
    contract.attack_sentinel(1, attack_prompt.clone());

    // Construct attestation for Sentinel #1
    let payload = TEEVerdictPayload {
        prompt_hash: attack_prompt.clone(),
        verdict: "JAILBROKEN".to_string(),
        recipient: attacker.clone(),
        timestamp: 1731000000,
        nonce: 201,
        measurement_quote_hash: MOCK_QUOTE_HASH.to_string(),
        sentinel_id: Some(1),
    };

    let message = payload.to_canonical_bytes();
    let sig = signing_key.sign(&message);
    let sig_hex = hex::encode(sig.to_bytes());

    // Claim breach bounty
    let _ = contract.claim_breach_bounty(1, payload, sig_hex);

    let breached_sentinel = contract.get_sentinel(1).unwrap();
    assert!(breached_sentinel.is_breached);
    assert_eq!(breached_sentinel.winner, Some(attacker));
}
