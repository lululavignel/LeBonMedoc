import { ErreurNumeroSecuriteSocialeInvalide } from '../erreurs.js';

const FORMAT = /^\d{15}$/;

export class NumeroSecuriteSociale {
  #valeur;

  constructor(valeur) {
    const numero = typeof valeur === 'string' ? valeur.replace(/\s/g, '') : valeur;
    if (typeof numero !== 'string' || !FORMAT.test(numero)) {
      throw new ErreurNumeroSecuriteSocialeInvalide('Le numéro de sécurité sociale doit comporter 15 chiffres');
    }
    this.#valeur = numero;
  }

  get valeur() { return this.#valeur; }

  egale(autre) {
    return autre instanceof NumeroSecuriteSociale && autre.valeur === this.#valeur;
  }

  toString() { return this.#valeur; }
}
