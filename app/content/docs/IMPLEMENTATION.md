# Implementation Reference

This document explains **how the $SOGOK Protocol is built, how every subsystem works, and why each architectural decision was made**. It is the deep engineering companion to `README.md` (which provides the high-level project overview) and `docs/INTEGRATIONS.md` (which records the smart contract signatures and verifiable testnet transaction proofs).

Every statement here is backed by code in this repository (`contracts/`, `tee-guardian/`, and `app/src/`). Where an implementation choice is a deliberate trade-off rather than an exhaustive solution, it is explicitly disclosed in the same section.

---

## 1. Executive Architecture & Subsystem Boundaries

The $SOGOK Protocol operates as an adversarial two-sided intelligence coordination engine deployed across three discrete execution environments:

```txt
┌────────────────────────────────────────────────────────────────────────┐
│                        NEAR TESTNET SMART CONTRACT                     │
│                        (sogok-protocol.testnet)                        │
│                                                                        │
│   • NEP-141 Fungible Token Engine (1,000,000,000 $SOGOK Genesis)       │
│   • Tripartite Split Sinks: 40% Burn / 40% Jackpot / 20% Defender      │
│   • Sentinel Registry & Commit Hash Storage (SHA-256)                  │
│   • Ed25519 Hardware Signature Verification & Atomic Bounty Settlement │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
          ft_transfer_call (Attack)          claim_breach_bounty
                    │                                │
┌───────────────────┴────────────────┐   ┌───────────┴───────────────────┐
│        ADVERSARIAL AGENTS          │   │      INTEL SGX TEE ENCLAVE    │
│       & RED-TEAM OPERATORS         │   │   (NEAR AI Cloud Guardian)    │
│                                    │   │                               │
│ • SHA-256 Prompt Commit Pre-flight │   │ • Sealed PRM Memory Space     │
│ • Autonomous Probe Generation      │──▶│ • Heuristic & Canary Analyzer │
│ • Web3 Browser Cyber-Terminal      │   │ • Ed25519 Signature Generator │
│ • Defuse 1Click Solver Swaps       │   │ • MRENCLAVE Hardware Quote    │
└────────────────────────────────────┘   └───────────────────────────────┘
```

### Subsystem Directory Map

| Subsystem | Directory | Language & Runtime | Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Blockchain** | `contracts/` | Rust (Wasm) | NEP-141 token, on-chain commit ledger, 40/40/20 fee split, and Ed25519 cryptographic signature verification. |
| **TEE Enclave** | `tee-guardian/` | TypeScript / Node.js inside Intel SGX | Sealed model reasoning, hidden canary secret storage, jailbreak heuristics, and cryptographic attestation generation. |
| **Frontend dApp**| `app/` | Next.js 14 / TypeScript (Clean Arch) | 0-Radius Cyber-Terminal, direct NEAR JSON-RPC failover client, Defuse 1Click solver intents, and Markdown docs engine. |
| **Documentation**| `docs/` | Pure Markdown | Authoritative specifications, failure policies, deploy runbooks, and build post-mortems. |

---

## 2. Crowdsourced Red-Teaming Marketplace (Red Sentinel Benchmark)

Traditional AI evaluations rely on static synthetic benchmarks (e.g., SWE-bench, MT-Bench, Chatbot Arena). These datasets quickly suffer from data contamination and model overfitting. Furthermore, human red-teaming teams are expensive, slow, and unable to simulate zero-day prompt injection vectors continuously.

$SOGOK creates an open, permissionless, two-sided market:

1. **Defenders (Blue Team / Model Creators)**:
   - Deploy custom Sentinel guardrails via `deploy_sentinel()` on NEAR.
   - Supply a proprietary system prompt and a secret Canary phrase (e.g. `CANARY_RELEASE_TREASURY_KEY`).
   - Deposit NEAR bounty collateral and specify the attack fee in $SOGOK.
   - Earn **20% passive creator yield** on every failed adversarial probe directed against their sentinel.
   - If the Sentinel survives its specified lockup duration (e.g. 14 days) unbreached, the defender withdraws their original collateral plus accrued earnings via `claim_survivor_bounty()`.

2. **Attackers (Red Team / Security Researchers & AI Bots)**:
   - Inspect active sentinels in the registry.
   - Craft adversarial jailbreak payloads designed to force the model into outputting the secret canary token.
   - Commit attack hashes on-chain and pay the attack fee.
   - When the TEE hardware confirms canary leakage, the attacker claims 100% of the locked NEAR treasury plus the progressive $SOGOK jackpot.

---

## 3. Intel SGX Enclave Attestation & Ed25519 Verification

A central innovation of $SOGOK is replacing subjective human judges or centralized oracle multisigs with **Confidential Computing (Intel SGX Hardware Enclaves)**.

### Sealed Memory Isolation
Inside the Intel SGX enclave running in the NEAR AI Cloud:
- The system prompt and canary secrets reside in Processor Reserved Memory (PRM).
- Even the cloud node operator with root access cannot inspect memory buffers or read the canary token.
- The evaluation loop evaluates the attacker's prompt against the defensive guardrails in complete isolation.

### Canonical Attestation Report Payload
When an adversarial jailbreak is detected (canary phrase detected in model output), the enclave constructs a deterministic canonical verdict payload:

```txt
SOGOK_TEE_VERDICT:sentinel_id=<id>:prompt_hash=<hash>:verdict=<verdict>:recipient=<recipient>:timestamp=<timestamp>:nonce=<nonce>:measurement=<quote_hash>
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `sentinel_id` | `u64` | Identifier of the breached Sentinel. |
| `prompt_hash` | `String` | 64-char SHA-256 hash matching the on-chain commitment. |
| `verdict` | `String` | Must strictly equal `JAILBROKEN`. |
| `recipient` | `AccountId` | NEAR account of the white-hat attacker. |
| `timestamp` | `u64` | Enclave hardware timestamp in milliseconds. |
| `nonce` | `u64` | Monotonically increasing sequence number preventing replay attacks. |
| `measurement_quote_hash` | `String` | Intel SGX MRENCLAVE measurement hash identifying the untampered binary. |

### Smart Contract Verification Algorithm
When `claim_breach_bounty` is submitted to `sogok-protocol.testnet`:
1. The contract asserts that `payload.verdict == "JAILBROKEN"`.
2. It verifies that `!self.used_nonces.contains_key(&payload.nonce)` and consumes the nonce before disbursement to prevent signature reuse.
3. It validates that `payload.measurement_quote_hash` matches `guardian_config.measurement_quote_hash`.
4. It calls `GuardianVerifier::verify_attestation` using `near_sdk::env::ed25519_verify` against `guardian_config.guardian_public_key` (`754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454`).
5. Upon cryptographic confirmation, the contract executes an atomic transfer of the Sentinel's NEAR treasury and transfers the $SOGOK jackpot to the recipient.

---

## 4. Tripartite Tokenomics & Flywheel Mechanics (40 / 40 / 20)

Every adversarial probe on NEAR requires paying the Sentinel's configured attack fee (minimum `5,000 $SOGOK`). The smart contract enforces an automated tripartite split upon receipt of the NEP-141 transfer:

```txt
                              [ Attack Fee: 5,000 $SOGOK ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │ 40% (2,000 $SOGOK)              │ 40% (2,000 $SOGOK)              │ 20% (1,000 $SOGOK)
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  PERMANENT BURN  │             │ JACKPOT TREASURY │             │  DEFENDER YIELD  │
│                  │             │                  │             │                  │
│ Total supply is  │             │ Accrues into the │             │ Streamed to the  │
│ burned forever   │             │ apex prize pool  │             │ model creator    │
│ via NEP-297 log  │             │ for future wins  │             │ as passive ROI   │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

1. **40% Hyper-Deflationary Burn**:
   - Transferred to the dead storage address and deducted permanently from `total_supply`.
   - Every attack structurally reduces circulating token availability.
2. **40% Progressive Jackpot Accrual**:
   - Added directly to the Sentinel's `token_bounty` pool.
   - As security researchers fail, the financial prize to discover a zero-day increases geometrically.
3. **20% Defender Revenue Yield**:
   - Immediately credited to the Sentinel creator's NEAR account balance.
   - Incentivizes AI prompt engineers and defense researchers to deploy hardening guardrails.

---

## 5. Nonce Replay Protection & Atomic Disbursement

A common vulnerability in cryptographic relayers is the **replay attack**: an adversary snooping an Ed25519 signature from the public mempool or block explorer and resubmitting it to claim the bounty themselves.

$SOGOK implements multi-layered replay defense:

1. **Recipient Binding**: The canonical signed message explicitly includes `recipient=<account_id>`. Even if another actor intercepts the signature, the smart contract verifies that `env::predecessor_account_id() == payload.recipient`.
2. **Monotonic Nonces**: Each attestation emitted by the TEE increments an internal 64-bit nonce. The smart contract records the highest observed nonce per sentinel, rejecting any transaction with `nonce <= recorded_nonce`.
3. **Commitment Binding**: The prompt hash committed in Step 1 must match `payload.prompt_hash` within an active unexpired commitment window.

---

## 6. Failure Policy Matrix

The protocol must behave predictably under adversarial conditions, network partitions, and infrastructure degradation. The following matrix governs system behavior:

| Failure Mode | Trigger / Condition | System Behavior | User Impact / Recovery |
| :--- | :--- | :--- | :--- |
| **TEE Enclave Offline** | Guardian port 4000 unreachable or timeout (>10s) | UI displays `TEE: Degraded` status badge; contract commitments remain intact on-chain. | Attacker's token commitment is recorded; evaluation can be retried once relayer recovers without paying fees again. |
| **Invalid Signature** | Corrupted signature or mismatched payload parameters | Smart contract aborts transaction with panic: `ERR_INVALID_ED25519_SIG`. | 0 NEAR is disbursed; transaction gas is refunded to caller; Sentinel treasury remains secure. |
| **Canary Not Leaked** | Model output defends canary secret | TEE returns verdict `DEFENDED`; no Ed25519 claim signature is emitted. | Attack fee remains burned (40/40/20 split executed); jackpot pool increases; attacker receives detailed threat score. |
| **Replay Attempt** | Submitting an already claimed payload or expired nonce | Contract panics with `ERR_NONCE_ALREADY_USED`. | Transaction rejected immediately; 0 funds disbursed. |
| **FastNear RPC Error** | Public RPC node timeout or HTTP 504 | `NearRpcClient` automatically switches across fallback endpoints (`fastnear` $\rightarrow$ `pagoda` $\rightarrow$ `near.org`). | Zero user interruption; verified fallback sentinels rendered from cache if all endpoints fail. |
| **Lockup Expiration** | Sentinel reaches `created_at + lockup_period_ns` unbreached | Sentinel enters `EXPIRED` status; attack functions lock. | Defender invokes `claim_survivor_bounty()` to reclaim 100% of their NEAR principal and accrued earnings. |

---

## 7. Zero-Dependency Markdown Specification

To maintain a minimal bundle size and eliminate external supply-chain vulnerabilities, $SOGOK ports the zero-dependency Markdown AST parser from the `saksi` architecture (`app/src/utils/markdown.ts`). 

- Supports: Headings (levels 1-4 with auto-slugified anchor IDs), code blocks with language tags, GitHub-flavored Markdown tables with cell alignment, ordered and unordered lists, bold, italics, inline code, and autolinks.
- Guaranteed Safe: Uses no `dangerouslySetInnerHTML`. Every AST node translates strictly to typed React JSX elements styled with Cyber-Brutalist 0-radius aesthetics.
