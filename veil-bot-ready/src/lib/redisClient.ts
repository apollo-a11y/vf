import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
redis.on('connect', () => console.log('[Redis] connected'));
redis.on('error', (e) => console.error('[Redis] error', e));
export default redis;
