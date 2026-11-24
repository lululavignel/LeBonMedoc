import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, nom, adresse, ville, code_postal, telephone, email, horaires_ouverture, est_partenaire, cree_le';

export class DepotPharmaciePg {
  async trouverToutes() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmacies ORDER BY id`);
    return lignes;
  }

  async trouverParId(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmacies WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer({ nom, adresse, ville, codePostal, telephone = null, email = null, horairesOuverture = {} }) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO pharmacies (nom, adresse, ville, code_postal, telephone, email, horaires_ouverture)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLONNES}`,
      [nom, adresse, ville, codePostal, telephone, email, horairesOuverture],
    );
    return lignes[0];
  }
}
