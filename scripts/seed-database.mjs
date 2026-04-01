#!/usr/bin/env node

/**
 * Script de seed pour la base de données Supabase
 * - Télécharge les données depuis geo.api.gouv.fr
 * - Génère les données d'ensoleillement réalistes
 * - Insère tout par batches de 500
 *
 * Les tables doivent déjà exister (créées via supabase db push).
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vbmnvtkuldiuotjnijrx.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibW52dGt1bGRpdW90am5panJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA1MjcxNSwiZXhwIjoyMDkwNjI4NzE1fQ.L6Uv3GD8k4c__EV9zOa2VKS6JbaKPLdA3ScObrzKpI0";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================
// Données d'ensoleillement réalistes par département (heures/an)
// ============================================================
const ENSOLEILLEMENT_DEPARTEMENT = {
  "01": 1950, "02": 1600, "03": 1850, "04": 2700, "05": 2550,
  "06": 2850, "07": 2450, "08": 1600, "09": 2000, "10": 1700,
  "11": 2450, "12": 2100, "13": 2850, "14": 1700, "15": 1900,
  "16": 2000, "17": 2150, "18": 1800, "19": 1900, "2A": 2900,
  "2B": 2800, "21": 1800, "22": 1550, "23": 1800, "24": 2050,
  "25": 1750, "26": 2500, "27": 1700, "28": 1750, "29": 1530,
  "30": 2650, "31": 2050, "32": 2000, "33": 2100, "34": 2700,
  "35": 1700, "36": 1800, "37": 1850, "38": 2000, "39": 1800,
  "40": 2100, "41": 1800, "42": 1950, "43": 2000, "44": 1950,
  "45": 1800, "46": 2100, "47": 2100, "48": 2200, "49": 1900,
  "50": 1650, "51": 1650, "52": 1700, "53": 1750, "54": 1650,
  "55": 1600, "56": 1800, "57": 1650, "58": 1850, "59": 1580,
  "60": 1650, "61": 1700, "62": 1570, "63": 1900, "64": 1900,
  "65": 1950, "66": 2600, "67": 1750, "68": 1800, "69": 1950,
  "70": 1750, "71": 1850, "72": 1800, "73": 2000, "74": 1900,
  "75": 1700, "76": 1600, "77": 1700, "78": 1700, "79": 1950,
  "80": 1600, "81": 2150, "82": 2100, "83": 2850, "84": 2650,
  "85": 2000, "86": 1900, "87": 1900, "88": 1650, "89": 1750,
  "90": 1700, "91": 1700, "92": 1700, "93": 1700, "94": 1700,
  "95": 1680,
  "971": 2600, "972": 2500, "973": 2200, "974": 2500, "976": 2700,
};

// Distribution mensuelle par zone climatique (% de l'ensoleillement annuel)
const DIST_MED = [4.5, 5.5, 7.5, 8.5, 10, 12, 13, 12, 9.5, 7, 5.5, 4.5];
const DIST_OCE = [3.5, 5, 7, 8.5, 10.5, 11.5, 12.5, 11.5, 9.5, 7, 4.5, 3.5];
const DIST_CON = [3, 4.5, 7, 9, 11, 12, 13, 12, 9, 7, 4.5, 3];
const DIST_MON = [3.5, 5, 7.5, 9, 10.5, 12, 13, 12, 9, 7, 4.5, 3.5];
const DIST_TRO = [7.5, 7, 8, 8, 8.5, 8.5, 9, 9.5, 8.5, 8.5, 8, 9];

const DEPTS_MED = ["13", "83", "06", "2A", "2B", "34", "30", "84", "66", "11"];
const DEPTS_TRO = ["971", "972", "973", "974", "976"];
const DEPTS_MON = ["04", "05", "38", "73", "74", "63", "15", "43", "48", "65"];
const DEPTS_CON = ["67", "68", "57", "54", "88", "70", "25", "39", "90", "52", "55", "08", "10", "51", "21", "58", "71", "89"];

function getDistribution(deptCode) {
  if (DEPTS_MED.includes(deptCode)) return DIST_MED;
  if (DEPTS_TRO.includes(deptCode)) return DIST_TRO;
  if (DEPTS_MON.includes(deptCode)) return DIST_MON;
  if (DEPTS_CON.includes(deptCode)) return DIST_CON;
  return DIST_OCE;
}

function generateMonthlySunshine(annualHours, deptCode) {
  const dist = getDistribution(deptCode);
  return dist.map((pct) => Math.round((annualHours * pct) / 100));
}

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

// ============================================================
// Descriptions SEO pour les régions
// ============================================================
const REGION_DESCRIPTIONS = {
  "84": "L'Auvergne-Rhône-Alpes offre des contrastes d'ensoleillement entre les vallées ensoleillées du Rhône et les zones montagneuses des Alpes et du Massif Central.",
  "27": "La Bourgogne-Franche-Comté bénéficie d'un climat semi-continental avec un ensoleillement modéré, plus marqué dans la vallée de la Saône.",
  "53": "La Bretagne, malgré sa réputation pluvieuse, bénéficie d'un ensoleillement correct sur ses côtes sud, notamment dans le Morbihan.",
  "24": "Le Centre-Val de Loire jouit d'un ensoleillement tempéré caractéristique du bassin parisien, avec des étés agréablement ensoleillés.",
  "94": "La Corse est l'une des régions les plus ensoleillées de France avec près de 2900 heures de soleil par an sur ses côtes.",
  "44": "Le Grand Est présente un climat continental avec des étés bien ensoleillés mais des hivers souvent gris, notamment dans les vallées vosgiennes.",
  "32": "Les Hauts-de-France sont la région la moins ensoleillée de France métropolitaine, mais bénéficient d'étés lumineux et de longues journées.",
  "11": "L'Île-de-France affiche un ensoleillement modéré typique du nord de la France, avec environ 1700 heures de soleil annuelles.",
  "28": "La Normandie offre un ensoleillement modeste compensé par la douceur de son climat océanique et ses longues journées d'été.",
  "75": "La Nouvelle-Aquitaine va des côtes atlantiques ensoleillées aux contreforts du Massif Central, offrant une grande variété d'ensoleillement.",
  "76": "L'Occitanie est l'une des régions les plus ensoleillées de France, du littoral méditerranéen aux Pyrénées, avec Perpignan comme ville la plus ensoleillée.",
  "52": "Les Pays de la Loire bénéficient d'un ensoleillement honorable grâce à leur façade atlantique, notamment en Vendée et Loire-Atlantique.",
  "93": "La Provence-Alpes-Côte d'Azur est la région la plus ensoleillée de France métropolitaine avec plus de 2800 heures de soleil par an sur le littoral.",
  "01": "La Guadeloupe bénéficie d'un ensoleillement tropical généreux toute l'année avec environ 2600 heures de soleil annuelles.",
  "02": "La Martinique offre un ensoleillement tropical constant, adouci par les alizés, avec environ 2500 heures de soleil par an.",
  "03": "La Guyane présente un ensoleillement tropical modéré par l'humidité équatoriale et les saisons des pluies.",
  "04": "La Réunion bénéficie d'un fort ensoleillement sur la côte ouest, tandis que la côte est est plus arrosée.",
  "06": "Mayotte jouit d'un ensoleillement tropical important avec environ 2700 heures de soleil par an.",
};

// ============================================================
// Fetch data from geo.api.gouv.fr
// ============================================================
async function fetchJSON(url, label) {
  console.log(`Fetching ${label}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${label}: ${res.status}`);
  const data = await res.json();
  console.log(`  Got ${data.length} ${label}`);
  return data;
}

// ============================================================
// Insert helpers
// ============================================================
async function insertBatch(table, rows) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`Insert into ${table} failed: ${error.message}`);
}

async function insertRegions(regionsApi) {
  console.log("\nInserting regions...");
  const rows = regionsApi.map((r) => ({
    code: r.code,
    nom: r.nom,
    slug: slugify(r.nom),
    ensoleillement_moyen: 0,
    description: REGION_DESCRIPTIONS[r.code] ||
      `Découvrez l'ensoleillement de la région ${r.nom} et de toutes ses communes.`,
  }));
  await insertBatch("regions", rows);
  console.log(`  Inserted ${rows.length} regions`);
}

async function insertDepartements(departementsApi) {
  console.log("\nInserting departements...");
  const rows = departementsApi.map((d) => {
    const sunshine = ENSOLEILLEMENT_DEPARTEMENT[d.code] || 1800;
    return {
      code: d.code,
      nom: d.nom,
      slug: slugify(d.nom + "-" + d.code),
      region_code: d.codeRegion,
      ensoleillement_moyen: sunshine,
      latitude: 0,
      longitude: 0,
      description: `Ensoleillement du département ${d.nom} (${d.code}) : environ ${sunshine} heures de soleil par an. Retrouvez les données pour chaque commune.`,
    };
  });
  await insertBatch("departements", rows);
  console.log(`  Inserted ${rows.length} departements`);
}

async function insertCommunes(communesApi) {
  console.log(`\nPreparing ${communesApi.length} communes...`);

  const usedSlugs = new Set();
  const allRows = communesApi.map((c) => {
    const deptCode = c.codeDepartement;
    const baseSunshine = ENSOLEILLEMENT_DEPARTEMENT[deptCode] || 1800;
    const variation = (hashCode(c.code) % 201) - 100;
    const annualSunshine = baseSunshine + variation;
    const monthly = generateMonthlySunshine(annualSunshine, deptCode);

    const lat = c.centre ? c.centre.coordinates[1] : 0;
    const lng = c.centre ? c.centre.coordinates[0] : 0;
    const codePostal = c.codesPostaux?.length > 0 ? c.codesPostaux[0] : null;

    let baseSlug = slugify(c.nom + "-" + deptCode);
    let slug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

    return {
      code_insee: c.code,
      nom: c.nom,
      slug,
      code_postal: codePostal,
      departement_code: deptCode,
      population: c.population || 0,
      latitude: lat,
      longitude: lng,
      ensoleillement_annuel: annualSunshine,
      ensoleillement_janvier: monthly[0],
      ensoleillement_fevrier: monthly[1],
      ensoleillement_mars: monthly[2],
      ensoleillement_avril: monthly[3],
      ensoleillement_mai: monthly[4],
      ensoleillement_juin: monthly[5],
      ensoleillement_juillet: monthly[6],
      ensoleillement_aout: monthly[7],
      ensoleillement_septembre: monthly[8],
      ensoleillement_octobre: monthly[9],
      ensoleillement_novembre: monthly[10],
      ensoleillement_decembre: monthly[11],
    };
  });

  // Insert by batch of 500
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH);
    try {
      await insertBatch("communes", batch);
      inserted += batch.length;
    } catch (e) {
      console.error(`  Batch error at offset ${i}: ${e.message}`);
      // Fallback: insert one by one
      for (const row of batch) {
        try {
          await insertBatch("communes", [row]);
          inserted++;
        } catch (e2) {
          console.error(`    Failed: ${row.nom} (${row.code_insee}): ${e2.message}`);
        }
      }
    }
    if ((i / BATCH) % 10 === 0 || i + BATCH >= allRows.length) {
      console.log(`  Progress: ${inserted}/${allRows.length} communes`);
    }
  }
  return inserted;
}

// ============================================================
// Post-insert updates
// ============================================================
async function updateRegionAverages() {
  console.log("\nUpdating region sunshine averages...");
  const { data: depts } = await supabase
    .from("departements")
    .select("code, region_code, ensoleillement_moyen");

  const regionSums = {};
  const regionCounts = {};
  for (const d of depts) {
    regionSums[d.region_code] = (regionSums[d.region_code] || 0) + d.ensoleillement_moyen;
    regionCounts[d.region_code] = (regionCounts[d.region_code] || 0) + 1;
  }

  for (const [code, sum] of Object.entries(regionSums)) {
    const avg = Math.round(sum / regionCounts[code]);
    await supabase.from("regions").update({ ensoleillement_moyen: avg }).eq("code", code);
  }
  console.log("  Done");
}

async function updateDeptCoordinates() {
  console.log("\nUpdating departement coordinates...");
  const { data: depts } = await supabase.from("departements").select("code");

  for (const dept of depts) {
    const { data: communes } = await supabase
      .from("communes")
      .select("latitude, longitude")
      .eq("departement_code", dept.code)
      .gt("latitude", 0)
      .limit(1000);

    if (communes?.length > 0) {
      const avgLat = communes.reduce((s, c) => s + c.latitude, 0) / communes.length;
      const avgLng = communes.reduce((s, c) => s + c.longitude, 0) / communes.length;
      await supabase
        .from("departements")
        .update({
          latitude: Math.round(avgLat * 10000) / 10000,
          longitude: Math.round(avgLng * 10000) / 10000,
        })
        .eq("code", dept.code);
    }
  }
  console.log("  Done");
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log("=== Seed Database: Taux d'Ensoleillement ===\n");

  // 1. Fetch all data from API
  const [regionsApi, departementsApi, communesApi] = await Promise.all([
    fetchJSON("https://geo.api.gouv.fr/regions", "regions"),
    fetchJSON("https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion", "departements"),
    fetchJSON(
      "https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre&format=json&boost=population",
      "communes"
    ),
  ]);

  // 2. Insert in order (FK constraints)
  await insertRegions(regionsApi);
  await insertDepartements(departementsApi);
  const totalCommunes = await insertCommunes(communesApi);

  // 3. Update computed fields
  await updateRegionAverages();
  await updateDeptCoordinates();

  // 4. Verify
  const { count: rCount } = await supabase.from("regions").select("*", { count: "exact", head: true });
  const { count: dCount } = await supabase.from("departements").select("*", { count: "exact", head: true });
  const { count: cCount } = await supabase.from("communes").select("*", { count: "exact", head: true });

  console.log("\n=== SEED COMPLETE ===");
  console.log(`Regions:      ${rCount}`);
  console.log(`Departements: ${dCount}`);
  console.log(`Communes:     ${cCount} (API returned ${communesApi.length})`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
