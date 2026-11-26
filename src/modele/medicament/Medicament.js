import { ErreurMedicamentInvalide } from '../erreurs.js';

export class Medicament {
  #id;
  #nom;
  #prixDefaut;
  #estRemboursable;
  #categorie;
  #necessiteOrdonnance;

  constructor({ id, nom, prixDefaut, estRemboursable, categorie = null, necessiteOrdonnance = false }) {
    if (typeof nom !== 'string' || nom.trim() === '') {
      throw new ErreurMedicamentInvalide('Le nom du médicament est obligatoire');
    }
    if (!Number.isInteger(prixDefaut) || prixDefaut < 0) {
      throw new ErreurMedicamentInvalide(`Prix par défaut invalide : ${JSON.stringify(prixDefaut)}`);
    }
    if (typeof estRemboursable !== 'boolean') {
      throw new ErreurMedicamentInvalide('estRemboursable doit être un booléen');
    }
    if (typeof necessiteOrdonnance !== 'boolean') {
      throw new ErreurMedicamentInvalide('necessiteOrdonnance doit être un booléen');
    }
    if (categorie !== null && typeof categorie !== 'string') {
      throw new ErreurMedicamentInvalide('La catégorie doit être une chaîne de caractères');
    }

    this.#id = id;
    this.#nom = nom.trim();
    this.#prixDefaut = prixDefaut;
    this.#estRemboursable = estRemboursable;
    this.#categorie = categorie;
    this.#necessiteOrdonnance = necessiteOrdonnance;
  }

  get id() { return this.#id; }
  get nom() { return this.#nom; }
  get prixDefaut() { return this.#prixDefaut; }
  get estRemboursable() { return this.#estRemboursable; }
  get categorie() { return this.#categorie; }
  get necessiteOrdonnance() { return this.#necessiteOrdonnance; }

  verifierPrixVente(prixVente) {
    if (!Number.isInteger(prixVente) || prixVente < 0) {
      throw new ErreurMedicamentInvalide(`Prix de vente invalide : ${JSON.stringify(prixVente)}`);
    }
    if (this.#estRemboursable && prixVente !== this.#prixDefaut) {
      throw new ErreurMedicamentInvalide(
        `Un médicament remboursable doit être vendu à son prix par défaut (${this.#prixDefaut}), pas ${prixVente}`,
      );
    }
  }
}
