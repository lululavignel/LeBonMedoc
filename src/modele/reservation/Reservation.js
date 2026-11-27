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
    this.#definirId(id);
    this.#definirClientId(clientId);
    this.#definirPharmacieId(pharmacieId);
    this.#definirStatut(statut);
    this.#definirRetraitLe(retraitLe);
    // Après le statut : la règle sur expireLe dépend du statut
    this.#definirExpireLe(expireLe);
    this.#definirLignes(lignes);
  }

  // L'id est nul tant que la réservation n'est pas persistée (il est généré par la base)
  #definirId(nouvelId) {
    if (nouvelId !== null && nouvelId !== undefined && (!Number.isInteger(nouvelId) || nouvelId <= 0)) {
      throw new ErreurReservationInvalide('id doit être un entier positif');
    }
    this.#id = nouvelId ?? null;
  }

  #definirClientId(nouvelId) {
    if (!Number.isInteger(nouvelId) || nouvelId <= 0) {
      throw new ErreurReservationInvalide('clientId doit être un entier positif');
    }
    this.#clientId = nouvelId;
  }

  #definirPharmacieId(nouvelId) {
    if (!Number.isInteger(nouvelId) || nouvelId <= 0) {
      throw new ErreurReservationInvalide('pharmacieId doit être un entier positif');
    }
    this.#pharmacieId = nouvelId;
  }

  #definirStatut(nouveauStatut) {
    if (!Object.values(StatutReservation).includes(nouveauStatut)) {
      throw new ErreurReservationInvalide(`Statut de réservation inconnu : ${JSON.stringify(nouveauStatut)}`);
    }
    this.#statut = nouveauStatut;
  }

  // Date de retrait souhaitée par le client : facultative, sinon une date valide
  #definirRetraitLe(nouvelleDate) {
    if (nouvelleDate !== null && Number.isNaN(new Date(nouvelleDate).getTime())) {
      throw new ErreurReservationInvalide('retraitLe doit être une date valide');
    }
    this.#retraitLe = nouvelleDate !== null ? new Date(nouvelleDate) : null;
  }

  // Date limite de retrait : obligatoire dès que la réservation est acceptée
  #definirExpireLe(nouvelleDate) {
    if (this.#statut === StatutReservation.ACCEPTEE && !nouvelleDate) {
      throw new ErreurReservationInvalide('Une réservation acceptée doit avoir une date limite de retrait');
    }
    this.#expireLe = nouvelleDate ? new Date(nouvelleDate) : null;
  }

  // Au moins une ligne, et chaque médicament n'apparaît qu'une fois
  #definirLignes(nouvellesLignes) {
    if (!Array.isArray(nouvellesLignes) || nouvellesLignes.length === 0) {
      throw new ErreurReservationInvalide('Une réservation doit contenir au moins un médicament');
    }
    const lignesReservation = nouvellesLignes.map((ligne) => (ligne instanceof LigneReservation ? ligne : new LigneReservation(ligne ?? {})));
    const medicaments = new Set();
    for (const { medicamentId } of lignesReservation) {
      if (medicaments.has(medicamentId)) {
        throw new ErreurReservationInvalide(`Le médicament ${medicamentId} apparaît plusieurs fois`);
      }
      medicaments.add(medicamentId);
    }
    this.#lignes = lignesReservation;
  }

  get id() { return this.#id; }
  get clientId() { return this.#clientId; }
  get pharmacieId() { return this.#pharmacieId; }
  get lignes() { return [...this.#lignes]; }
  get statut() { return this.#statut; }
  get retraitLe() { return this.#retraitLe ? new Date(this.#retraitLe) : null; }
  get expireLe() { return this.#expireLe ? new Date(this.#expireLe) : null; }


  // Fonctions de transition de statut

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
