import { query } from '../lib/db';
async function run() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await query(`CREATE TABLE IF NOT EXISTS licenses ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), server_id bigint NOT NULL UNIQUE, owner_id bigint NOT NULL, license_type text NOT NULL, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), activated_at timestamptz, expires_at timestamptz, original_buyer_id bigint NOT NULL, transfers_count int NOT NULL DEFAULT 0, transfer_limit int NOT NULL DEFAULT 1, notes text );`);
  await query(`CREATE TABLE IF NOT EXISTS license_audit ( id serial PRIMARY KEY, license_id uuid, action text NOT NULL, performed_by bigint, performed_at timestamptz NOT NULL DEFAULT now(), details jsonb );`);
  await query(`CREATE TABLE IF NOT EXISTS staff ( user_id bigint PRIMARY KEY, role text NOT NULL, created_at timestamptz DEFAULT now() );`);
  await query(`CREATE TABLE IF NOT EXISTS guild_settings ( guild_id bigint PRIMARY KEY, prefix text NOT NULL DEFAULT ';', modlog_channel_id bigint );`);
  await query(`CREATE TABLE IF NOT EXISTS warnings ( id serial PRIMARY KEY, guild_id bigint NOT NULL, user_id bigint NOT NULL, moderator_id bigint NOT NULL, reason text, created_at timestamptz DEFAULT now() );`);
  await query(`CREATE TABLE IF NOT EXISTS moderation_logs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), guild_id bigint NOT NULL, action text NOT NULL, target_id bigint NOT NULL, staff_id bigint NOT NULL, reason text, created_at timestamptz DEFAULT now() );`);
  console.log('Migrations applied'); process.exit(0);
}
run().catch(err=>{console.error(err); process.exit(1);});
