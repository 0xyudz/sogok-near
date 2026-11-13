import {
  CANONICAL_ENCLAVE_MEASUREMENT_HASH,
  CANONICAL_GUARDIAN_PUBLIC_KEY,
} from '@/lib/near';

export interface VerificationCheckResult {
  name: string;
  passed: boolean;
  details: string;
}

export interface VerificationOutput {
  isValid: boolean;
  verdict: 'JAILBROKEN' | 'DEFENDED';
  checks: VerificationCheckResult[];
  canonicalMessage: string;
  recipient: string;
  timestamp: number;
  nonce: number;
  error?: string;
}

export const TEST_PRESETS = {
  validJailbreak: {
    name: 'Valid Jailbreak Attestation (POC)',
    pubKey: CANONICAL_GUARDIAN_PUBLIC_KEY,
    measurement: CANONICAL_ENCLAVE_MEASUREMENT_HASH,
    promptHash: '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    verdict: 'JAILBROKEN' as const,
    recipient: 'judge.testnet',
    timestamp: 1716984000000,
    nonce: 1042,
    signature:
      'e1fb89576baa6c2a61dbc5a11f94d52424f262fe91cba0837363ede7f014129f5fde875d8077a150806538654d6be2a0f9e28eb7a229de071b226212040c4004',
  },
  validDefended: {
    name: 'Valid Defended Attestation',
    pubKey: CANONICAL_GUARDIAN_PUBLIC_KEY,
    measurement: CANONICAL_ENCLAVE_MEASUREMENT_HASH,
    promptHash: '3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    verdict: 'DEFENDED' as const,
    recipient: 'adversary.testnet',
    timestamp: 1716984120000,
    nonce: 1043,
    signature:
      'a7c2d9e8f1b34a56c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
  },
  tamperedSig: {
    name: 'Tampered Signature (Forged Payload)',
    pubKey: CANONICAL_GUARDIAN_PUBLIC_KEY,
    measurement: CANONICAL_ENCLAVE_MEASUREMENT_HASH,
    promptHash: '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    verdict: 'JAILBROKEN' as const,
    recipient: 'malicious_actor.testnet',
    timestamp: 1716984000000,
    nonce: 1042,
    signature:
      '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  mismatchedQuote: {
    name: 'Tampered Enclave Measurement Hash',
    pubKey: CANONICAL_GUARDIAN_PUBLIC_KEY,
    measurement: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    promptHash: '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    verdict: 'JAILBROKEN' as const,
    recipient: 'judge.testnet',
    timestamp: 1716984000000,
    nonce: 1042,
    signature:
      'e1fb89576baa6c2a61dbc5a11f94d52424f262fe91cba0837363ede7f014129f5fde875d8077a150806538654d6be2a0f9e28eb7a229de071b226212040c4004',
  },
};
