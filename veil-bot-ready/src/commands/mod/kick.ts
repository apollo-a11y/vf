import { PermissionsBitField, EmbedBuilder } from 'discord.js';
import { query } from '../../lib/db';
import { logAction } from '../../lib/logger';
export async function execute(message:any, args:string[], client:any) {
  if (!message.member?.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply('No permission');
  const member = message.mentions.members?.first();
  if (!member) return message.reply('Mention a member');
  const reason = args.slice(1).join(' ') || 'No reason provided';
  await member.kick(reason).catch(()=>message.reply('Failed to kick'));
  await query('INSERT INTO moderation_logs (guild_id, action, target_id, staff_id, reason) VALUES ($1,$2,$3,$4,$5)', [message.guild.id, 'kick', member.id, message.author.id, reason]);
  const embed = new EmbedBuilder().setTitle('Kick').addFields([{name:'User',value:`${member.user.tag} (${member.id})`},{name:'Moderator',value:message.author.tag},{name:'Reason',value:reason}]).setTimestamp();
  await message.channel.send({ embeds: [embed] });
  await logAction(message.guild.id, embed, client);
}
