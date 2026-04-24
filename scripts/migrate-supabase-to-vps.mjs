/**
 * Script de migration : Supabase → PostgreSQL VPS
 * Usage : node scripts/migrate-supabase-to-vps.mjs
 */

import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Charger depuis les variables d'environnement (jamais hardcodé)
// Créer un fichier .env.migration avec ces variables avant de lancer le script
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const BATCH_SIZE   = 200;

if (!SUPABASE_URL || !SUPABASE_KEY || !DATABASE_URL) {
  console.error('Manque des variables d\'environnement : SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sql = postgres(DATABASE_URL, { ssl: false, max: 3 });

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }

async function fetchAll(table, orderBy = 'id') {
  const PAGE = 1000;
  let offset = 0;
  const all = [];
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw new Error(`Supabase error on ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    log(`  ${table}: ${all.length} rows fetched`);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

async function migrateRegions(rows) {
  log(`Inserting ${rows.length} regions...`);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map(r => ({
      id: r.id,
      code: r.code,
      nom: r.nom,
      slug: r.slug,
      ensoleillement_moyen: r.ensoleillement_moyen ?? null,
      description: r.description ?? null,
    }));
    await sql`
      INSERT INTO regions ${sql(batch)}
      ON CONFLICT (code) DO UPDATE SET
        nom = EXCLUDED.nom,
        slug = EXCLUDED.slug,
        ensoleillement_moyen = EXCLUDED.ensoleillement_moyen,
        description = EXCLUDED.description
    `;
  }
  await sql`SELECT setval('regions_id_seq', COALESCE((SELECT MAX(id) FROM regions), 1))`;
  log(`✓ ${rows.length} regions done`);
}

async function migrateDepartements(rows) {
  log(`Inserting ${rows.length} departements...`);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map(r => ({
      id: r.id,
      code: r.code,
      nom: r.nom,
      slug: r.slug,
      region_code: r.region_code ?? null,
      ensoleillement_moyen: r.ensoleillement_moyen ?? null,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
      description: r.description ?? null,
    }));
    await sql`
      INSERT INTO departements ${sql(batch)}
      ON CONFLICT (code) DO UPDATE SET
        nom = EXCLUDED.nom,
        slug = EXCLUDED.slug,
        region_code = EXCLUDED.region_code,
        ensoleillement_moyen = EXCLUDED.ensoleillement_moyen,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        description = EXCLUDED.description
    `;
  }
  await sql`SELECT setval('departements_id_seq', COALESCE((SELECT MAX(id) FROM departements), 1))`;
  log(`✓ ${rows.length} departements done`);
}

async function migrateCommunes(rows) {
  log(`Inserting ${rows.length} communes in batches of ${BATCH_SIZE}...`);
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map(r => ({
      id: r.id,
      code_insee: r.code_insee,
      nom: r.nom,
      slug: r.slug,
      code_postal: r.code_postal ?? null,
      departement_code: r.departement_code ?? null,
      population: r.population ?? null,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
      ensoleillement_annuel: r.ensoleillement_annuel ?? null,
      ensoleillement_janvier: r.ensoleillement_janvier ?? null,
      ensoleillement_fevrier: r.ensoleillement_fevrier ?? null,
      ensoleillement_mars: r.ensoleillement_mars ?? null,
      ensoleillement_avril: r.ensoleillement_avril ?? null,
      ensoleillement_mai: r.ensoleillement_mai ?? null,
      ensoleillement_juin: r.ensoleillement_juin ?? null,
      ensoleillement_juillet: r.ensoleillement_juillet ?? null,
      ensoleillement_aout: r.ensoleillement_aout ?? null,
      ensoleillement_septembre: r.ensoleillement_septembre ?? null,
      ensoleillement_octobre: r.ensoleillement_octobre ?? null,
      ensoleillement_novembre: r.ensoleillement_novembre ?? null,
      ensoleillement_decembre: r.ensoleillement_decembre ?? null,
    }));
    await sql`
      INSERT INTO communes ${sql(batch)}
      ON CONFLICT (code_insee) DO UPDATE SET
        nom = EXCLUDED.nom,
        slug = EXCLUDED.slug,
        code_postal = EXCLUDED.code_postal,
        departement_code = EXCLUDED.departement_code,
        population = EXCLUDED.population,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        ensoleillement_annuel = EXCLUDED.ensoleillement_annuel,
        ensoleillement_janvier = EXCLUDED.ensoleillement_janvier,
        ensoleillement_fevrier = EXCLUDED.ensoleillement_fevrier,
        ensoleillement_mars = EXCLUDED.ensoleillement_mars,
        ensoleillement_avril = EXCLUDED.ensoleillement_avril,
        ensoleillement_mai = EXCLUDED.ensoleillement_mai,
        ensoleillement_juin = EXCLUDED.ensoleillement_juin,
        ensoleillement_juillet = EXCLUDED.ensoleillement_juillet,
        ensoleillement_aout = EXCLUDED.ensoleillement_aout,
        ensoleillement_septembre = EXCLUDED.ensoleillement_septembre,
        ensoleillement_octobre = EXCLUDED.ensoleillement_octobre,
        ensoleillement_novembre = EXCLUDED.ensoleillement_novembre,
        ensoleillement_decembre = EXCLUDED.ensoleillement_decembre
    `;
    inserted += batch.length;
    log(`  communes: ${inserted}/${rows.length}`);
  }
  await sql`SELECT setval('communes_id_seq', COALESCE((SELECT MAX(id) FROM communes), 1))`;
  log(`✓ ${rows.length} communes done`);
}

async function main() {
  log('=== Migration Supabase → VPS PostgreSQL ===\n');

  log('1. Fetching from Supabase...');
  const [regions, depts, communes] = await Promise.all([
    fetchAll('regions'),
    fetchAll('departements'),
    fetchAll('communes'),
  ]);
  log(`   regions=${regions.length} | depts=${depts.length} | communes=${communes.length}\n`);

  log('2. Inserting into VPS...');
  await migrateRegions(regions);
  await migrateDepartements(depts);
  await migrateCommunes(communes);

  log('\n3. Verification...');
  const [{ count: rc }] = await sql`SELECT COUNT(*)::int as count FROM regions`;
  const [{ count: dc }] = await sql`SELECT COUNT(*)::int as count FROM departements`;
  const [{ count: cc }] = await sql`SELECT COUNT(*)::int as count FROM communes`;
  log(`   ✓ Regions: ${rc} | Departements: ${dc} | Communes: ${cc}`);

  log('\n=== Migration terminée avec succès ! ===');
  await sql.end();
}

main().catch(err => { console.error('FAILED:', err); process.exit(1); });
