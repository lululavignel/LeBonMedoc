import { connexions } from '../bdd/connexion.js';
import { Client } from '../../modele/client/Client.js';

const COLONNES = 'id, nom, prenom, numero_securite_sociale, email, telephone, cree_le';

function versClient(ligne) {
  return new Client({
    id: ligne.id,
    nom: ligne.nom,
    prenom: ligne.prenom,
    numeroSecuriteSociale: ligne.numero_securite_sociale,
    email: ligne.email,
    telephone: ligne.telephone,
    creeLe: ligne.cree_le,
  });
}

export class DepotClientPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM clients ORDER BY id`);
    return lignes.map(versClient);
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM clients WHERE id = $1`, [id]);
    return lignes[0] ? versClient(lignes[0]) : null;
  }

  async creer(client) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO clients (nom, prenom, numero_securite_sociale, email, telephone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLONNES}`,
      [client.nom, client.prenom, client.numeroSecuriteSociale.valeur, client.email.valeur, client.telephone?.valeur ?? null],
    );
    return versClient(lignes[0]);
  }
}
