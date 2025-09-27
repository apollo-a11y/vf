import { query } from '../../lib/db';
import { publishInvalidate } from '../../lib/whitelistService';
export async function execute(message:any, args:string[]) {
  if (args.length < 3) return message.reply('Usage: ;whitelist-add <serverId> <ownerId> <licenseType> [expiresAt]');
  const [serverId, ownerId, licenseType, expiresAt] = args;
  const res = await query(`INSERT INTO licenses (server_id, owner_id, license_type, status, activated_at, expires_at, original_buyer_id) VALUES ($1,$2,$3,'active', now(), $4, $5) ON CONFLICT (server_id) DO UPDATE SET owner_id=EXCLUDED.owner_id, license_type=EXCLUDED.license_type, status='active', expires_at=EXCLUDED.expires_at RETURNING *;`, [serverId, ownerId, licenseType, expiresAt||null, message.author.id]);
  await query('INSERT INTO license_audit (license_id, action, performed_by, details) VALUES ($1,$2,$3,$4)', [res.rows[0].id, 'add', message.author.id, {serverId, ownerId, licenseType}]);
  await publishInvalidate(serverId);
  return message.reply(`✅ Server ${serverId} whitelisted.`);
}
