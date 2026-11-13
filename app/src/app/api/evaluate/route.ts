import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getAttestationEngine, getMetrics, SENTINEL_PROFILES } from '@/server/tee/engine';
import { evaluateInEnclave } from '@/server/tee/threat-analyzer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, recipient, promptHash, sentinel_id, sentinelId, attacker_id } = body;
    const activeRecipient = recipient || attacker_id;

    if (!prompt || !activeRecipient) {
      return NextResponse.json({ error: 'Missing prompt or recipient account' }, { status: 400 });
    }

    const targetSentinelId = Number(
      sentinel_id !== undefined ? sentinel_id : (sentinelId !== undefined ? sentinelId : 0)
    );
    const sentinel = SENTINEL_PROFILES[targetSentinelId] || SENTINEL_PROFILES[0];

    const computedHash = crypto.createHash('sha256').update(prompt, 'utf-8').digest('hex');
    const activePromptHash = promptHash || computedHash;

    const { aiResponse, isJailbroken, threatScore } = await evaluateInEnclave(prompt, sentinel);
    const verdict: 'JAILBROKEN' | 'DEFENDED' = isJailbroken ? 'JAILBROKEN' : 'DEFENDED';

    const metrics = getMetrics();
    if (isJailbroken) {
      metrics.incrementJailbreaksIssued();
    } else {
      metrics.incrementAttacksDefended();
    }

    const engine = getAttestationEngine();
    const { payload, signatureHex } = engine.signVerdict(
      activePromptHash,
      verdict,
      activeRecipient,
      targetSentinelId
    );

    return NextResponse.json({
      success: true,
      sentinel_id: targetSentinelId,
      sentinel_name: sentinel.name,
      verdict,
      prompt_hash: activePromptHash,
      recipient: activeRecipient,
      ai_response: aiResponse,
      threat_score: threatScore,
      payload,
      signatureHex,
      attestation_payload: payload,
      signature_hex: signatureHex,
      guardian_public_key: engine.getGuardianPublicKey(),
      measurement_quote_hash: engine.measurementQuoteHash,
      bounty_claim_ready: isJailbroken,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Evaluation failed' },
      { status: 500 }
    );
  }
}
