import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, nom, prenom, email, telephone, cree_le';

export class DepotAdministrateurPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM administrateurs ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM administrateurs WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer({ nom, prenom, email, telephone = null }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO administrateurs (nom, prenom, email, telephone)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLONNES}`,
      [nom, prenom, email, telephone],
    );
    return lignes[0];
  }
}
