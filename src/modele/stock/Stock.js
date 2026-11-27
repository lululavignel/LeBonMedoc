import { ErreurStockInvalide } from '../erreurs.js';
import { Medicament } from '../medicament/Medicament.js';

// Un stock est identifié par le couple (pharmacie, médicament)
export class Stock {
  #pharmacieId;
  #medicamentId;
  #prix;
  #quantite;
  #misAJourLe;

  // Reconstitution d'un stock existant (utilisé par le dépôt, sans médicament :
  // les données venant de la base ont déjà été validées à leur écriture)
  constructor({ pharmacieId, medicamentId, prix, quantite = 0, misAJourLe = null }, medicament = null) {
    // Validation des paramètres au plus proche de la donnée (modèle riche)
    this.#definirPharmacieId(pharmacieId);
    this.#definirMedicamentId(medicamentId);
    this.#definirMisAJourLe(misAJourLe);
    this.#definirPrixVente(prix, medicament);
    this.#definirQuantite(quantite);
  }

  // Création d'un nouveau stock (pas encore persisté : misAJourLe est fixé par la base).
  // Le médicament associé est requis pour vérifier les règles de prix de vente.
  static creer({ pharmacieId, medicamentId, prix, quantite = 0 }, medicament) {
    if (!medicament) {
      throw new ErreurStockInvalide('Le médicament est requis pour créer un stock');
    }
    return new Stock({ pharmacieId, medicamentId, prix, quantite, misAJourLe: null }, medicament);
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

  // Un prix de vente doit être un entier positif ou nul.
  // Si le médicament est fourni, un médicament remboursable doit être vendu à son prix par défaut.
  #definirPrixVente(prixVente, medicament) {
    if (!Number.isInteger(prixVente) || prixVente < 0) {
      throw new ErreurStockInvalide(`Prix de vente invalide : ${JSON.stringify(prixVente)}`);
    }
    if (medicament !== null) {
      if (!(medicament instanceof Medicament) || medicament.id !== this.#medicamentId) {
        throw new ErreurStockInvalide(`Le médicament fourni ne correspond pas au medicamentId ${this.#medicamentId}`);
      }
      if (medicament.estRemboursable && prixVente !== medicament.prixDefaut) {
        throw new ErreurStockInvalide(
          `Un médicament remboursable doit être vendu à son prix par défaut (${medicament.prixDefaut}), pas ${prixVente}`,
        );
      }
    }
    this.#prix = prixVente;
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

  // Le médicament associé est requis dès que le prix est modifié
  modifier(modifications, medicament = null) {
    if (modifications === null || typeof modifications !== 'object' || Array.isArray(modifications)) {
      throw new ErreurStockInvalide('Les modifications doivent être un objet { prix?, quantite? }');
    }
    const { prix, quantite } = modifications;
    if (prix === undefined && quantite === undefined) {
      throw new ErreurStockInvalide('Aucune modification : fournir au moins prix ou quantite');
    }
    if (prix !== undefined && medicament === null) {
      throw new ErreurStockInvalide('Le médicament est requis pour modifier le prix de vente');
    }
    // Le stock est immuable : on renvoie un nouveau Stock, dont le constructeur valide prix et quantite
    return new Stock({
      pharmacieId: this.#pharmacieId,
      medicamentId: this.#medicamentId,
      prix: prix !== undefined ? prix : this.#prix,
      quantite: quantite !== undefined ? quantite : this.#quantite,
      misAJourLe: this.#misAJourLe,
    }, medicament);
  }
}
