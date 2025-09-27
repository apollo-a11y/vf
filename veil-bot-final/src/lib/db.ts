import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();
let pool: Pool | null = null;
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.PG_CONN });
    pool.on('connect', () => console.log('[Postgres] connected'));
    pool.on('error', (err) => console.error('[Postgres] error', err));
  }
  return pool;
}
export async function query(text: string, params?: any[]) {
  const client = await getPool().connect();
  try { return await client.query(text, params); } finally { client.release(); }
}
