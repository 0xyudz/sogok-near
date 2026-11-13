/**
 * $SOGOK Protocol Unified Facade & Client Entrypoint
 * Standard: NEP-141, NEP-297, NEAR Intents (1Click API Schema)
 * Two-Sided AI Red-Teaming Marketplace (Red Sentinel Benchmark)
 * Clean Architecture Layer: Presentation / Facade
 */

export * from '../domain/models/stats.model';
export * from '../domain/models/sentinel.model';
export * from '../domain/models/attempt.model';
export * from '../domain/models/swap.model';
export * from '../domain/models/leaderboard.model';
export * from '../domain/constants/sentinel-presets';

export * from '../config/endpoints.config';
export * from '../config/swap-assets.config';

export * from '../utils/crypto';
export * from '../utils/formatters';

export { SogokContractClient, sogokClient } from '../application/services/sogok-facade';
