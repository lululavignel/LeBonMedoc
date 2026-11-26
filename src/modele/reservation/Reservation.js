import { ErreurReservationExpiree, ErreurReservationInvalide, ErreurTransitionInterdite } from '../erreurs.js';
import { LigneReservation } from './LigneReservation.js';
import { StatutReservation, peutTransitionner } from './StatutReservation.js';

const DELAI_RETRAIT_EN_JOURS = 3;
const MILLISECONDES_PAR_JOUR = 24 * 60 * 60 * 1000;

export class Reservation {
  #id;
  #clientId;
  #pharmacieId;
  #lignes;
  #statut;
  #retraitLe;
  #expireLe;

  static creer({ clientId, pharmacieId, lignes, retraitLe = null }) {
    return new Reservation({ id: null, clientId, pharmacieId, lignes, statut: StatutReservation.EN_ATTENTE, retraitLe });
  }

  constructor({ id, clientId, pharmacieId, lignes, statut, retraitLe = null, expireLe = null }) {
    for (const [champ, valeur] of [['clientId', clientId], ['pharmacieId', pharmacieId]]) {
      if (!Number.isInteger(valeur) || valeur <= 0) {
        throw new ErreurReservationInvalide(`${champ} doit être un entier positif`);
      }
    }
    if (!Array.isArray(lignes) || lignes.length === 0) {
      throw new ErreurReservationInvalide('Une réservation doit contenir au moins un médicament');
    }
    const lignesReservation = lignes.map((ligne) => (ligne instanceof LigneReservation ? ligne : new LigneReservation(ligne ?? {})));
    const medicaments = new Set();
    for (const { medicamentId } of lignesReservation) {
      if (medicaments.has(medicamentId)) {
        throw new ErreurReservationInvalide(`Le médicament ${medicamentId} apparaît plusieurs fois`);
      }
      medicaments.add(medicamentId);
    }
    if (!Object.values(StatutReservation).includes(statut)) {
      throw new ErreurReservationInvalide(`Statut de réservation inconnu : ${JSON.stringify(statut)}`);
    }
    if (retraitLe !== null && Number.isNaN(new Date(retraitLe).getTime())) {
      throw new ErreurReservationInvalide('retraitLe doit être une date valide');
    }
    if (statut === StatutReservation.ACCEPTEE && !expireLe) {
      throw new ErreurReservationInvalide('Une réservation acceptée doit avoir une date limite de retrait');
    }

    this.#id = id;
    this.#clientId = clientId;
    this.#pharmacieId = pharmacieId;
    this.#lignes = lignesReservation;
    this.#statut = statut;
    this.#retraitLe = retraitLe !== null ? new Date(retraitLe) : null;
    this.#expireLe = expireLe ? new Date(expireLe) : null;
  }

  get id() { return this.#id; }
  get clientId() { return this.#clientId; }
  get pharmacieId() { return this.#pharmacieId; }
  get lignes() { return [...this.#lignes]; }
  get statut() { return this.#statut; }
  get retraitLe() { return this.#retraitLe ? new Date(this.#retraitLe) : null; }
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
