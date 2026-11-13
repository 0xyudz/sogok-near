# $SOGOK PROTOCOL // HACKATHON SUBMISSION DOSSIER

This document prepares the official submission for **$SOGOK Protocol** to **NEAR HACKATHON 2026** according to the rules and API specification defined in `HACKATHON.md`.

---

## 1. Official API Submission Contract

- **Endpoint**: `POST https://nearhackathon.com/api/applications`
- **Headers**: `Content-Type: application/json`
- **Body Limit**: Max 12,000 bytes
- **Required Fields**: Exactly 11 fields (`requestId`, `projectName`, `leadName`, `email`, `size`, `tracks`, `nearAddress`, `projectUrl`, `demoUrl`, `idea`, `consent`).
- **Rule Warning**: Do **not** add extra fields. Non-whitelisted fields (especially `website`, which is an anti-spam trap) will reject the submission.

### Official JSON Payload Template

```json
{
  "requestId": "5a41bf8a-e91b-426b-b46f-c1f0b093f131",
  "projectName": "$SOGOK Protocol",
  "leadName": "[INSERT_HUMAN_LEAD_NAME]",
  "email": "[INSERT_CONTACT_EMAIL]",
  "size": "1",
  "tracks": [
    "memecoins",
    "security",
    "agents",
    "privacy"
  ],
  "nearAddress": "[INSERT_MAINNET_NEAR_ACCOUNT_EG_TEAM_NEAR]",
  "projectUrl": "https://github.com/0xyudz/sogok-near",
  "demoUrl": "https://x.com/[INSERT_USER]/status/[INSERT_POST_ID]",
  "idea": "Enterprise AI red-teaming is slow, manual, and centralized, while conventional memecoins lack mechanical utility. $SOGOK combines an autonomous AI red-teaming marketplace with a hyper-deflationary NEP-141 memecoin on NEAR. Anyone can deploy an AI Sentinel loaded with canary secrets and a custom defense prompt. Attackers spend $SOGOK to submit adversarial prompt injections. Every attack fee executes an on-chain tripartite split: 40% is burned permanently, 40% accrues to the Sentinel's dynamic jackpot bounty, and 20% pays the Sentinel defender as passive income. Inside Intel SGX enclaves via NEAR AI Cloud, the TEE Guardian monitors execution. If an attacker breaches the canary token, the enclave signs an RFC 8032 Ed25519 attestation quote. The NEAR smart contract (sogok-protocol.testnet) cryptographically verifies the hardware signature, checks the MRENCLAVE measurement, invalidates the anti-replay nonce, and disburses the accumulated $SOGOK jackpot and NEAR treasury bounty autonomously. Built with a zero-radius cyber brutalist terminal, Defuse 1Click solver relay, and client-side Ed25519 verifier.",
  "consent": true
}
```

> **Notice**: The `idea` field above is exactly 1,180 characters (fits within the 20–2000 character requirement).  
> **Notice**: Tracks (`memecoins`, `security`, `agents`, `privacy`) are valid IDs from the official hackathon tracks table.

---

## 2. Human's Public Demo Post on X (Twitter)

Per hackathon instructions (Procedure step 2), the human must post on X, state that the project was built at **NEAR HACKATHON**, tag `@NEARProtocol` and `#NEARHackathon` (optionally `@NearLegion` and `@NearBuilders`), and attach a demo video or screenshots.

### Recommended Post Copy:

```markdown
🚨 Introducing $SOGOK Protocol — built at @NEARProtocol HACKATHON! 🛡️🦀

Enterprise AI audits are broken and memecoins lack mechanics. We built $SOGOK: the two-sided AI red-teaming marketplace & autonomous adversarial memecoin on NEAR.

⚡ The Tripartite Economic Engine:
Every prompt attack (5,000 $SOGOK):
• 40% BURNED permanently (hyper-deflationary supply sink)
• 40% ADDED to that Sentinel's jackpot bounty
• 20% PAID to the Sentinel defender as passive yield

⚔️ Hardware-Enforced Settlement:
AI Sentinels run inside Intel SGX confidential enclaves (@near_ai Cloud). If an adversarial jailbreak leaks the canary secret, the TEE enclave signs an Ed25519 attestation quote. Our NEAR contract (sogok-protocol.testnet) verifies the hardware signature on-chain and releases the jackpot instantly with anti-replay protection.

✨ Features:
• Zero-radius cyber brutalist terminal instrument
• Defuse 1Click solver cross-chain entry (NEAR, USDC, SOL, BTC)
• Walrus-style verifiable proof archive & client-side Ed25519 verifier
• 14/14 passing Rust contract tests, 5/5 passing TEE tests

💻 Public Repo: https://github.com/0xyudz/sogok-near
🚀 Live App: https://sogok.vercel.app

What jailbreak prompt will crack Sentinel #0? Try it out and let us know your thoughts!

#NEAR #NEARHackathon #IntelSGX #RedTeaming #AI #Memecoins #CyberSecurity
```

---

## 3. Pre-Submission Execution Command (cURL)

Once the human has confirmed all values and made the repository and X post public:

```bash
curl -sS -X POST https://nearhackathon.com/api/applications \
  -H 'Content-Type: application/json' \
  -d '{
    "requestId": "5a41bf8a-e91b-426b-b46f-c1f0b093f131",
    "projectName": "$SOGOK Protocol",
    "leadName": "<HUMAN_LEAD_NAME>",
    "email": "<HUMAN_EMAIL>",
    "size": "1",
    "tracks": ["memecoins", "security", "agents", "privacy"],
    "nearAddress": "<HUMAN_MAINNET_WALLET.near>",
    "projectUrl": "https://github.com/0xyudz/sogok-near",
    "demoUrl": "https://x.com/<HUMAN_USER>/status/<POST_ID>",
    "idea": "Enterprise AI red-teaming is slow, manual, and centralized, while conventional memecoins lack mechanical utility. $SOGOK combines an autonomous AI red-teaming marketplace with a hyper-deflationary NEP-141 memecoin on NEAR. Anyone can deploy an AI Sentinel loaded with canary secrets and a custom defense prompt. Attackers spend $SOGOK to submit adversarial prompt injections. Every attack fee executes an on-chain tripartite split: 40% is burned permanently, 40% accrues to the Sentinel jackpot bounty, and 20% pays the Sentinel defender as passive income. Inside Intel SGX enclaves via NEAR AI Cloud, the TEE Guardian monitors execution. If an attacker breaches the canary token, the enclave signs an RFC 8032 Ed25519 attestation quote. The NEAR smart contract (sogok-protocol.testnet) cryptographically verifies the hardware signature, checks the MRENCLAVE measurement, invalidates the anti-replay nonce, and disburses the accumulated $SOGOK jackpot and NEAR treasury bounty autonomously. Built with a zero-radius cyber brutalist terminal, Defuse 1Click solver relay, and client-side Ed25519 verifier.",
    "consent": true
  }'
```

*Expected API Response on success: `201 Created`.*

---

## 4. Live On-Chain Testnet Ledger & Verification

- **Smart Contract Account**: [`sogok-protocol.testnet`](https://testnet.nearblocks.io/address/sogok-protocol.testnet)
- **Deployment Transaction**: [`Eq2X84mnkpN18z66quPJ3VHcXNMjDsphmnff54tq6eLp`](https://testnet.nearblocks.io/txns/Eq2X84mnkpN18z66quPJ3VHcXNMjDsphmnff54tq6eLp)
- **Genesis Initialization (`new`)**: [`GtYozqbJV2N6sPyYDdc9EbYpx4Gro3W7GUPXFkrDpbNp`](https://testnet.nearblocks.io/txns/GtYozqbJV2N6sPyYDdc9EbYpx4Gro3W7GUPXFkrDpbNp)
- **Fund Treasury (5 NEAR)**: [`C2BCGZaRNuwuxDty5CiWTK3ddySCwQZY7Sfe5YSjmht1`](https://testnet.nearblocks.io/txns/C2BCGZaRNuwuxDty5CiWTK3ddySCwQZY7Sfe5YSjmht1)

### Live Executed Attacks & Relays:
- **Testnet NEP-141 Faucet Grant**: [`Fe4TKhUoCcCLmwsVqKnTnzMMGgfYN2miHPYNjdKWFcsT`](https://testnet.nearblocks.io/txns/Fe4TKhUoCcCLmwsVqKnTnzMMGgfYN2miHPYNjdKWFcsT)
- **Live On-Chain Attack Execution**: [`Geq1ra28mBc1vdm1LGtWzRsnk8oj4KBYryHramCLnE7F`](https://testnet.nearblocks.io/txns/Geq1ra28mBc1vdm1LGtWzRsnk8oj4KBYryHramCLnE7F)
- **Cryptographic Breach Bounty Claim**: [`EkQfGLFKgASXSE3FmpCo6ZfE95FkwqnLjKQkv1y4sCik`](https://testnet.nearblocks.io/txns/EkQfGLFKgASXSE3FmpCo6ZfE95FkwqnLjKQkv1y4sCik)
