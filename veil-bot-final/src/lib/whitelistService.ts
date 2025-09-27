import redis from './redisClient';
import { query } from './db';
const WHITELIST_KEY = 'veil:whitelisted_set';
export async function fetchFromCacheOrDb(serverId: string) {
  const isMember = await redis.sismember(WHITELIST_KEY, serverId);
  if (isMember) {
    const cached = await redis.get(`veil:whitelist:${serverId}`);
    if (cached) return JSON.parse(cached);
  }
  const res = await query('SELECT * FROM licenses WHERE server_id=$1 LIMIT 1', [serverId]);
  if (!res.rows.length) return null;
  const license = res.rows[0];
  if (license.status === 'active') {
    await redis.set(`veil:whitelist:${serverId}`, JSON.stringify(license), 'EX', 300);
    await redis.sadd(WHITELIST_KEY, serverId);
  } else {
    await redis.srem(WHITELIST_KEY, serverId);
    await redis.del(`veil:whitelist:${serverId}`);
  }
  return license;
}
export async function publishInvalidate(serverId: string) {
  await redis.publish('veil:whitelist_invalidate', JSON.stringify({ serverId, ts: Date.now() }));
}
