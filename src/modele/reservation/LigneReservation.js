import { ErreurReservationInvalide } from '../erreurs.js';

// Objet-valeur : un médicament demandé dans une réservation, avec sa quantité
export class LigneReservation {
  #medicamentId;
  #quantite;

  constructor({ medicamentId, quantite }) {
    if (!Number.isInteger(medicamentId) || medicamentId <= 0) {
      throw new ErreurReservationInvalide('Chaque ligne doit avoir un medicamentId entier positif');
    }
    if (!Number.isInteger(quantite) || quantite <= 0) {
      throw new ErreurReservationInvalide('Chaque ligne doit avoir une quantite entière strictement positive');
    }

    this.#medicamentId = medicamentId;
    this.#quantite = quantite;
    Object.freeze(this);
  }

  get medicamentId() { return this.#medicamentId; }
  get quantite() { return this.#quantite; }
}
