import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURA ESTOS DATOS ===
const SUPABASE_URL = 'https://ckvqfrppnfhoadcpqhld.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdnFmcnBwbmZob2FkY3BxaGxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDEzODQ5OCwiZXhwIjoyMDY1NzE0NDk4fQ.BfzSfJoYpm0xNXae15djgHHwcycyClfdPCP-XNuQ5rE';
const MIGRATIONS_DIR = './supabase/migrations';
const APPLIED_FILE = './supabase/.applied';

async function applyMigration(file) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
  try {
    // Usamos el endpoint de SQL de Supabase (requiere service_role)
    const res = await axios.post(
      `${SUPABASE_URL}/rest/v1/rpc/execute_sql`,
      { sql },
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ Migración aplicada: ${file}`);
    return true;
  } catch (err) {
    console.error(`❌ Error en ${file}:`, err.response?.data || err.message);
    return false;
  }
}

function getAppliedMigrations() {
  if (!fs.existsSync(APPLIED_FILE)) return [];
  return fs.readFileSync(APPLIED_FILE, 'utf8').split('\n').filter(Boolean);
}

function markAsApplied(file) {
  fs.appendFileSync(APPLIED_FILE, file + '\n');
}

async function main() {
  const applied = new Set(getAppliedMigrations());
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('🚀 Aplicando migraciones a Supabase Cloud...\n');

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`🟡 Ya aplicada: ${file}`);
      continue;
    }
    const ok = await applyMigration(file);
    if (ok) markAsApplied(file);
    else break;
  }

  console.log('\n✅ Proceso completado!');
}

main(); 