import { ErreurStockInvalide } from '../erreurs.js';

// Un stock est identifié par le couple (pharmacie, médicament)
export class Stock {
  #pharmacieId;
  #medicamentId;
  #prix;
  #quantite;
  #misAJourLe;

  // Création d'un nouveau stock (pas encore persisté : misAJourLe est fixé par la base)
  static creer({ pharmacieId, medicamentId, prix, quantite = 0 }) {
    return new Stock({ pharmacieId, medicamentId, prix, quantite, misAJourLe: null });
  }

  // Reconstitution d'un stock existant (utilisé par le dépôt)
  constructor({ pharmacieId, medicamentId, prix, quantite = 0, misAJourLe = null }) {
    // Validation des paramètres au plus proche de la donnée (modèle riche)
    // Un identifiant doit être un entier strictement positif
    for (const [champ, valeur] of [['pharmacieId', pharmacieId], ['medicamentId', medicamentId]]) {
      if (!Number.isInteger(valeur) || valeur <= 0) {
        throw new ErreurStockInvalide(`${champ} doit être un entier positif`);
      }
    }
    // Un prix doit être un entier positif ou nul
    if (!Number.isInteger(prix) || prix < 0) {
      throw new ErreurStockInvalide(`Prix invalide : ${JSON.stringify(prix)}`);
    }
    // Une quantité doit être un entier positif ou nul
    if (!Number.isInteger(quantite) || quantite < 0) {
      throw new ErreurStockInvalide(`Quantité invalide : ${JSON.stringify(quantite)}`);
    }
    if (misAJourLe !== null && Number.isNaN(new Date(misAJourLe).getTime())) {
      throw new ErreurStockInvalide('misAJourLe doit être une date valide');
    }

    this.#pharmacieId = pharmacieId;
    this.#medicamentId = medicamentId;
    this.#prix = prix;
    this.#quantite = quantite;
    this.#misAJourLe = misAJourLe !== null ? new Date(misAJourLe) : null;
  }

  get pharmacieId() { return this.#pharmacieId; }
  get medicamentId() { return this.#medicamentId; }
  get prix() { return this.#prix; }
  get quantite() { return this.#quantite; }
  get misAJourLe() { return this.#misAJourLe ? new Date(this.#misAJourLe) : null; }
}
