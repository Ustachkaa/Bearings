/** Tiny in-memory TTL cache with request de-duplication. */
export class TtlCache<T> {
  private store = new Map<string, { value: T; expires: number }>();
  private inflight = new Map<string, Promise<T>>();
  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expires < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T, ttlMs = this.ttlMs) {
    this.store.set(key, { value, expires: Date.now() + ttlMs });
  }

  async getOrLoad(key: string, loader: () => Promise<T>, ttlMs = this.ttlMs): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;
    const pending = this.inflight.get(key);
    if (pending) return pending;
    const p = loader()
      .then((v) => {
        this.set(key, v, ttlMs);
        return v;
      })
      .finally(() => this.inflight.delete(key));
    this.inflight.set(key, p);
    return p;
  }

  clear() {
    this.store.clear();
  }
}
