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
    Stock.#verifierPrix(prix);
    Stock.#verifierQuantite(quantite);
    if (misAJourLe !== null && Number.isNaN(new Date(misAJourLe).getTime())) {
      throw new ErreurStockInvalide('misAJourLe doit être une date valide');
    }

    this.#pharmacieId = pharmacieId;
    this.#medicamentId = medicamentId;
    this.#prix = prix;
    this.#quantite = quantite;
    this.#misAJourLe = misAJourLe !== null ? new Date(misAJourLe) : null;
  }

  // Un prix doit être un entier positif ou nul
  static #verifierPrix(prix) {
    if (!Number.isInteger(prix) || prix < 0) {
      throw new ErreurStockInvalide(`Prix invalide : ${JSON.stringify(prix)}`);
    }
  }

  // Une quantité doit être un entier positif ou nul
  static #verifierQuantite(quantite) {
    if (!Number.isInteger(quantite) || quantite < 0) {
      throw new ErreurStockInvalide(`Quantité invalide : ${JSON.stringify(quantite)}`);
    }
  }

  get pharmacieId() { return this.#pharmacieId; }
  get medicamentId() { return this.#medicamentId; }
  get prix() { return this.#prix; }
  get quantite() { return this.#quantite; }
  get misAJourLe() { return this.#misAJourLe ? new Date(this.#misAJourLe) : null; }

  // Représentation sérialisable du stock
  toJSON() {
    return {
      pharmacieId: this.#pharmacieId,
      medicamentId: this.#medicamentId,
      prix: this.#prix,
      quantite: this.#quantite,
      misAJourLe: this.#misAJourLe ? this.#misAJourLe.toISOString() : null,
    };
  }

  modifier(modifications) {
    if (modifications === null || typeof modifications !== 'object' || Array.isArray(modifications)) {
      throw new ErreurStockInvalide('Les modifications doivent être un objet { prix?, quantite? }');
    }
    const { prix, quantite } = modifications;
    if (prix === undefined && quantite === undefined) {
      throw new ErreurStockInvalide('Aucune modification : fournir au moins prix ou quantite');
    }
    if (prix !== undefined) Stock.#verifierPrix(prix);
    if (quantite !== undefined) Stock.#verifierQuantite(quantite);

    return new Stock({
      pharmacieId: this.#pharmacieId,
      medicamentId: this.#medicamentId,
      prix: prix ?? this.#prix,
      quantite: quantite ?? this.#quantite,
      misAJourLe: this.#misAJourLe,
    });
  }
}
