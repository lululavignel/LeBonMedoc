import { ErreurIntrouvable } from '../erreurs.js';
import { Reservation } from '../../modele/reservation/Reservation.js';

export class ServiceReservation {
  constructor(depotReservation) {
    this.depotReservation = depotReservation;
  }

  listerReservations() {
    return this.depotReservation.getAll();
  }

  async obtenirReservationParId(id) {
    const reservation = await this.depotReservation.getById(id);
    if (!reservation) throw new ErreurIntrouvable(`Réservation ${id} introuvable`);
    return reservation;
  }

  async listerLignesReservation(id) {
    const reservation = await this.obtenirReservationParId(id);
    return reservation.lignes;
  }

  async accepterReservation(id) {
    const reservation = await this.obtenirReservationParId(id);
    reservation.accepter(new Date());
    await this.depotReservation.miseAJourDeLetat(reservation);
    return reservation;
  }

  async refuserReservation(id) {
    const reservation = await this.obtenirReservationParId(id);
    reservation.refuser();
    await this.depotReservation.miseAJourDeLetat(reservation);
    return reservation;
  }

  async annulerReservation(id) {
    const reservation = await this.obtenirReservationParId(id);
    reservation.annuler();
    await this.depotReservation.miseAJourDeLetat(reservation);
    return reservation;
  }

  async terminerReservation(id) {
    const reservation = await this.obtenirReservationParId(id);
    reservation.terminer(new Date());
    await this.depotReservation.miseAJourDeLetat(reservation);
    return reservation;
  }

  creerReservation(donnees) {
    const reservation = Reservation.creer(donnees ?? {});
    return this.depotReservation.creer(reservation);
  }
}
