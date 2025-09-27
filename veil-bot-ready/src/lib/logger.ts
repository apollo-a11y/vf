import { query } from './db';
import { EmbedBuilder, Client } from 'discord.js';
export async function logAction(guildId: string, embed: EmbedBuilder, client: Client) {
  const res = await query('SELECT modlog_channel_id FROM guild_settings WHERE guild_id=$1', [guildId]);
  const channelId = res.rows[0]?.modlog_channel_id;
  if (!channelId) return;
  const ch = client.channels.cache.get(channelId as string);
  if (ch && 'send' in ch) await (ch as any).send({ embeds: [embed] });
}
