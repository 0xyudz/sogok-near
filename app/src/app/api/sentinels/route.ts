import { NextResponse } from 'next/server';
import { SENTINEL_PROFILES } from '@/server/tee/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sentinels = Object.values(SENTINEL_PROFILES).map((s) => ({
    id: s.id,
    name: s.name,
    threat_baseline: s.threatBaseline,
  }));
  return NextResponse.json({ sentinels });
}
