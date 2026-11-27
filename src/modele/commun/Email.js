import { ErreurEmailInvalide } from '../erreurs.js';

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGUEUR_MAX = 255;

export class Email {
  #valeur;

  constructor(valeur) {
    if (typeof valeur !== 'string' || !FORMAT_EMAIL.test(valeur.trim())) {
      throw new ErreurEmailInvalide(`Email invalide : ${JSON.stringify(valeur)}`);
    }
    if (valeur.trim().length > LONGUEUR_MAX) {
      throw new ErreurEmailInvalide(`L'email ne doit pas dépasser ${LONGUEUR_MAX} caractères`);
    }
    this.#valeur = valeur.trim().toLowerCase();
  }

  get valeur() { return this.#valeur; }

  egale(autre) {
    return autre instanceof Email && autre.valeur === this.#valeur;
  }

  toString() { return this.#valeur; }
}
