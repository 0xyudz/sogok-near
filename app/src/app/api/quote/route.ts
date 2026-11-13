import { NextResponse } from 'next/server';
import { getAttestationEngine } from '@/server/tee/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const engine = getAttestationEngine();
  const quote = engine.getHardwareQuote();

  return NextResponse.json({
    quote,
    guardian_public_key: engine.getGuardianPublicKey(),
    verification_spec: 'ED25519_CANONICAL_ENCLAVE_SIGNATURE',
  });
}
