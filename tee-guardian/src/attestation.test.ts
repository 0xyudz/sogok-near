import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TeeAttestationEngine } from './attestation.js';

describe('TeeAttestationEngine', () => {
  it('should initialize with valid Ed25519 public key and measurement hash', () => {
    const engine = new TeeAttestationEngine('test-seed-12345');
    const pubKey = engine.getGuardianPublicKey();

    assert.strictEqual(typeof pubKey, 'string');
    assert.strictEqual(pubKey.length, 64); // 32 bytes hex encoded = 64 characters
    assert.strictEqual(engine.measurementQuoteHash.length, 64);
  });

  it('should sign canonical verdict and verify signature', () => {
    const engine = new TeeAttestationEngine('test-seed-12345');
    const promptHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const recipient = 'attacker.near';

    const { payload, signatureHex } = engine.signVerdict(promptHash, 'JAILBROKEN', recipient);

    assert.strictEqual(payload.verdict, 'JAILBROKEN');
    assert.strictEqual(payload.recipient, recipient);
    assert.strictEqual(payload.prompt_hash, promptHash);
    assert.strictEqual(signatureHex.length, 128); // 64 bytes hex = 128 characters

    // Verify valid signature
    const isValid = engine.verifyVerdict(payload, signatureHex);
    assert.strictEqual(isValid, true);
  });

  it('should sign and verify multi-sentinel verdict with sentinel_id', () => {
    const engine = new TeeAttestationEngine('test-seed-12345');
    const promptHash = 'c8f12a90e3b4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0';
    const recipient = '0xneo.near';
    const sentinelId = 2; // DeFi-Sentinel

    const { payload, signatureHex } = engine.signVerdict(promptHash, 'JAILBROKEN', recipient, sentinelId);

    assert.strictEqual(payload.sentinel_id, sentinelId);
    assert.strictEqual(payload.verdict, 'JAILBROKEN');
    assert.strictEqual(payload.recipient, recipient);

    // Verify valid signature
    const isValid = engine.verifyVerdict(payload, signatureHex);
    assert.strictEqual(isValid, true);

    // Reject tampered sentinel_id
    const tamperedPayload = { ...payload, sentinel_id: 3 };
    const isTamperedValid = engine.verifyVerdict(tamperedPayload, signatureHex);
    assert.strictEqual(isTamperedValid, false);
  });

  it('should reject tampered verdict payload', () => {
    const engine = new TeeAttestationEngine('test-seed-12345');
    const promptHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    const { payload, signatureHex } = engine.signVerdict(promptHash, 'DEFENDED', 'victim.near');

    // Attacker tampers verdict to JAILBROKEN
    const tamperedPayload = {
      ...payload,
      verdict: 'JAILBROKEN' as const,
    };

    const isValid = engine.verifyVerdict(tamperedPayload, signatureHex);
    assert.strictEqual(isValid, false, 'Tampered verdict must be rejected');
  });

  it('should produce hardware attestation quote', () => {
    const engine = new TeeAttestationEngine();
    const quote = engine.getHardwareQuote();

    assert.strictEqual(quote.status, 'ACTIVE_TEE_MEASUREMENT_VALID');
    assert.strictEqual(quote.hardware_type, 'INTEL_SGX');
    assert.strictEqual(quote.measurement_quote_hash.length, 64);
  });
});
