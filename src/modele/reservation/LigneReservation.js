import { ErreurReservationInvalide } from '../erreurs.js';

// Objet-valeur immuable : un médicament demandé dans une réservation, avec sa quantité.
// Le lien vers la réservation (FK reservation_id) est porté par l'agrégat Reservation et géré par le dépôt.
export class LigneReservation {
  #medicamentId;
  #quantite;

  constructor({ medicamentId, quantite }) {
    this.#definirMedicamentId(medicamentId);
    this.#definirQuantite(quantite);
  }

  get medicamentId() { return this.#medicamentId; }
  get quantite() { return this.#quantite; }

  #definirMedicamentId(newId) {
    if (!Number.isInteger(newId) || newId <= 0) {
      throw new ErreurReservationInvalide('Chaque ligne doit avoir un medicamentId entier positif');
    }
    this.#medicamentId = newId;
  }

  #definirQuantite(newQuantite) {
    if (!Number.isInteger(newQuantite) || newQuantite <= 0) {
      throw new ErreurReservationInvalide('Chaque ligne doit avoir une quantite entière strictement positive');
    }
    this.#quantite = newQuantite;
  }
}
