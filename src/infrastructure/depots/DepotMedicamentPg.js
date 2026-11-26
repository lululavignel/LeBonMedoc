import { connexions } from '../bdd/connexion.js';
import { Medicament } from '../../modele/medicament/Medicament.js';

const COLONNES = 'id, nom, prix_defaut, est_remboursable, categorie, necessite_ordonnance';

function versMedicament(ligne) {
  return new Medicament({
    id: ligne.id,
    nom: ligne.nom,
    prixDefaut: ligne.prix_defaut,
    estRemboursable: ligne.est_remboursable,
    categorie: ligne.categorie,
    necessiteOrdonnance: ligne.necessite_ordonnance,
  });
}

export class DepotMedicamentPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments ORDER BY id`);
    return lignes.map(versMedicament);
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM medicaments WHERE id = $1`, [id]);
    return lignes[0] ? versMedicament(lignes[0]) : null;
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
    return versMedicament(lignes[0]);
  }
}
