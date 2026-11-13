/**
 * Numeric and temporal display formatters.
 */

/**
 * Format raw token BigInt string (18 decimals) into human-readable string.
 */
export function formatTokenDisplay(rawStr: string, decimals = 18): string {
  try {
    const val = BigInt(rawStr || '0');
    const whole = val / BigInt(10 ** decimals);
    return Number(whole).toLocaleString();
  } catch {
    return '0';
  }
}

/**
 * Format yoctoNEAR string (24 decimals) into 2-decimal NEAR representation.
 */
export function formatNearFromYocto(yoctoStr: string): string {
  try {
    const yocto = BigInt(yoctoStr || '0');
    const nearVal = Number(yocto / BigInt(10 ** 20)) / 10000;
    return nearVal.toFixed(2);
  } catch {
    return '0.00';
  }
}

/**
 * Format millisecond timestamp into relative time string.
 */
export function formatTimeAgo(timestampMs: number): string {
  const diff = Math.floor((Date.now() - timestampMs) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
