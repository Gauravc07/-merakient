// Regenerates scripts/sql/02-seed-users.sql from lib/users.mjs.
// Usage (from the project root):  node scripts/generate-users-sql.mjs
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { USERS } from "../lib/users.mjs"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const q = (s) => `'${String(s).replace(/'/g, "''")}'`

const seen = new Set()
for (const u of USERS) {
  if (!/^[a-z0-9._-]+$/.test(u.username)) throw new Error(`Invalid username "${u.username}" — use lowercase letters/numbers only`)
  if (!u.password || u.password.length < 6) throw new Error(`Password for ${u.username} must be at least 6 characters`)
  if (seen.has(u.username)) throw new Error(`Duplicate username "${u.username}"`)
  seen.add(u.username)
}

const rows = USERS.map((u) => `  (${q(u.username)}, ${q(u.password)})`).join(",\n")
const list = USERS.map((u) => q(u.username)).join(", ")

const sql = `-- 02 · USERS — generated from lib/users.mjs (${USERS.length} users) by scripts/generate-users-sql.mjs
--
-- Makes the users table match lib/users.mjs exactly:
--   • adds new users and (re)sets every listed user's password
--   • DELETES users who are not in the list
--   • a removed user who has placed bids (or leads a table) is DEACTIVATED instead, so the
--     bid history stays intact — they can no longer log in
-- Passwords are bcrypt-hashed inside Postgres (pgcrypto), the format the login code checks.
-- Safe to re-run. To add or remove someone: edit lib/users.mjs, run
-- node scripts/generate-users-sql.mjs, then run this file in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

BEGIN;

INSERT INTO users (username, password_hash, is_active)
SELECT username, extensions.crypt(password, extensions.gen_salt('bf', 10)), true
FROM (VALUES
${rows}
) AS listed(username, password)
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true;

-- Removed users with bid history: keep the row (bids point at it) but block login
UPDATE users SET is_active = false
WHERE username NOT IN (${list})
  AND (id IN (SELECT user_id FROM bids WHERE user_id IS NOT NULL)
       OR id IN (SELECT highest_bidder_id FROM tables WHERE highest_bidder_id IS NOT NULL));

-- Removed users with no bids: delete
DELETE FROM users
WHERE username NOT IN (${list})
  AND id NOT IN (SELECT user_id FROM bids WHERE user_id IS NOT NULL)
  AND id NOT IN (SELECT highest_bidder_id FROM tables WHERE highest_bidder_id IS NOT NULL);

COMMIT;

-- Check: who can log in now
SELECT username, is_active FROM users ORDER BY is_active DESC, username;
`

fs.writeFileSync(path.join(root, "scripts", "sql", "02-seed-users.sql"), sql)
console.log(`Wrote scripts/sql/02-seed-users.sql with ${USERS.length} users`)
