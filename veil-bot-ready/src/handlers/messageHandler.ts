import { Message, Client } from 'discord.js';
import { query } from '../lib/db';
import { fetchFromCacheOrDb } from '../lib/whitelistService';
import * as staffCmds from '../commands/staff/index';
import * as modCmds from '../commands/mod/index';
import * as utilCmds from '../commands/util/index';
import { isStaff } from '../utils/isStaff';
export async function handleMessage(message: Message, client: Client) {
  if (message.author.bot) return;
  if (message.content.startsWith(';')) {
    if (!(await isStaff(message.author.id, client))) return message.reply('❌ Not staff.');
    const parts = message.content.slice(1).trim().split(/ +/);
    const cmd = parts.shift()!.toLowerCase();
    const args = parts;
    const fn = (staffCmds as any)[cmd];
    if (!fn) return;
    try { await fn.execute(message, args, client); } catch (e) { console.error(e); await message.reply('Staff command failed.'); }
    return;
  }
  if (!message.guild) return;
  const license = await fetchFromCacheOrDb(message.guild.id.toString());
  if (!license || license.status !== 'active' || (license.expires_at && new Date(license.expires_at) < new Date())) {
    try { await message.guild.fetchOwner().then(o=>o.send('⛔ Veil not whitelisted — leaving.')).catch(()=>{}); } catch {}
    return message.guild.leave().catch(()=>{});
  }
  const res = await query('SELECT prefix FROM guild_settings WHERE guild_id=$1', [message.guild.id]);
  const prefix = res.rows[0]?.prefix || process.env.DEFAULT_PREFIX || '!';
  if (!message.content.startsWith(prefix)) return;
  const parts = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = parts.shift()!.toLowerCase();
  const args = parts;
  const fn = (modCmds as any)[cmd] || (utilCmds as any)[cmd];
  if (!fn) return;
  try { await fn.execute(message, args, client); } catch (e) { console.error(e); await message.reply('Command failed.'); }
}
