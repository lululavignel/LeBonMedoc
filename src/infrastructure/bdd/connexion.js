import pg from 'pg';
import { configuration } from '../../config/env.js';

export const connexions = new pg.Pool({
  ...configuration.bdd,
  max: 10,
  idleTimeoutMillis: 30_000,
});

connexions.on('error', (erreur) => {
  console.error('[bdd] Erreur inattendue sur une connexion inactive', erreur);
});

export async function verifierBaseDeDonnees() {
  const { rows: lignes } = await connexions.query('SELECT now() AS heure, current_database() AS base');
  return lignes[0];
}
