import { neon } from '@neondatabase/serverless';

/**
 * Retorna la función de consulta SQL para Neon Postgres.
 * Lee de las variables de entorno DATABASE_URL o POSTGRES_URL inyectadas por Vercel.
 */
export function getDbClient() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.warn('DATABASE_URL or POSTGRES_URL environment variable is missing.');
  }
  return neon(connectionString || '');
}
