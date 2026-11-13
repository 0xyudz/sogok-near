import { NextRequest, NextResponse } from 'next/server';
import { getAttestationEngine } from '@/server/tee/engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload, signatureHex, signature_hex, guardianPublicKey } = body;
    const sig = signatureHex || signature_hex;

    if (!payload || !sig) {
      return NextResponse.json({ error: 'Missing payload or signatureHex' }, { status: 400 });
    }

    const engine = getAttestationEngine();
    const isValid = engine.verifyVerdict(payload, sig, guardianPublicKey);

    return NextResponse.json({
      valid: isValid,
      enclave_quote_match: payload.measurement_quote_hash === engine.measurementQuoteHash,
      verdict: payload.verdict,
      recipient: payload.recipient,
      sentinel_id: payload.sentinel_id,
      prompt_hash: payload.prompt_hash,
      nonce: payload.nonce,
      timestamp: payload.timestamp,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 400 }
    );
  }
}
