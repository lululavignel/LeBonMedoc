import { ErreurCodePostalInvalide } from '../erreurs.js';

const FORMAT = /^\d{5}$/;

export class CodePostal {
  #valeur;

  constructor(valeur) {
    const code = typeof valeur === 'string' ? valeur.replace(/\s/g, '') : valeur;
    if (typeof code !== 'string' || !FORMAT.test(code)) {
      throw new ErreurCodePostalInvalide('Le code postal doit comporter 5 chiffres');
    }
    this.#valeur = code;
  }

  get valeur() { return this.#valeur; }

  egale(autre) {
    return autre instanceof CodePostal && autre.valeur === this.#valeur;
  }

  toString() { return this.#valeur; }
}
