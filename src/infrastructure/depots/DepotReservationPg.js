import { connexions } from '../bdd/connexion.js';
import { ErreurConflit } from '../../application/erreurs.js';
import { Reservation } from '../../modele/reservation/Reservation.js';

// La réservation est la racine de l'agrégat : ses lignes (lignes_reservation)
const SELECT_RESERVATION = `
  SELECT r.id, r.client_id, r.pharmacie_id, r.statut, r.retrait_le, r.expire_le,
         (SELECT json_agg(json_build_object('medicamentId', l.medicament_id, 'quantite', l.quantite)
                          ORDER BY l.medicament_id)
          FROM lignes_reservation l
          WHERE l.reservation_id = r.id) AS lignes
  FROM reservations r`;

const statutsCharges = new WeakMap();

function versReservation(ligne) {
  const reservation = new Reservation({
    id: ligne.id,
    clientId: ligne.client_id,
    pharmacieId: ligne.pharmacie_id,
    lignes: ligne.lignes,
    statut: ligne.statut,
    retraitLe: ligne.retrait_le,
    expireLe: ligne.expire_le,
  });
  statutsCharges.set(reservation, ligne.statut);
  return reservation;
}

export class DepotReservationPg {
  async getAll() {
    const { rows: lignes } = await connexions.query(`${SELECT_RESERVATION} ORDER BY r.id`);
    return lignes.map(versReservation);
  }

  async getById(id) {
    const { rows: lignes } = await connexions.query(`${SELECT_RESERVATION} WHERE r.id = $1`, [id]);
    return lignes[0] ? versReservation(lignes[0]) : null;
  }

  async miseAJourDeLetat(reservation) {
    const { rowCount } = await connexions.query(
      `UPDATE reservations
       SET statut = $2, expire_le = $3, mis_a_jour_le = now()
       WHERE id = $1 AND statut = $4`,
      [reservation.id, reservation.statut, reservation.expireLe, statutsCharges.get(reservation)],
    );
    if (rowCount === 0) {
      throw new ErreurConflit(`La réservation ${reservation.id} a été modifiée entre-temps, veuillez réessayer`);
    }
    statutsCharges.set(reservation, reservation.statut);
  }

  async creer(reservation) {
    const { rows: lignes } = await connexions.query(
      `WITH r AS (
         INSERT INTO reservations (client_id, pharmacie_id, statut, retrait_le)
         VALUES ($1, $2, $3, $4)
         RETURNING id, client_id, pharmacie_id, statut, retrait_le, expire_le
       ), l AS (
         INSERT INTO lignes_reservation (reservation_id, medicament_id, quantite)
         SELECT r.id, l.medicament_id, l.quantite
         FROM r, unnest($5::int[], $6::int[]) AS l(medicament_id, quantite)
       )
       SELECT r.*, $7::json AS lignes FROM r`,
      [
        reservation.clientId,
        reservation.pharmacieId,
        reservation.statut,
        reservation.retraitLe,
        reservation.lignes.map((l) => l.medicamentId),
        reservation.lignes.map((l) => l.quantite),
        JSON.stringify(reservation.lignes.map((l) => ({ medicamentId: l.medicamentId, quantite: l.quantite }))),
      ],
    );
    return versReservation(lignes[0]);
  }
}
