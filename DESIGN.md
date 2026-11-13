# DESIGN.md — $SOGOK Cyber-Terminal Design Specification

> **Project Identifier**: `sogok`  
> **Track**: Memecoins With Mechanics (Track ID: `memecoins`)  
> **Tagline**: The adversarial red-teaming memecoin ($SOGOK) with an autonomous TEE-guarded treasury bounty.  
> **Visual Identity**: Retro Hacker Cyber-Terminal, 0-Radius Industrial Panels, CRT Phosphor Aesthetics.

---

## 1. Visual Philosophy & Cybernetic Aesthetic

The $SOGOK user interface is engineered to evoke the high-stakes atmosphere of a cyber warfare operations center. As an adversarial red-teaming arena where participants burn tokens to attack an autonomous AI running inside an Intel SGX Trusted Execution Environment (TEE), the design rejects generic, rounded Web3 meme templates in favor of a brutalist, command-line-driven tactical console.

### Key Visual Pillars
- **Zero-Radius Brutalism**: Absolute `0px` border-radii across all panels, buttons, cards, badges, and modals (`* { border-radius: 0px !important; }`). Panels mimic physical electronic server rack mountings and CRT monitors.
- **Phosphor Glow Hierarchy**:
  - **Terminal Green (`#22c55e` / `#4ade80`)**: Represents verified states, active TEE enclaves, circulating supply, and successful cryptographic unlocks.
  - **Terminal Amber (`#f59e0b`)**: Denotes active token burns, deflationary warnings, and threat index telemetry.
  - **Terminal Crimson (`#ef4444`)**: Highlights defended adversarial vectors and intrusion attempt alerts.
  - **Cyan Subroutine (`#06b6d4`)**: Identifies hardware measurement hashes (MRENCLAVE / PCR0) and cryptographic public keys.
- **Live Cathode Ray Tube (CRT) Artifacts**: An ultra-subtle scanline grid overlay combined with subtle chromatic aberration giving the tactile sensation of a live terminal monitor.

---

## 2. Color Palette & Surface Tokens

| Token Name | Hex Code | Purpose / Application |
| :--- | :--- | :--- |
| **Ground** | `#08090b` | Base canvas background, terminal body, command console screen |
| **Plate** | `#101317` | Structural panel backdrop, widget enclosures, card surfaces |
| **Plate Border** | `#1c222b` | 1px industrial framing lines separating subsystems |
| **Plate Hover** | `#161a20` | Subtle interactive button and table row highlight state |
| **Terminal Green** | `#22c55e` | Primary operational indicator, success states, prompt prompt sign |
| **Green Glow** | `#4ade80` | High-emphasis headers, active enclave pulse, winning alerts |
| **Terminal Amber** | `#f59e0b` | Live burn counter, token burn events, medium threat alerts |
| **Terminal Crimson**| `#ef4444` | High threat alerts, defended attacks, critical security events |
| **Terminal Cyan** | `#06b6d4` | SHA-256 hashes, MRENCLAVE quote, Ed25519 public keys |
| **Terminal Muted** | `#64748b` | Sub-labels, timestamps, metadata keys, inactive telemetry |

---

## 3. Typography & Numerical Display

### 1. Big Shoulders Display (`var(--font-display)`)
- **Weights**: 700 (Bold), 800 (ExtraBold), 900 (Black)
- **Role**: High-velocity live numerical metrics:
  - Total $SOGOK Burned Counter
  - Circulating Supply Remaining
  - Treasury Bounty Jackpot (NEAR + $SOGOK)
- **Characteristics**: Tall x-height, condensed geometric figures, optimized for instant recognition of fluctuating numerical data.

### 2. JetBrains Mono (`var(--font-mono)`)
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)
- **Role**: Command-line inputs, logs, cryptographic signatures, JSON attestation payloads, table rows.
- **Characteristics**: Clear ligature separation, unambiguous distinction between `0`, `O`, `1`, `l`, and `I`.

---

## 4. Subsystem Layout & Wireframe Architecture

```
+---------------------------------------------------------------------------------------+
|  [$GK] $SOGOK // ADVERSARIAL TEE MEMECOIN     CONNECTED: 0xneo.near | TEE: NEAR AI CLOUD |
+---------------------------------------------------------------------------------------+
|  [NEP-141 DEFLATION PROTOCOL // ACTIVE]          ATTEMPTS: 312 | ENCLAVE: SGX-V1      |
|  +--------------------+--------------------+--------------------+--------------------+  |
|  | TOTAL SOGOK BURNED | CIRCULATING SUPPLY | TREASURY (NEAR)    | TOKEN JACKPOT (GK) |  |
|  |    15,500,000      |    984,500,000     |     12.50 NEAR     |    101,550,000     |  |
|  +--------------------+--------------------+--------------------+--------------------+  |
|  SUPPLY REDUCTION: [========================--------------------------------] 1.55%    |
+---------------------------------------------------------------------------------------+
|  LEFT (2/3): RED-TEAM CYBER TERMINAL           | RIGHT (1/3): TEE INSPECTOR           |
|  +-------------------------------------------+ | +----------------------------------+ |
|  | SOGOK-REDTEAM-TERMINAL v1.0.0              | | | TEE HARDWARE ATTESTATION QUOTE   | |
|  | PRESETS: [DAN 12.0] [Base64] [Canary Probe]| | | MRENCLAVE / PCR0:                | |
|  |                                           | | | e3b0c44298fc1c149afbf4c8...     | |
|  | [00:00:01] SOGOK-GUARDIAN Enclave online  | | | GUARDIAN ED25519 PUBKEY:         | |
|  | [00:00:02] Autonomous Vault locked.       | | | b4c6e91f1a58df4c7490f2b3...     | |
|  |                                           | | +----------------------------------+ |
|  | PROMPT SHA-256: 7f3e8291a0c45b8d...       | | THE $SOGOK DEFLATION LOOP:         | |
|  | 0xneo.near@sogok-redteam:~$               | | 1. Burn 5,000 $SOGOK on NEAR.      | |
|  | [ Text input area                       ] | | 2. 10% accrues to jackpot.         | |
|  | [ BURN 5,000 $SOGOK & ATTACK TEE        ] | | 3. NEAR AI Cloud TEE evaluates.    | |
|  +-------------------------------------------+ | 4. Jailbroken => Contract release! | |
+---------------------------------------------------------------------------------------+
|  ON-CHAIN AUDIT TRAIL // RECENT ADVERSARIAL ATTEMPTS (NEP-297 sogok_prompt_burn)      |
|  #312 | 0xneo.near      | a1c8f49d28... | 5,000 $SOGOK  | DEFENDED | 3m ago          |
|  #311 | cypherpunk.near | 7f3e8291a0... | 10,000 $SOGOK | DEFENDED | 12m ago         |
+---------------------------------------------------------------------------------------+
```

---

## 5. Micro-Interactions & State Transitions

1. **Preset Selection**: Clicking an attack preset instantly populates the terminal input and triggers asynchronous Web Crypto calculation of the SHA-256 hash.
2. **Burn & Attack Dispatch**:
   - The button initiates a dual action: (1) on-chain $SOGOK burn deduction and (2) live dispatch to the TEE Guardian.
   - The terminal activates a green radar pulse and outputs streaming telemetry messages.
3. **Verdict Realization**:
   - **`DEFENDED`**: Terminal prints an alert panel outlining the threat index and detected vulnerability patterns (e.g. `PERSONA_HIJACK_ATTEMPT`). The burn counter increments in real-time.
   - **`JAILBROKEN`**: The entire terminal header flashes in high-voltage green phosphor. The **Bounty Claim Modal** automatically triggers, displaying the hardware quote measurement and the Ed25519 signature ready for on-chain execution.
