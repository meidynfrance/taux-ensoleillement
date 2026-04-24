import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

// Singleton pour éviter trop de connexions en dev (HMR)
const globalForDb = globalThis as unknown as { sql: ReturnType<typeof postgres> };

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: false,         // connexion directe au VPS
    max: 5,             // pool de 5 connexions max (ok pour Vercel serverless)
    idle_timeout: 20,   // ferme les connexions inactives après 20s
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.sql = sql;

export default sql;
