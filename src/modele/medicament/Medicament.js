import { ErreurMedicamentInvalide } from '../erreurs.js';

export class Medicament {
  #id;
  #nom;
  #prixDefaut;
  #estRemboursable;
  #categorie;
  #necessiteOrdonnance;

  constructor({ id, nom, prixDefaut, estRemboursable, categorie = null, necessiteOrdonnance = false }) {
    this.#definirId(id);
    this.#definirNom(nom);
    this.#definirPrixDefaut(prixDefaut);
    this.#definirEstRemboursable(estRemboursable);
    this.#definirNecessiteOrdonnance(necessiteOrdonnance);
    this.#definirCategorie(categorie);
  }

  // L'id est nul tant que le médicament n'est pas persisté (il est généré par la base)
  #definirId(nouvelId) {
    if (nouvelId !== null && nouvelId !== undefined && (!Number.isInteger(nouvelId) || nouvelId <= 0)) {
      throw new ErreurMedicamentInvalide('id doit être un entier positif');
    }
    this.#id = nouvelId ?? null;
  }

  // Le nom est obligatoire et stocké sans espaces superflus
  #definirNom(nouveauNom) {
    if (typeof nouveauNom !== 'string' || nouveauNom.trim() === '') {
      throw new ErreurMedicamentInvalide('Le nom du médicament est obligatoire');
    }
    this.#nom = nouveauNom.trim();
  }

  // Un prix doit être un entier positif ou nul
  #definirPrixDefaut(nouveauPrix) {
    if (!Number.isInteger(nouveauPrix) || nouveauPrix < 0) {
      throw new ErreurMedicamentInvalide(`Prix par défaut invalide : ${JSON.stringify(nouveauPrix)}`);
    }
    this.#prixDefaut = nouveauPrix;
  }

  #definirEstRemboursable(remboursable) {
    if (typeof remboursable !== 'boolean') {
      throw new ErreurMedicamentInvalide('estRemboursable doit être un booléen');
    }
    this.#estRemboursable = remboursable;
  }

  #definirNecessiteOrdonnance(ordonnanceRequise) {
    if (typeof ordonnanceRequise !== 'boolean') {
      throw new ErreurMedicamentInvalide('necessiteOrdonnance doit être un booléen');
    }
    this.#necessiteOrdonnance = ordonnanceRequise;
  }

  // La catégorie est facultative
  #definirCategorie(nouvelleCategorie) {
    if (nouvelleCategorie !== null && typeof nouvelleCategorie !== 'string') {
      throw new ErreurMedicamentInvalide('La catégorie doit être une chaîne de caractères');
    }
    this.#categorie = nouvelleCategorie;
  }

  get id() { return this.#id; }
  get nom() { return this.#nom; }
  get prixDefaut() { return this.#prixDefaut; }
  get estRemboursable() { return this.#estRemboursable; }
  get categorie() { return this.#categorie; }
  get necessiteOrdonnance() { return this.#necessiteOrdonnance; }
}
