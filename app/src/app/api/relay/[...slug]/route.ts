import { NextRequest, NextResponse } from 'next/server';
import { getServerRelayer } from '@/server/relayer';
import { SENTINEL_PROFILES } from '@/server/tee/sentinel-profiles';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug ? params.slug[0] : '';
  const body = await req.json().catch(() => ({}));

  try {
    const relayer = getServerRelayer();

    // 1. Claim Faucet
    if (action === 'faucet') {
      const recipient = body.recipientId || body.recipient || 'judge.testnet';
      const amount = Number(body.amount || 50000);
      const result = await relayer.claimFaucet(recipient, amount);
      return NextResponse.json(result);
    }

    // 2. Attack Sentinel
    if (action === 'attack') {
      const sId = Number(body.sentinelId !== undefined ? body.sentinelId : 0);
      const pHash =
        body.promptHash ||
        body.prompt_hash ||
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const result = await relayer.attackSentinel(sId, pHash);
      return NextResponse.json(result);
    }

    // 3. Deploy Sentinel
    if (action === 'deploy') {
      const {
        name,
        attack_fee,
        canary_hash,
        system_prompt_hash,
        lockup_days,
        attachedNearDeposit,
        canarySecret,
        systemPrompt,
      } = body;

      if (!name || !attack_fee || !canary_hash || !system_prompt_hash) {
        return NextResponse.json(
          { error: 'Missing required parameters for deploy_sentinel' },
          { status: 400 }
        );
      }

      const result = await relayer.deploySentinel({
        name,
        attack_fee,
        canary_hash,
        system_prompt_hash,
        lockup_days: lockup_days || 14,
        attachedNearDeposit,
      });

      // Register profile in-memory for immediate defense testing
      if (canarySecret) {
        const nextId = Object.keys(SENTINEL_PROFILES).length;
        SENTINEL_PROFILES[nextId] = {
          id: nextId,
          name,
          canarySecret,
          systemPrompt: systemPrompt || `You are ${name}. Protect secret canary: ${canarySecret}`,
          threatBaseline: 80,
        };
      }

      return NextResponse.json(result);
    }

    // 4. Claim Bounty
    if (action === 'claim') {
      const { payload, signatureHex, signature_hex } = body;
      const sig = signatureHex || signature_hex;
      if (!payload || !sig) {
        return NextResponse.json(
          { error: 'Missing payload or signatureHex' },
          { status: 400 }
        );
      }
      const result = await relayer.claimBounty(payload, sig);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Unknown relay action: ${action}` },
      { status: 404 }
    );
  } catch (err: any) {
    console.error(`[RELAY ON-CHAIN ERROR] Action ${action} failed:`, err);
    return NextResponse.json(
      {
        error: err.message || 'On-chain transaction execution failed',
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}
