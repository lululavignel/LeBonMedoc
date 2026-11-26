import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, nom, prix_defaut, est_remboursable, categorie, necessite_ordonnance, cree_le';

export class DepotMedicamentPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments WHERE id = $1`, [id]);
    return lignes[0] ?? null;
  }

  async creer(medicament) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO medicaments (nom, prix_defaut, est_remboursable, categorie, necessite_ordonnance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLONNES}`,
      [
        medicament.nom,
        medicament.prixDefaut,
        medicament.estRemboursable,
        medicament.categorie,
        medicament.necessiteOrdonnance,
      ],
    );
    return lignes[0];
  }
}
