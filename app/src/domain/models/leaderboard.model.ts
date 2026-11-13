/**
 * Red-Team Leaderboard Domain Model.
 */
export interface LeaderboardEntry {
  rank: number;
  hacker_id: string;
  total_burned: string;
  attempts_count: number;
  highest_threat_score: number;
  last_active: number;
  success_breaches: number;
}
