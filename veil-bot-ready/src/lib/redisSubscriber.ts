import redis from './redisClient';
import { fetchFromCacheOrDb } from './whitelistService';
export function subscribeInvalidations(client: any) {
  const sub = redis.duplicate();
  sub.connect().then(()=>{
    sub.subscribe('veil:whitelist_invalidate', (message:any)=>{
      try {
        const { serverId } = JSON.parse(message);
        const guild = client.guilds.cache.get(serverId);
        if (!guild) return;
        fetchFromCacheOrDb(serverId).then(license=>{
          if (!license || license.status !== 'active' || (license.expires_at && new Date(license.expires_at) < new Date())) {
            guild.fetchOwner().then(o=>o.send('⛔ Veil subscription revoked — bot leaving.')).catch(()=>{});
            guild.leave().catch(()=>{});
          }
        }).catch(()=>{});
      } catch(e) { console.error('invalid payload', e); }
    });
  }).catch(()=>{});
}
