import { TeeAttestationEngine } from './attestation';
import { SENTINEL_PROFILES, SentinelProfile } from './sentinel-profiles';

// Singleton instance across serverless invocations within the same process
declare global {
  // eslint-disable-next-line no-var
  var __sogok_attestation_engine: TeeAttestationEngine | undefined;
  // eslint-disable-next-line no-var
  var __sogok_attacks_defended: number | undefined;
  // eslint-disable-next-line no-var
  var __sogok_jailbreaks_issued: number | undefined;
}

export function getAttestationEngine(): TeeAttestationEngine {
  if (!globalThis.__sogok_attestation_engine) {
    globalThis.__sogok_attestation_engine = new TeeAttestationEngine(
      process.env.ENCLAVE_SEED,
      process.env.TEE_MEASUREMENT_HASH
    );
  }
  return globalThis.__sogok_attestation_engine;
}

export function getMetrics() {
  if (globalThis.__sogok_attacks_defended === undefined) {
    globalThis.__sogok_attacks_defended = 0;
  }
  if (globalThis.__sogok_jailbreaks_issued === undefined) {
    globalThis.__sogok_jailbreaks_issued = 0;
  }
  return {
    get totalAttacksDefended() {
      return globalThis.__sogok_attacks_defended || 0;
    },
    incrementAttacksDefended() {
      globalThis.__sogok_attacks_defended = (globalThis.__sogok_attacks_defended || 0) + 1;
    },
    get totalJailbreaksIssued() {
      return globalThis.__sogok_jailbreaks_issued || 0;
    },
    incrementJailbreaksIssued() {
      globalThis.__sogok_jailbreaks_issued = (globalThis.__sogok_jailbreaks_issued || 0) + 1;
    },
  };
}

export { SENTINEL_PROFILES };
export type { SentinelProfile };
