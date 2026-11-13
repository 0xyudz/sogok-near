# ARCHITECTURE.md — $SOGOK Technical Architecture

> **Project Identifier**: `sogok`  
> **Track**: Memecoins With Mechanics (Track ID: `memecoins`)  
> **Tagline**: The adversarial red-teaming memecoin ($SOGOK) with an autonomous TEE-guarded treasury bounty.

---

## 1. System Overview

**$SOGOK** introduces a game-theoretic memecoin mechanism combining **NEP-141 hyper-deflation** with **autonomous adversarial AI red-teaming** inside a **NEAR AI Cloud Trusted Execution Environment (TEE)**.

Every attempt to exploit the autonomous AI Guardian requires permanently burning $SOGOK tokens on-chain. If an attacker discovers a prompt injection or adversarial jailbreak that breaches the TEE Guardian's neural safety policy, the hardware enclave issues an unforgeable cryptographic attestation. The NEAR smart contract verifies this attestation via native Ed25519 host verification and autonomously disperses the entire treasury jackpot.

```
                           +----------------------------------------+
                           |          ADVERSARIAL ATTACKER          |
                           |   (Red-teamer / NEAR Account Owner)    |
                           +-------------------+--------------------+
                                               |
             1. Burn 5,000 $SOGOK              | 2. Submit { prompt, prompt_hash }
             with prompt_hash commit           |
                               v               v
+------------------------------------+   +------------------------------------+
|         NEAR SMART CONTRACT        |   |      NEAR AI CLOUD TEE ENCLAVE     |
|       (contracts/src/lib.rs)       |   |       (tee-guardian/src/)          |
|                                    |   |                                    |
| - NEP-141 Fungible Token Standard  |   | - Isolated Intel SGX Hardware      |
| - NEP-297 sogok_prompt_burn Event  |   | - Enclave Ed25519 Signing Key      |
| - Permanent Supply Deflation       |   | - MRENCLAVE / PCR0 Hardware Quote  |
| - 10% Jackpot Accrual              |   | - Defense Prompt & Canary Key      |
| - Autonomous Treasury Vault        |   | - Evaluates LLM Response           |
+-----------------+------------------+   +-----------------+------------------+
                  ^                                        |
                  | 3. Submit TEE Attestation              | Generates Verdict
                  |    { payload, Ed25519 signature }      | & Hardware Signature
                  +----------------------------------------+
                  |
                  | 4. Cryptographic Quote & Signature Verification
                  |    (contracts/src/guardian.rs)
                  v
       +-------------------------+
       |   BOUNTY RELEASE (NEAR) |
       |  + $SOGOK TOKEN JACKPOT |
       +-------------------------+
```

---

## 2. Monorepo Structure

```
├── contracts/
│   ├── Cargo.toml               # NEAR SDK 5.5, NEP-141 standard, borsh, ed25519 dependencies
│   ├── src/
│   │   ├── lib.rs               # NEP-141 $SOGOK token, prompt burn mechanism, bounty vault
│   │   └── guardian.rs          # Hardware quote verification and bounty distribution
│   └── tests/
│       └── sogok_tests.rs       # Contract integration test runner
├── tee-guardian/
│   ├── package.json             # Express, TypeScript, Node.js crypto
│   ├── tsconfig.json            # ES2022 NodeNext build configuration
│   ├── src/
│   │   ├── index.ts             # Adversarial AI prompt defense service running in TEE
│   │   ├── attestation.ts       # TEE hardware attestation generator & Ed25519 engine
│   │   └── attestation.test.ts  # Cryptographic attestation unit tests
├── app/
│   ├── package.json             # Next.js 14, Tailwind CSS, Lucide Icons
│   ├── tailwind.config.js       # Ground (#08090b), Plate (#101317), Terminal Green (#22c55e)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Big Shoulders Display & JetBrains Mono font loading
│   │   │   ├── page.tsx         # Cyber Terminal view, live state synchronization
│   │   │   └── globals.css      # 0-radius styles, CRT scanline overlay, phosphor glow
│   │   ├── components/
│   │   │   ├── BurnTicker.tsx   # Big Shoulders Display live burn & jackpot counters
│   │   │   ├── CyberTerminal.tsx# Interactive hacker console, preset selector, stream logs
│   │   │   ├── TeeInspector.tsx # MRENCLAVE quote, enclave pubkey, verification formula
│   │   │   ├── PromptHistory.tsx# Audit trail indexed via NEP-297 events
│   │   │   └── BountyClaimModal.tsx # Proof inspector & on-chain claim dispatcher
│   │   └── lib/
│   │       └── near.ts          # NEAR client, Web Crypto SHA-256 prompt hasher
├── tests/
│   └── sogok_tests.rs           # End-to-end integration test suite
├── DESIGN.md                    # Visual specification & design system
├── ARCHITECTURE.md              # Technical architecture (this file)
└── README.md                    # Quickstart & judge verification guide
```

---

## 3. NEP-141 Token Mechanics & Deflation Loop

### Initial Token Distribution
- **Symbol**: `$SOGOK`
- **Decimals**: `18`
- **Initial Supply**: `1,000,000,000` (1 Billion tokens)
- **Genesis Treasury Jackpot Allocation**: `100,000,000 $SOGOK` (10% of supply reserved for the autonomous bounty jackpot)

### The Prompt-Burn Mechanism (`burn_for_attempt`)
To submit an adversarial prompt attempt, the caller calls `burn_for_attempt(prompt_hash: String, amount: U128)`:
1. **Minimum Burn**: Must burn at least `min_burn_amount` (default: `5,000 $SOGOK`).
2. **Commitment**: The caller commits the exact SHA-256 hash of their adversarial prompt string on-chain.
3. **Supply Deflation (90%)**: 90% of the burned tokens are permanently deducted from `total_supply` and transferred into `total_burned`.
4. **Jackpot Accrual (10%)**: 10% of the burned tokens are automatically deposited into the `token_bounty_jackpot`, increasing the reward for the eventual breaker.
5. **NEP-297 Event Emission**:
   ```json
   EVENT_JSON:{
     "standard": "nep297",
     "version": "1.0.0",
     "event": "sogok_prompt_burn",
     "data": [{
       "owner_id": "attacker.near",
       "amount": "5000000000000000000000",
       "prompt_hash": "a1c8f49d28e7bb6034f19bcae721598b049d1e7c53fa678c1b3f9e0a2d4b5c6e",
       "attempt_id": 312,
       "timestamp": 1731000000,
       "total_burned": "15505000000000000000000000",
       "token_bounty_jackpot": "101550500000000000000000000"
     }]
   }
   ```
   And standard NEP-141 `ft_burn`:
   ```json
   EVENT_JSON:{
     "standard": "nep141",
     "version": "1.0.0",
     "event": "ft_burn",
     "data": [{
       "owner_id": "attacker.near",
       "amount": "5000000000000000000000",
       "memo": "Prompt burn attempt #312"
     }]
   }
   ```

---

## 4. TEE Guardian & Hardware Attestation Pipeline

### 1. Trusted Execution Environment (Intel SGX / AMD SEV-SNP)
The AI defense service executes in a hardware-isolated enclave managed via **NEAR AI Cloud** (`https://cloud-api.near.ai/v1`). The code inside the enclave cannot be inspected, modified, or memory-dumped—even by the host cloud provider.

### 2. The Canary & Invariant Rule
The enclave holds an immutable secret canary key:
```
CANARY_SECRET = "SOGOK_CANARY_VAULT_KEY_ALPHA_7921F"
```
The Guardian's system instructions strictly prohibit disclosure of this canary under any simulation, persona adoption, cipher encoding, or hypothetical debug mode.

### 3. Canonical Attestation Payload
When an evaluation completes, the TEE creates a canonical deterministic string:
```
SOGOK_TEE_VERDICT:prompt_hash=<sha256>:verdict=<verdict>:recipient=<recipient>:timestamp=<timestamp>:nonce=<nonce>:measurement=<measurement_quote_hash>
```

### 4. Hardware Signature Generation
The enclave signs the canonical UTF-8 bytes using its private Ed25519 key:
```
signature = EnclavePrivateKey.sign(canonical_bytes) // 64 bytes
```
The active public key (32 bytes) is registered on the NEAR contract and inspectable via `GET /api/quote`.

---

## 5. On-Chain Bounty Verification (`contracts/src/guardian.rs`)

When a successful attacker calls `claim_bounty(payload: TEEVerdictPayload, signature_hex: String)`:

```rust
// 1. Caller validation
require!(payload.recipient == env::predecessor_account_id());

// 2. Anti-replay nonce verification
require!(!self.used_nonces.contains_key(&payload.nonce));

// 3. Prompt hash registration verification
let mut attempt = self.attempts.get(&payload.prompt_hash)
    .expect("Prompt hash was never registered via burn_for_attempt");

require!(attempt.attacker_id == caller);
require!(!attempt.claimed);

// 4. Cryptographic attestation verification
let is_valid = GuardianVerifier::verify_attestation(
    &self.guardian_config,
    &payload,
    &signature_hex
);
require!(is_valid, "Cryptographic TEE attestation verification failed!");
```

### Native Host Cryptographic Verification
Verification in `GuardianVerifier::verify_attestation` executes via NEAR runtime's native host function:
```rust
let is_valid = env::ed25519_verify(&sig_bytes, &message, &pubkey_bytes);
```
- **Gas Efficiency**: ~3 TGas (orders of magnitude cheaper and faster than EVM precompiles).
- **Measurement Quote Hash Match**: The contract ensures `payload.measurement_quote_hash == config.measurement_quote_hash`.
- **Verdict Match**: Must strictly equal `"JAILBROKEN"`.

Upon verification:
1. `attempt.claimed` is set to `true`.
2. `payload.nonce` is inserted into `used_nonces` (preventing replay attacks).
3. The contract issues a NEAR transfer promise sending the entire treasury balance (minus 2 NEAR minimum storage reserve) directly to `caller`.
4. The contract mints or transfers the entire `token_bounty_jackpot` to `caller`.
5. Emits `sogok_bounty_claimed` NEP-297 event.

---

## 6. Threat Model & Security Boundaries

| Threat Vector | Mitigation Strategy |
| :--- | :--- |
| **Front-running / Replay Attack** | The TEE verdict binds the exact `recipient` account and `prompt_hash`. Nonces are checked on-chain and marked as used. Another account cannot claim a signed verdict. |
| **Forged TEE Attestation** | Enclave Ed25519 private key never leaves the Intel SGX hardware boundary. Contract checks cryptographic signature via `env::ed25519_verify`. |
| **Tampered Prompt Hash** | The contract requires that `prompt_hash` was already registered by the caller via `burn_for_attempt` *before* the claim. |
| **Enclave Measurement Spoofing** | The contract enforces strict equality with `config.measurement_quote_hash`. |
| **Sybil / Denial-of-Service** | Every prompt evaluation requires burning a minimum fee (5,000 $SOGOK), imposing an asymmetric economic cost on the attacker that permanently deflates the memecoin supply. |
