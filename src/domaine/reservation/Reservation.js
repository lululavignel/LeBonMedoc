import { ErreurReservationExpiree, ErreurReservationInvalide, ErreurTransitionInterdite } from '../erreurs.js';
import { StatutReservation, peutTransitionner } from './StatutReservation.js';

const DELAI_RETRAIT_EN_JOURS = 3;
const MILLISECONDES_PAR_JOUR = 24 * 60 * 60 * 1000;

export class Reservation {
  #id;
  #statut;
  #expireLe;

  constructor({ id, statut, expireLe = null }) {
    if (!Object.values(StatutReservation).includes(statut)) {
      throw new ErreurReservationInvalide(`Statut de réservation inconnu : ${JSON.stringify(statut)}`);
    }
    if (statut === StatutReservation.ACCEPTEE && !expireLe) {
      throw new ErreurReservationInvalide('Une réservation acceptée doit avoir une date limite de retrait');
    }

    this.#id = id;
    this.#statut = statut;
    this.#expireLe = expireLe ? new Date(expireLe) : null;
  }

  get id() { return this.#id; }
  get statut() { return this.#statut; }
  get expireLe() { return this.#expireLe ? new Date(this.#expireLe) : null; }

  accepter(maintenant) {
    this.#verifierTransitionVers(StatutReservation.ACCEPTEE);
    this.#statut = StatutReservation.ACCEPTEE;
    this.#expireLe = new Date(maintenant.getTime() + DELAI_RETRAIT_EN_JOURS * MILLISECONDES_PAR_JOUR);
  }

  refuser() {
    this.#verifierTransitionVers(StatutReservation.REFUSEE);
    this.#statut = StatutReservation.REFUSEE;
  }

  annuler() {
    this.#verifierTransitionVers(StatutReservation.ANNULEE);
    this.#statut = StatutReservation.ANNULEE;
  }

  terminer(maintenant) {
    this.#verifierTransitionVers(StatutReservation.TERMINEE);
    if (this.estEchue(maintenant)) {
      throw new ErreurReservationExpiree(`La réservation a expiré le ${this.#expireLe.toISOString()}`);
    }
    this.#statut = StatutReservation.TERMINEE;
  }

  expirer(maintenant) {
    this.#verifierTransitionVers(StatutReservation.EXPIREE);
    if (!this.estEchue(maintenant)) {
      throw new ErreurTransitionInterdite(`La réservation n'expire que le ${this.#expireLe.toISOString()}`);
    }
    this.#statut = StatutReservation.EXPIREE;
  }

  estEchue(maintenant) {
    return this.#statut === StatutReservation.ACCEPTEE && maintenant.getTime() >= this.#expireLe.getTime();
  }

  #verifierTransitionVers(statutCible) {
    if (!peutTransitionner(this.#statut, statutCible)) {
      throw new ErreurTransitionInterdite(`Transition interdite : ${this.#statut} → ${statutCible}`);
    }
  }
}
