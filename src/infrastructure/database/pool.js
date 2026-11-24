import pg from 'pg';
import { config } from '../../config/env.js';

export const pool = new pg.Pool({
  ...config.db,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('[db] Erreur inattendue sur un client inactif', err);
});

export async function checkDatabase() {
  const { rows } = await pool.query('SELECT now() AS now, current_database() AS database');
  return rows[0];
}
