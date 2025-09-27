import { EmbedBuilder } from 'discord.js';
import { query } from '../../lib/db';
export async function execute(message:any) {
  const user = message.mentions.users?.first();
  if (!user) return message.reply('Mention a user');
  const res = await query('SELECT * FROM warnings WHERE guild_id=$1 AND user_id=$2 ORDER BY created_at DESC LIMIT 50', [message.guild.id, user.id]);
  if (!res.rowCount) return message.reply('No warnings');
  const embed = new EmbedBuilder().setTitle(`Warnings for ${user.tag}`).setTimestamp();
  res.rows.forEach((r:any,i:number)=> embed.addFields({name:`#${i+1} - ${new Date(r.created_at).toLocaleString()}`, value:`By <@${r.moderator_id}>: ${r.reason}`}));
  await message.channel.send({ embeds: [embed] });
}
