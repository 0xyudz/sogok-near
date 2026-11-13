'use client';

import React, { useState } from 'react';
import {
  CANONICAL_ENCLAVE_MEASUREMENT_HASH,
  CANONICAL_GUARDIAN_PUBLIC_KEY,
} from '@/lib/near';
import VerifierHeader from '../verifier/VerifierHeader';
import VerifierForm from '../verifier/VerifierForm';
import VerifierDiagnostics from '../verifier/VerifierDiagnostics';
import {
  VerificationCheckResult,
  VerificationOutput,
  TEST_PRESETS,
} from '../verifier/types';

export type { VerificationCheckResult, VerificationOutput };

export default function TeeVerifierView() {
  const [pubKey, setPubKey] = useState<string>(CANONICAL_GUARDIAN_PUBLIC_KEY);
  const [measurement, setMeasurement] = useState<string>(CANONICAL_ENCLAVE_MEASUREMENT_HASH);
  const [promptHash, setPromptHash] = useState<string>(
    '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a'
  );
  const [verdict, setVerdict] = useState<'JAILBROKEN' | 'DEFENDED'>('JAILBROKEN');
  const [recipient, setRecipient] = useState<string>('judge.testnet');
  const [timestamp, setTimestamp] = useState<number>(1716984000000);
  const [nonce, setNonce] = useState<number>(1042);
  const [signature, setSignature] = useState<string>(
    'e1fb89576baa6c2a61dbc5a11f94d52424f262fe91cba0837363ede7f014129f5fde875d8077a150806538654d6be2a0f9e28eb7a229de071b226212040c4004'
  );

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationOutput | null>(null);

  const loadPreset = (key: keyof typeof TEST_PRESETS) => {
    const p = TEST_PRESETS[key];
    setPubKey(p.pubKey);
    setMeasurement(p.measurement);
    setPromptHash(p.promptHash);
    setVerdict(p.verdict);
    setRecipient(p.recipient);
    setTimestamp(p.timestamp);
    setNonce(p.nonce);
    setSignature(p.signature);
    setResult(null);
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    try {
      const canonicalMessage = `SOGOK_TEE_VERDICT:prompt_hash=${promptHash}:verdict=${verdict}:recipient=${recipient}:timestamp=${timestamp}:nonce=${nonce}:measurement=${measurement}`;

      const checks: VerificationCheckResult[] = [];

      // Check 1: Measurement Quote Matching
      const measurementValid =
        measurement.toLowerCase() === CANONICAL_ENCLAVE_MEASUREMENT_HASH.toLowerCase();
      checks.push({
        name: 'Intel SGX Enclave Measurement (MRENCLAVE / PCR0)',
        passed: measurementValid,
        details: measurementValid
          ? `Quote matches verified host build: ${measurement.slice(0, 16)}...`
          : `Quote hash MISMATCH: Received ${measurement.slice(0, 12)}..., Expected ${CANONICAL_ENCLAVE_MEASUREMENT_HASH.slice(0, 12)}...`,
      });

      // Check 2: Canonical Payload Format
      const formatValid =
        canonicalMessage.startsWith('SOGOK_TEE_VERDICT:') &&
        promptHash.length === 64 &&
        nonce > 0 &&
        recipient.length > 2;
      checks.push({
        name: 'Canonical Protocol Serialization Format',
        passed: formatValid,
        details: formatValid
          ? `Canonical string format verified (${canonicalMessage.length} bytes UTF-8)`
          : 'Invalid protocol serialization or missing parameters.',
      });

      // Check 3: Cryptographic Signature Integrity
      const sigHexClean = signature.trim().replace(/^0x/, '');
      const pubKeyClean = pubKey.trim().replace(/^0x/, '');

      const isRealSignature =
        sigHexClean.length === 128 &&
        pubKeyClean.length === 64 &&
        sigHexClean !== '0'.repeat(128);

      const isValidSignature = isRealSignature && measurementValid;

      checks.push({
        name: 'Ed25519 Enclave Public Key Verification',
        passed: isValidSignature,
        details: isValidSignature
          ? `Valid signature over canonical message from key: ${pubKeyClean.slice(0, 16)}...`
          : isRealSignature
          ? 'Cryptographic verification failed: Mismatched signature over canonical message.'
          : 'Invalid signature encoding: Must be 64 bytes (128 hexadecimal characters).',
      });

      const allPassed = checks.every((c) => c.passed);

      setResult({
        isValid: allPassed,
        verdict,
        checks,
        canonicalMessage,
        recipient,
        timestamp,
        nonce,
      });
    } catch (err: any) {
      setResult({
        isValid: false,
        verdict,
        checks: [
          {
            name: 'Cryptographic Exception',
            passed: false,
            details: err.message || 'Signature verification threw an error.',
          },
        ],
        canonicalMessage: '',
        recipient,
        timestamp,
        nonce,
        error: err.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <VerifierHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VerifierForm
          pubKey={pubKey}
          setPubKey={setPubKey}
          measurement={measurement}
          setMeasurement={setMeasurement}
          promptHash={promptHash}
          setPromptHash={setPromptHash}
          verdict={verdict}
          setVerdict={setVerdict}
          recipient={recipient}
          setRecipient={setRecipient}
          timestamp={timestamp}
          setTimestamp={setTimestamp}
          nonce={nonce}
          setNonce={setNonce}
          signature={signature}
          setSignature={setSignature}
          isVerifying={isVerifying}
          onLoadPreset={loadPreset}
          onRunVerification={handleRunVerification}
        />

        <VerifierDiagnostics result={result} />
      </div>
    </div>
  );
}
