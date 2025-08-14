export function pickRandomCards<T>(arr: T[], k: number): T[] {
  const n = arr.length;
  if (k <= 0 || n === 0) return [];
  if (k >= n) return [...arr];

  const picked: T[] = [];
  const seen = new Set<number>();
  while (picked.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (seen.has(idx)) continue;
    seen.add(idx);
    picked.push(arr[idx]);
  }
  return picked;
}
