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
    this.#definirPharmacieId(pharmacieId);
    this.#definirMedicamentId(medicamentId);
    this.#definirMisAJourLe(misAJourLe);
    this.#definirPrix(prix);
    this.#definirQuantite(quantite);
  }

  // La date de mise à jour est nulle tant que le stock n'est pas persisté, sinon une date valide
  #definirMisAJourLe(nouvelleDate) {
    if (nouvelleDate !== null && Number.isNaN(new Date(nouvelleDate).getTime())) {
      throw new ErreurStockInvalide('misAJourLe doit être une date valide');
    }
    this.#misAJourLe = nouvelleDate !== null ? new Date(nouvelleDate) : null;
  }

  // Un identifiant doit être un entier strictement positif
  #definirPharmacieId(nouvelId) {
    if (!Number.isInteger(nouvelId) || nouvelId <= 0) {
      throw new ErreurStockInvalide('pharmacieId doit être un entier positif');
    }
    this.#pharmacieId = nouvelId;
  }

  #definirMedicamentId(nouvelId) {
    if (!Number.isInteger(nouvelId) || nouvelId <= 0) {
      throw new ErreurStockInvalide('medicamentId doit être un entier positif');
    }
    this.#medicamentId = nouvelId;
  }

  // Un prix doit être un entier positif ou nul
  #definirPrix(nouveauPrix) {
    if (!Number.isInteger(nouveauPrix) || nouveauPrix < 0) {
      throw new ErreurStockInvalide(`Prix invalide : ${JSON.stringify(nouveauPrix)}`);
    }
    this.#prix = nouveauPrix;
  }

  // Une quantité doit être un entier positif ou nul
  #definirQuantite(nouvelleQuantite) {
    if (!Number.isInteger(nouvelleQuantite) || nouvelleQuantite < 0) {
      throw new ErreurStockInvalide(`Quantité invalide : ${JSON.stringify(nouvelleQuantite)}`);
    }
    this.#quantite = nouvelleQuantite;
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
    // Le stock est immuable : on renvoie un nouveau Stock, dont le constructeur valide prix et quantite
    return new Stock({
      pharmacieId: this.#pharmacieId,
      medicamentId: this.#medicamentId,
      prix: prix !== undefined ? prix : this.#prix,
      quantite: quantite !== undefined ? quantite : this.#quantite,
      misAJourLe: this.#misAJourLe,
    });
  }
}
