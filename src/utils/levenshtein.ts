/** Compute Levenshtein edit distance between two strings */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Normalize a string for fuzzy comparison: lowercase + alphanumeric only */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Find vendors with similar names in the same locality.
 * threshold: ratio of edit distance to max length (default 0.3 = 30% similarity)
 */
export function findSimilar(
  name: string,
  vendors: Array<{ id: string; name: string; locality: string }>,
  threshold = 0.3
): Array<{ id: string; name: string; locality: string }> {
  const norm = normalize(name);
  return vendors.filter((v) => {
    const vn = normalize(v.name);
    const maxLen = Math.max(norm.length, vn.length);
    if (maxLen === 0) return false;
    const dist = levenshtein(norm, vn);
    return dist / maxLen <= threshold;
  });
}
