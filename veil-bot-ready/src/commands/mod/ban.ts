import { PermissionsBitField, EmbedBuilder } from 'discord.js';
import { query } from '../../lib/db';
import { logAction } from '../../lib/logger';
export async function execute(message:any, args:string[], client:any) {
  if (!message.member?.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('No permission');
  const user = message.mentions.users?.first();
  if (!user) return message.reply('Mention a user');
  const reason = args.slice(1).join(' ') || 'No reason provided';
  await message.guild.bans.create(user.id, { reason }).catch(()=>message.reply('Failed to ban'));
  await query('INSERT INTO moderation_logs (guild_id, action, target_id, staff_id, reason) VALUES ($1,$2,$3,$4,$5)', [message.guild.id, 'ban', user.id, message.author.id, reason]);
  const embed = new EmbedBuilder().setTitle('Ban').addFields([{name:'User',value:`${user.tag} (${user.id})`},{name:'Moderator',value:message.author.tag},{name:'Reason',value:reason}]).setTimestamp();
  await message.channel.send({ embeds: [embed] });
  await logAction(message.guild.id, embed, client);
}
