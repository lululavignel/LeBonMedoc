import { connexions } from '../bdd/connexion.js';
import { Pharmacie } from '../../modele/pharmacie/Pharmacie.js';

const COLONNES = 'id, nom, adresse, ville, code_postal, telephone, email, horaires_ouverture, cree_le';

function versPharmacie(ligne) {
  return new Pharmacie({
    id: ligne.id,
    nom: ligne.nom,
    adresse: ligne.adresse,
    ville: ligne.ville,
    codePostal: ligne.code_postal,
    telephone: ligne.telephone,
    email: ligne.email,
    horaires: ligne.horaires_ouverture,
    creeLe: ligne.cree_le,
  });
}

export class DepotPharmaciePg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmacies ORDER BY id`);
    return lignes.map(versPharmacie);
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM pharmacies WHERE id = $1`, [id]);
    return lignes[0] ? versPharmacie(lignes[0]) : null;
  }

  async creer(pharmacie) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO pharmacies (nom, adresse, ville, code_postal, telephone, email, horaires_ouverture)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLONNES}`,
      [
        pharmacie.nom, pharmacie.adresse, pharmacie.ville, pharmacie.codePostal,
        pharmacie.telephone, pharmacie.email, pharmacie.horaires,
      ],
    );
    return versPharmacie(lignes[0]);
  }
}
