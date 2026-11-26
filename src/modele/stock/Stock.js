import { ErreurStockInvalide } from '../erreurs.js';

// Un stock est identifié par le couple (pharmacie, médicament)
export class Stock {
  #pharmacieId;
  #medicamentId;
  #prix;
  #quantite;
  #misAJourLe;

  constructor({ pharmacieId, medicamentId, prix, quantite = 0, misAJourLe = null }) {
    // Validation des paramètres au plus proche de la données (modèle riche)
    // Un 'id' doit être un entier positif
    for (const [champ, valeur] of [['pharmacieId', pharmacieId], ['medicamentId', medicamentId]]) {
      if (!Number.isInteger(valeur) || valeur <= 0) {
        throw new ErreurStockInvalide(`${champ} invalide : ${JSON.stringify(valeur)}`);
      }
    }
    // Un 'prix' doit être un entier strictement positif
    if (!Number.isInteger(prix) || prix < 0) {
      throw new ErreurStockInvalide(`Prix invalide : ${JSON.stringify(prix)}`);
    }
    // Une 'quantité' doit être un entier strictement positif
    if (!Number.isInteger(quantite) || quantite < 0) {
      throw new ErreurStockInvalide(`Quantité invalide : ${JSON.stringify(quantite)}`);
    }

    this.#pharmacieId = pharmacieId;
    this.#medicamentId = medicamentId;
    this.#prix = prix;
    this.#quantite = quantite;
    this.#misAJourLe = misAJourLe ? new Date(misAJourLe) : null;
  }

  get pharmacieId() { return this.#pharmacieId; }
  get medicamentId() { return this.#medicamentId; }
  get prix() { return this.#prix; }
  get quantite() { return this.#quantite; }
  get misAJourLe() { return this.#misAJourLe ? new Date(this.#misAJourLe) : null; }

  toJSON() {
    return {
      pharmacieId: this.#pharmacieId,
      medicamentId: this.#medicamentId,
      prix: this.#prix,
      quantite: this.#quantite,
      misAJourLe: this.misAJourLe,
    };
  }
}
