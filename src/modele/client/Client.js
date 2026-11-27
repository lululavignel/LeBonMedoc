import { ErreurClientInvalide, ErreurNumeroSecuriteSocialeInvalide } from '../erreurs.js';

const FORMAT_NUMERO_SECURITE_SOCIALE = /^\d{15}$/;
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LONGUEUR_MAX_NOM = 100;
const LONGUEUR_MAX_PRENOM = 100;
const LONGUEUR_MAX_EMAIL = 255;
const LONGUEUR_MAX_TELEPHONE = 30;

export class Client {
  #id;
  #nom;
  #prenom;
  #numeroSecuriteSociale;
  #email;
  #telephone;
  #creeLe;

  static creer({ nom, prenom, numeroSecuriteSociale, email, telephone = null }) {
    return new Client({ id: null, nom, prenom, numeroSecuriteSociale, email, telephone, creeLe: null });
  }

  constructor({ id = null, nom, prenom, numeroSecuriteSociale, email, telephone = null, creeLe = null }) {
    this.#definirId(id);
    this.#nom = Client.#validerTexte('nom', nom, LONGUEUR_MAX_NOM);
    this.#prenom = Client.#validerTexte('prenom', prenom, LONGUEUR_MAX_PRENOM);
    this.#definirNumeroSecuriteSociale(numeroSecuriteSociale);
    this.#email = Client.#validerEmail(email);
    this.#telephone = Client.#validerTelephone(telephone);
    this.#definirCreeLe(creeLe);
  }

  #definirId(id) {
    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      throw new ErreurClientInvalide('id doit être un entier positif');
    }
    this.#id = id;
  }

  #definirNumeroSecuriteSociale(numeroSecuriteSociale) {
    const numero = typeof numeroSecuriteSociale === 'string'
      ? numeroSecuriteSociale.replace(/\s/g, '')
      : numeroSecuriteSociale;
    if (typeof numero !== 'string' || !FORMAT_NUMERO_SECURITE_SOCIALE.test(numero)) {
      throw new ErreurNumeroSecuriteSocialeInvalide(
        'Le numéro de sécurité sociale doit comporter 15 chiffres',
      );
    }
    this.#numeroSecuriteSociale = numero;
  }

  #definirCreeLe(creeLe) {
    if (creeLe !== null && Number.isNaN(new Date(creeLe).getTime())) {
      throw new ErreurClientInvalide('creeLe doit être une date valide');
    }
    this.#creeLe = creeLe !== null ? new Date(creeLe) : null;
  }

  get id() { return this.#id; }
  get nom() { return this.#nom; }
  get prenom() { return this.#prenom; }
  get numeroSecuriteSociale() { return this.#numeroSecuriteSociale; }
  get email() { return this.#email; }
  get telephone() { return this.#telephone; }
  get creeLe() { return this.#creeLe ? new Date(this.#creeLe) : null; }

  changerEmail(email) {
    this.#email = Client.#validerEmail(email);
  }

  changerTelephone(telephone) {
    this.#telephone = Client.#validerTelephone(telephone);
  }

  toJSON() {
    return {
      id: this.#id,
      nom: this.#nom,
      prenom: this.#prenom,
      numeroSecuriteSociale: this.#numeroSecuriteSociale,
      email: this.#email,
      telephone: this.#telephone,
      creeLe: this.#creeLe ? this.#creeLe.toISOString() : null,
    };
  }

  static #validerTexte(champ, valeur, longueurMax) {
    if (typeof valeur !== 'string' || valeur.trim() === '') {
      throw new ErreurClientInvalide(`Le ${champ} du client est obligatoire`);
    }
    if (valeur.trim().length > longueurMax) {
      throw new ErreurClientInvalide(`Le ${champ} du client ne doit pas dépasser ${longueurMax} caractères`);
    }
    return valeur.trim();
  }

  static #validerEmail(email) {
    if (typeof email !== 'string' || !FORMAT_EMAIL.test(email.trim())) {
      throw new ErreurClientInvalide(`Email invalide : ${JSON.stringify(email)}`);
    }
    if (email.trim().length > LONGUEUR_MAX_EMAIL) {
      throw new ErreurClientInvalide(`L'email ne doit pas dépasser ${LONGUEUR_MAX_EMAIL} caractères`);
    }
    return email.trim().toLowerCase();
  }

  static #validerTelephone(telephone) {
    if (telephone === null) return null;
    if (typeof telephone !== 'string' || telephone.trim() === '') {
      throw new ErreurClientInvalide(`Téléphone invalide : ${JSON.stringify(telephone)}`);
    }
    if (telephone.trim().length > LONGUEUR_MAX_TELEPHONE) {
      throw new ErreurClientInvalide(`Le téléphone ne doit pas dépasser ${LONGUEUR_MAX_TELEPHONE} caractères`);
    }
    return telephone.trim();
  }
}
