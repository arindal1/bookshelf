// In-memory fixed-window rate limiter. Single-instance only - if this app
// scales to multiple server instances, swap the backing store for a shared
// one (e.g. Upstash/Redis) so limits are enforced globally instead of
// per-instance.
const buckets = new Map<string, { count: number; resetAt: number }>();

const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
let lastSweep = Date.now();

function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.max - 1 };
  }

  if (bucket.count >= opts.max) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: opts.max - bucket.count };
}