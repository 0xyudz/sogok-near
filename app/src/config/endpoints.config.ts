/**
 * Blockchain and TEE Enclave Network Endpoints Configuration.
 */
export const SOGOK_CONTRACT_ID =
  process.env.NEXT_PUBLIC_SOGOK_CONTRACT_ID || 'sogok-protocol.testnet';

export const TEE_GUARDIAN_API_URL =
  process.env.NEXT_PUBLIC_TEE_GUARDIAN_API || '';

export const NEAR_RPC_URL =
  process.env.NEXT_PUBLIC_NEAR_RPC_URL || 'https://test.rpc.fastnear.com';

export const CANONICAL_GUARDIAN_PUBLIC_KEY =
  '754e986fa46d2b8b6334f6e118915fa0313b5e57760f28f7418e7ee43f135454';

export const CANONICAL_ENCLAVE_MEASUREMENT_HASH =
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

export const DEFUSE_RPC_URL = 'https://solver-relay-v2.chaindefuser.com/rpc';
