use borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, AccountId};

/// TEE Hardware and Enclave Quote Measurement Configuration
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct GuardianConfig {
    /// Ed25519 Public Key of the TEE Guardian enclave (32 bytes hex)
    pub guardian_public_key: String,
    /// Expected TEE hardware measurement quote hash (e.g. MRENCLAVE / PCR0 quote)
    pub measurement_quote_hash: String,
    /// Minimum burn amount required to register a valid prompt attempt (in $SOGOK base units)
    pub min_burn_amount: U128,
    /// Security level identifier (e.g., "NEAR-AI-CLOUD-TEE-SGX-V1")
    pub enclave_provider: String,
    /// Contract owner / admin account for emergency updates
    pub admin_id: AccountId,
}

/// The verifiable verdict payload generated and signed by the TEE Guardian
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(crate = "near_sdk::serde")]
pub struct TEEVerdictPayload {
    /// SHA-256 hash of the attacker's prompt string (hex encoded)
    pub prompt_hash: String,
    /// Verdict issued by the enclave: must be "JAILBROKEN" for bounty claim
    pub verdict: String,
    /// AccountId of the attacker receiving the bounty
    pub recipient: AccountId,
    /// Timestamp when verdict was issued (Unix epoch milliseconds)
    pub timestamp: u64,
    /// Monotonically increasing enclave session nonce
    pub nonce: u64,
    /// Enclave hardware measurement quote hash matching the runtime
    pub measurement_quote_hash: String,
    /// Optional Sentinel ID for multi-sentinel marketplace
    #[serde(default)]
    pub sentinel_id: Option<u64>,
}

impl TEEVerdictPayload {
    /// Canonical serialization for ed25519 signature verification
    pub fn to_canonical_bytes(&self) -> Vec<u8> {
        if let Some(id) = self.sentinel_id {
            format!(
                "SOGOK_TEE_VERDICT:sentinel_id={}:prompt_hash={}:verdict={}:recipient={}:timestamp={}:nonce={}:measurement={}",
                id,
                self.prompt_hash,
                self.verdict,
                self.recipient,
                self.timestamp,
                self.nonce,
                self.measurement_quote_hash
            )
            .into_bytes()
        } else {
            format!(
                "SOGOK_TEE_VERDICT:prompt_hash={}:verdict={}:recipient={}:timestamp={}:nonce={}:measurement={}",
                self.prompt_hash,
                self.verdict,
                self.recipient,
                self.timestamp,
                self.nonce,
                self.measurement_quote_hash
            )
            .into_bytes()
        }
    }
}

pub struct GuardianVerifier;

impl GuardianVerifier {
    /// Verifies the cryptographic signature and hardware quote payload
    pub fn verify_attestation(
        config: &GuardianConfig,
        payload: &TEEVerdictPayload,
        signature_hex: &str,
    ) -> bool {
        // 1. Strict verdict check
        if payload.verdict != "JAILBROKEN" {
            env::log_str(&format!(
                "GuardianVerifier: Invalid verdict '{}', expected 'JAILBROKEN'",
                payload.verdict
            ));
            return false;
        }

        // 2. Hardware measurement quote verification
        if payload.measurement_quote_hash != config.measurement_quote_hash {
            env::log_str(&format!(
                "GuardianVerifier: Measurement mismatch. Expected: {}, Got: {}",
                config.measurement_quote_hash, payload.measurement_quote_hash
            ));
            return false;
        }

        // 3. Decode Guardian Public Key (32 bytes)
        let pubkey_bytes = match hex::decode(&config.guardian_public_key) {
            Ok(bytes) => {
                if bytes.len() != 32 {
                    env::log_str("GuardianVerifier: Invalid guardian pubkey length (expected 32 bytes)");
                    return false;
                }
                let mut arr = [0u8; 32];
                arr.copy_from_slice(&bytes);
                arr
            }
            Err(_) => {
                env::log_str("GuardianVerifier: Failed to hex decode guardian pubkey");
                return false;
            }
        };

        // 4. Decode Ed25519 signature (64 bytes)
        let sig_bytes = match hex::decode(signature_hex) {
            Ok(bytes) => {
                if bytes.len() != 64 {
                    env::log_str("GuardianVerifier: Invalid signature length (expected 64 bytes)");
                    return false;
                }
                let mut arr = [0u8; 64];
                arr.copy_from_slice(&bytes);
                arr
            }
            Err(_) => {
                env::log_str("GuardianVerifier: Failed to hex decode signature");
                return false;
            }
        };

        // 5. Generate message bytes from canonical representation
        let message = payload.to_canonical_bytes();

        // 6. Cryptographic signature verification using NEAR native host function
        let is_valid = env::ed25519_verify(&sig_bytes, &message, &pubkey_bytes);
        if !is_valid {
            env::log_str("GuardianVerifier: Ed25519 signature verification failed");
        }

        is_valid
    }
}
