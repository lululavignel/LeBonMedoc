import { ErreurClientInvalide } from '../erreurs.js';
import { Email } from '../commun/Email.js';
import { Telephone } from '../commun/Telephone.js';
import { NumeroSecuriteSociale } from './NumeroSecuriteSociale.js';

const LONGUEUR_MAX_NOM = 100;
const LONGUEUR_MAX_PRENOM = 100;

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
    this.#numeroSecuriteSociale = new NumeroSecuriteSociale(numeroSecuriteSociale);
    this.#email = new Email(email);
    this.#telephone = telephone === null ? null : new Telephone(telephone);
    this.#definirCreeLe(creeLe);
  }

  #definirId(id) {
    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      throw new ErreurClientInvalide('id doit être un entier positif');
    }
    this.#id = id;
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
    this.#email = new Email(email);
  }

  changerTelephone(telephone) {
    this.#telephone = telephone === null ? null : new Telephone(telephone);
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
}
