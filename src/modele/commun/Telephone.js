import { ErreurTelephoneInvalide } from '../erreurs.js';

const LONGUEUR_MAX = 30;

export class Telephone {
  #valeur;

  constructor(valeur) {
    if (typeof valeur !== 'string' || valeur.trim() === '') {
      throw new ErreurTelephoneInvalide(`Téléphone invalide : ${JSON.stringify(valeur)}`);
    }
    if (valeur.trim().length > LONGUEUR_MAX) {
      throw new ErreurTelephoneInvalide(`Le téléphone ne doit pas dépasser ${LONGUEUR_MAX} caractères`);
    }
    this.#valeur = valeur.trim();
  }

  get valeur() { return this.#valeur; }

  egale(autre) {
    return autre instanceof Telephone && autre.valeur === this.#valeur;
  }

  toString() { return this.#valeur; }
}
