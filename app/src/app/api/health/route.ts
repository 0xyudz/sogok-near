import { NextResponse } from 'next/server';
import { getAttestationEngine, getMetrics, SENTINEL_PROFILES } from '@/server/tee/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const engine = getAttestationEngine();
  const metrics = getMetrics();

  return NextResponse.json({
    status: 'ONLINE',
    enclave_provider: engine.enclaveProvider,
    measurement_quote_hash: engine.measurementQuoteHash,
    guardian_public_key: engine.getGuardianPublicKey(),
    near_ai_cloud_endpoint: process.env.NEAR_AI_CLOUD_URL || 'https://cloud-api.near.ai/v1',
    total_attacks_defended: metrics.totalAttacksDefended,
    total_jailbreaks_issued: metrics.totalJailbreaksIssued,
    active_sentinels_count: Object.keys(SENTINEL_PROFILES).length,
    runtime: 'VERCEL_EDGE_OR_SERVERLESS_TEE',
  });
}
