export interface DocEntry {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly summary: string;
}

export const DOCS: readonly DocEntry[] = [
  {
    slug: "overview",
    file: "README.md",
    title: "System Overview",
    eyebrow: "Start Here",
    summary:
      "What $SOGOK is, how the Red Sentinel benchmark works, system architecture, standard compliance, and live testnet smart contract addresses.",
  },
  {
    slug: "implementation",
    file: "docs/IMPLEMENTATION.md",
    title: "Implementation Reference",
    eyebrow: "Engineering Spec",
    summary:
      "Crowdsourced red-teaming dynamics, Intel SGX attestation, Ed25519 signature verification, 40/40/20 flywheel tokenomics, and the failure policy matrix.",
  },
  {
    slug: "integrations",
    file: "docs/INTEGRATIONS.md",
    title: "Integrations & Proof Table",
    eyebrow: "Cryptographic Proofs",
    summary:
      "NEAR Testnet contracts (sogok-protocol.testnet), TEE Guardian relayer endpoints, DCAP hardware quote structure, Defuse 1Click API, and verified block transactions.",
  },
  {
    slug: "blog",
    file: "docs/BLOG.md",
    title: "Build Notes & Threat Vectors",
    eyebrow: "Post-Mortem & Security",
    summary:
      "The rationale for anchoring memecoin economics to TEE security, adversarial prompt injection post-mortems, and canary memory isolation.",
  },
  {
    slug: "deploy",
    file: "docs/DEPLOY.md",
    title: "Deployment & Operations Runbook",
    eyebrow: "DevOps & Setup",
    summary:
      "Step-by-step instructions for deploying the Rust Wasm contract, running the Intel SGX TEE Guardian on port 4000, and building the cyber-terminal web app.",
  },
];
