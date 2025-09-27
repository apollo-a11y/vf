import { query } from '../../lib/db';
export async function execute(message:any, args:string[]) {
  if (!message.member?.permissions.has('Administrator')) return message.reply('Admins only');
  const newPrefix = args[0];
  if (!newPrefix) return message.reply('Usage: prefix <newPrefix>');
  await query('INSERT INTO guild_settings (guild_id, prefix) VALUES ($1,$2) ON CONFLICT (guild_id) DO UPDATE SET prefix=$2', [message.guild.id, newPrefix]);
  return message.reply(`Prefix set to ${newPrefix}`);
}
