import { query } from '../lib/db';
import { Client } from 'discord.js';
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID || '';
export async function isStaff(userId: string, client?: Client) {
  const res = await query('SELECT 1 FROM staff WHERE user_id=$1', [userId]);
  if (res.rowCount) return true;
  if (STAFF_ROLE_ID && client) {
    for (const g of client.guilds.cache.values()) {
      try {
        const m = await g.members.fetch(userId).catch(() => null);
        if (m && m.roles.cache.has(STAFF_ROLE_ID)) return true;
      } catch {}
    }
  }
  return false;
}
