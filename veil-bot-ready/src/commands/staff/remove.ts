import { query } from '../../lib/db';
import { publishInvalidate } from '../../lib/whitelistService';
export async function execute(message:any, args:string[]) {
  if (args.length < 1) return message.reply('Usage: ;whitelist-remove <serverId> [reason]');
  const [serverId, ...rest] = args;
  const reason = rest.join(' ') || 'No reason provided';
  const res = await query('UPDATE licenses SET status=$1 WHERE server_id=$2 RETURNING *', ['revoked', serverId]);
  if (!res.rowCount) return message.reply('No license found');
  await query('INSERT INTO license_audit (license_id, action, performed_by, details) VALUES ($1,$2,$3,$4)', [res.rows[0].id, 'remove', message.author.id, {reason}]);
  await publishInvalidate(serverId);
  return message.reply(`❌ License revoked for ${serverId}`);
}
