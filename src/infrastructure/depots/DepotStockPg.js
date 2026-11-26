import { connexions } from '../bdd/connexion.js';
import { Stock } from '../../modele/stock/Stock.js';

const COLONNES = 'pharmacie_id, medicament_id, prix, quantite, mis_a_jour_le';

function versStock(ligne) {
  return new Stock({
    pharmacieId: ligne.pharmacie_id,
    medicamentId: ligne.medicament_id,
    prix: ligne.prix,
    quantite: ligne.quantite,
    misAJourLe: ligne.mis_a_jour_le,
  });
}

// Un stock est identifié par le couple (pharmacie, médicament)
export class DepotStockPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(
      `SELECT ${COLONNES} FROM stocks ORDER BY pharmacie_id, medicament_id`,
    );
    return lignes.map(versStock);
  }

  async getById(pharmacieId, medicamentId) {
    const { rows: lignes } = await connexions.query(
      `SELECT ${COLONNES} FROM stocks WHERE pharmacie_id = $1 AND medicament_id = $2`,
      [pharmacieId, medicamentId],
    );
    return lignes[0] ? versStock(lignes[0]) : null;
  }

  async creer(stock) {
    const { rows: lignes } = await connexions.query(
      `INSERT INTO stocks (pharmacie_id, medicament_id, prix, quantite)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLONNES}`,
      [stock.pharmacieId, stock.medicamentId, stock.prix, stock.quantite],
    );
    return versStock(lignes[0]);
  }

  async modifier(stock) {
    const { rows: lignes } = await connexions.query(
      `UPDATE stocks SET prix = $3, quantite = $4, mis_a_jour_le = now()
      WHERE pharmacie_id = $1 AND medicament_id = $2
      RETURNING ${COLONNES}`,
      [stock.pharmacieId, stock.medicamentId, stock.prix, stock.quantite],
    );
    return versStock(lignes[0]);
  }
}
