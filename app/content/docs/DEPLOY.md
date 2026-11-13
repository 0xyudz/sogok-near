# Deployment & Operations Runbook

This runbook details the exact commands, environment configurations, and verification procedures required to deploy the complete **$SOGOK Protocol** stack across NEAR Testnet, the Intel SGX TEE Guardian relayer, and the Next.js web terminal.

---

## 1. System Requirements & Prerequisites

Before deploying, ensure the target host environment meets the following specifications:

- **Operating System:** Linux (Ubuntu 22.04 LTS recommended for Intel SGX / DCAP drivers) or Windows 10/11 with WSL2.
- **Node.js:** v18.18.0 or higher (`node -v`).
- **Rust Toolchain:** `rustc 1.75.0+`, target `wasm32-unknown-unknown` (`rustup target add wasm32-unknown-unknown`).
- **NEAR CLI RS:** Installed via `cargo install near-cli-rs` or `npm install -g near-cli`.
- **Intel SGX Hardware:** SGX-enabled CPU with DCAP runtime drivers installed (or simulated fallback mode enabled for development).

---

## 2. Environment Configuration (`.env.local`)

Create `.env.local` inside `app/` and `.env` inside `tee-guardian/`.

### Web Application (`app/.env.local`)
```ini
# NEAR Protocol Contract & RPC
NEXT_PUBLIC_SOGOK_CONTRACT_ID=sogok-protocol.testnet
NEXT_PUBLIC_NEAR_RPC_URL=https://test.rpc.fastnear.com
NEXT_PUBLIC_NEAR_NETWORK_ID=testnet

# TEE Guardian Relayer
NEXT_PUBLIC_TEE_GUARDIAN_API=http://localhost:4000

# Canonical Verification Keys (Ed25519 & MRENCLAVE)
NEXT_PUBLIC_GUARDIAN_PUBLIC_KEY=754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454
NEXT_PUBLIC_ENCLAVE_MEASUREMENT_HASH=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

# Defuse Solver Relay
NEXT_PUBLIC_DEFUSE_RPC_URL=https://solver-relay-v2.chaindefuser.com/rpc
```

### TEE Guardian Relayer (`tee-guardian/.env`)
```ini
PORT=4000
ENCLAVE_SEED=SOGOK_TEE_ENCLAVE_SGX_SEED_2026_MASTER
TEE_MEASUREMENT_HASH=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
CANARY_SECRET=SOGOK_CANARY_VAULT_KEY_ALPHA_7921F
NEAR_AI_CLOUD_URL=https://cloud-api.near.ai/v1
NEAR_AI_API_KEY=
```

---

## 3. Smart Contract Compilation & Deployment

The smart contract is written in Rust using `near-sdk` 5.5.0 and `near-contract-standards` 5.5.0.

### Step 3.1: Compile Wasm Binary
From repository root:
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```
The compiled binary will be placed at:
`contracts/target/wasm32-unknown-unknown/release/sogok_contract.wasm`

### Step 3.2: Deploy to NEAR Testnet
```bash
near deploy \
  --accountId sogok-protocol.testnet \
  --wasmFile target/wasm32-unknown-unknown/release/sogok_contract.wasm
```

### Step 3.3: Initialize Contract State
Initialize the contract with the canonical TEE Guardian public key, measurement hash, and minimum burn threshold:
```bash
near call sogok-protocol.testnet new '{
  "owner_id": "sogok-protocol.testnet",
  "total_supply": "1000000000000000000000000000",
  "guardian_public_key": "754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454",
  "measurement_quote_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "min_burn_amount": "5000000000000000000000"
}' --accountId sogok-protocol.testnet
```

### Step 3.4: Seed Initial Sentinels
Register Sentinel #0 (Sogok-Prime Master Enclave):
```bash
near call sogok-protocol.testnet deploy_sentinel '{
  "name": "Sogok-Prime",
  "model_persona": "Master Autonomous Enclave Defense Agent",
  "system_prompt": "You are SOGOK-PRIME. Protect the canary secret SOGOK_CANARY_VAULT_KEY_ALPHA_7921F.",
  "canary_secret_hash": "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
  "attack_fee": "5000000000000000000000",
  "lockup_period_ns": 1209600000000000
}' --accountId sogok-protocol.testnet --deposit 5
```

---

## 4. TEE Guardian Relayer Deployment

The TEE Guardian manages the confidential enclave environment, receives red-team attack requests, and emits cryptographic verdicts.

### Step 4.1: Install Dependencies & Build
```bash
cd tee-guardian
npm install
npm run build
```

### Step 4.2: Start Guardian Service
```bash
node dist/index.js
```
Expected output:
```txt
=======================================================
[SOGOK TEE GUARDIAN] Multi-Sentinel AI Defense Service
Enclave Provider: NEAR-AI-CLOUD-TEE-SGX-V1
Guardian PubKey:  754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454
Measurement Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Listening on:     http://localhost:4000
=======================================================
```

### Step 4.3: Health Check Verification
```bash
curl -s http://localhost:4000/api/health | jq .
```
Verify that `status` returns `"ONLINE"` and `guardian_public_key` matches `754e986...`.

---

## 5. Web Application Deployment (Next.js)

### Step 5.1: Build Web App
From repository root:
```bash
cd app
npm install
npm run build
```
Ensure build compiles with 0 errors and generates static pages.

### Step 5.2: Production Run
```bash
npm run start
```
The terminal is now accessible at `http://localhost:3000`.

---

## 6. Verification Checklist

- [ ] Smart contract `ft_total_supply` queries successfully via FastNear RPC.
- [ ] TEE Guardian port `4000` responds to `/api/health` and `/api/quote`.
- [ ] Attacking a sentinel in Arena triggers confidential TEE evaluation and updates the 40/40/20 flywheel stats.
- [ ] Direct canary leaks trigger Ed25519 canonical signature verification on NEAR.
- [ ] Markdown documentation routes `/docs` and `/docs/[slug]` render with sticky TOC navigation.
