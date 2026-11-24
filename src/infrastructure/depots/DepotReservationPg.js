import { connexions } from '../bdd/connexion.js';

const COLONNES = 'id, client_id, pharmacie_id, statut, retrait_le, cree_le, mis_a_jour_le';
const COLONNES_LIGNE = 'reservation_id, medicament_id, quantite';

// La réservation est la racine de l'agrégat : ses lignes (lignes_reservation)
// sont lues et écrites avec elle.
export class DepotReservationPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM reservations ORDER BY id`);
    return lignes;
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`SELECT ${COLONNES} FROM reservations WHERE id = $1`, [id]);
    const reservation = lignes[0];
    if (!reservation) return null;
    return { ...reservation, lignes: await this.getLignes(id) };
  }

  async getLignes(reservationId) {
    const { rows: lignes } = await connexions.query(
      `SELECT ${COLONNES_LIGNE} FROM lignes_reservation WHERE reservation_id = $1 ORDER BY medicament_id`,
      [reservationId],
    );
    return lignes;
  }

  async creer({ clientId, pharmacieId, retraitLe = null, lignes }) {
    const client = await connexions.connect();
    try {
      await client.query('BEGIN');
      const { rows: [reservation] } = await client.query(
        `INSERT INTO reservations (client_id, pharmacie_id, retrait_le)
         VALUES ($1, $2, $3)
         RETURNING ${COLONNES}`,
        [clientId, pharmacieId, retraitLe],
      );
      const lignesCreees = [];
      for (const { medicamentId, quantite } of lignes) {
        const { rows: [ligne] } = await client.query(
          `INSERT INTO lignes_reservation (reservation_id, medicament_id, quantite)
           VALUES ($1, $2, $3)
           RETURNING ${COLONNES_LIGNE}`,
          [reservation.id, medicamentId, quantite],
        );
        lignesCreees.push(ligne);
      }
      await client.query('COMMIT');
      return { ...reservation, lignes: lignesCreees };
    } catch (erreur) {
      await client.query('ROLLBACK');
      throw erreur;
    } finally {
      client.release();
    }
  }
}
