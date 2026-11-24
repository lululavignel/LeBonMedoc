import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, nom, prenom, numero_securite_sociale, email, telephone, cree_le';

export class DepotClientPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM clients ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM clients WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer({ nom, prenom, numeroSecuriteSociale, email, telephone = null }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO clients (nom, prenom, numero_securite_sociale, email, telephone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLONNES}`,
      [nom, prenom, numeroSecuriteSociale, email, telephone],
    );
    return lignes[0];
  }
}
