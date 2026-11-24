import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, nom, categorie, necessite_ordonnance, cree_le';

export class DepotMedicamentPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer({ nom, categorie = null, necessiteOrdonnance = false }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO medicaments (nom, categorie, necessite_ordonnance)
       VALUES ($1, $2, $3)
       RETURNING ${COLONNES}`,
      [nom, categorie, necessiteOrdonnance],
    );
    return lignes[0];
  }
}
