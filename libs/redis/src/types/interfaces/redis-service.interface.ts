export interface IRedisService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  ttl<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, value: string): Promise<number>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, value: string): Promise<number>;
}
