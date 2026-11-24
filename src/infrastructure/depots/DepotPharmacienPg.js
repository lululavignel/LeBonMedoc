import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, pharmacie_id, nom, prenom, email, telephone, cree_le';

export class DepotPharmacienPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmaciens ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmaciens WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer({ pharmacieId, nom, prenom, email, telephone = null }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO pharmaciens (pharmacie_id, nom, prenom, email, telephone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLONNES}`,
      [pharmacieId, nom, prenom, email, telephone],
    );
    return lignes[0];
  }
}
