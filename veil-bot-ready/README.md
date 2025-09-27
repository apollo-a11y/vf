Veil — Premium Whitelist Discord Bot (Ready)

Quick start:
1. Copy .env.example -> .env and fill DISCORD_TOKEN
2. docker compose up --build -d
3. docker compose exec bot npm run migrate
4. Check logs: docker compose logs -f bot

Seed staff: INSERT INTO staff (user_id, role) VALUES ('YOUR_DISCORD_ID', 'admin');
Use staff commands (prefix ';') to whitelist servers.
