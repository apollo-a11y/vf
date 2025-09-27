import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { getPool } from './lib/db';
import { subscribeInvalidations } from './lib/redisSubscriber';
import { handleMessage } from './handlers/messageHandler';
import { scheduleLicenseRecheck } from './tasks/licenseRecheck';
getPool();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => {
  console.log(`Veil ready as ${client.user?.tag}`);
  subscribeInvalidations(client);
  scheduleLicenseRecheck(client);
});
client.on('guildCreate', async (g) => {
  const { fetchFromCacheOrDb } = await import('./lib/whitelistService');
  const license = await fetchFromCacheOrDb(g.id.toString());
  if (!license || license.status !== 'active') {
    try { await g.fetchOwner().then(o=>o.send('⛔ Veil not whitelisted — leaving.')).catch(()=>{}); } catch {}
    await g.leave().catch(()=>{});
  }
});
client.on('messageCreate', (m)=> handleMessage(m, client));
client.login(process.env.DISCORD_TOKEN).catch(err=>{ console.error('Discord login failed', err); process.exit(1); });
