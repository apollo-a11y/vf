import redis from './redisClient';
import { query } from './db';
const SET_KEY = 'veil:whitelisted_set';
export async function fetchFromCacheOrDb(serverId: string) {
  const isMember = await redis.sismember(SET_KEY, serverId);
  if (isMember) {
    const key = `veil:whitelist:${serverId}`;
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  }
  const res = await query('SELECT * FROM licenses WHERE server_id=$1 LIMIT 1', [serverId]);
  if (!res.rows.length) return null;
  const license = res.rows[0];
  if (license.status === 'active') {
    const key = `veil:whitelist:${serverId}`;
    await redis.set(key, JSON.stringify(license), 'EX', 300);
    await redis.sadd(SET_KEY, serverId);
  } else {
    await redis.srem(SET_KEY, serverId);
    await redis.del(`veil:whitelist:${serverId}`);
  }
  return license;
}
export async function publishInvalidate(serverId: string) {
  await redis.publish('veil:whitelist_invalidate', JSON.stringify({ serverId, ts: Date.now() }));
}
