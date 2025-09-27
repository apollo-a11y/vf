import { EmbedBuilder } from 'discord.js';
export async function execute(message:any) {
  const user = message.mentions.users?.first() || message.author;
  const embed = new EmbedBuilder().setTitle(user.tag).addFields([{name:'ID', value: user.id}]).setTimestamp();
  await message.channel.send({ embeds: [embed] });
}
