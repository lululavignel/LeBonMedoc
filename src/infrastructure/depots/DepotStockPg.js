import { connexions } from '../bdd/connexion.js';

const COLONNES = 'pharmacie_id, medicament_id, quantite, mis_a_jour_le';

// Un stock est identifié par le couple (pharmacie, médicament)
export class DepotStockPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(
      `SELECT ${COLONNES} FROM stocks ORDER BY pharmacie_id, medicament_id`,
    );
    return lignes;
  }

  async getById(pharmacieId, medicamentId) {
    const { rows: lignes } = await connexions.query(
      `SELECT ${COLONNES} FROM stocks WHERE pharmacie_id = $1 AND medicament_id = $2`,
      [pharmacieId, medicamentId],
    );
    return lignes[0] ?? null;
  }

  async creer({ pharmacieId, medicamentId, quantite = 0 }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO stocks (pharmacie_id, medicament_id, quantite)
       VALUES ($1, $2, $3)
       RETURNING ${COLONNES}`,
      [pharmacieId, medicamentId, quantite],
    );
    return lignes[0];
  }
}
