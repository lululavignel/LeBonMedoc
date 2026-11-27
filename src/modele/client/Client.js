import { ErreurClientInvalide, ErreurNumeroSecuriteSocialeInvalide } from '../erreurs.js';

const FORMAT_NUMERO_SECURITE_SOCIALE = /^\d{15}$/;
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Client {
  #id;
  #nom;
  #prenom;
  #numeroSecuriteSociale;
  #email;
  #telephone;

  constructor({ id = null, nom, prenom, numeroSecuriteSociale, email, telephone = null }) {
    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      throw new ErreurClientInvalide('id doit être un entier positif');
    }
    for (const [champ, valeur] of [['nom', nom], ['prenom', prenom]]) {
      if (typeof valeur !== 'string' || valeur.trim() === '') {
        throw new ErreurClientInvalide(`Le ${champ} du client est obligatoire`);
      }
    }
    const numero = typeof numeroSecuriteSociale === 'string'
      ? numeroSecuriteSociale.replace(/\s/g, '')
      : numeroSecuriteSociale;
    if (typeof numero !== 'string' || !FORMAT_NUMERO_SECURITE_SOCIALE.test(numero)) {
      throw new ErreurNumeroSecuriteSocialeInvalide(
        'Le numéro de sécurité sociale doit comporter 15 chiffres',
      );
    }
    this.#id = id;
    this.#nom = nom.trim();
    this.#prenom = prenom.trim();
    this.#numeroSecuriteSociale = numero;
    this.#email = Client.#validerEmail(email);
    this.#telephone = Client.#validerTelephone(telephone);
  }

  get id() { return this.#id; }
  get nom() { return this.#nom; }
  get prenom() { return this.#prenom; }
  get numeroSecuriteSociale() { return this.#numeroSecuriteSociale; }
  get email() { return this.#email; }
  get telephone() { return this.#telephone; }

  changerEmail(email) {
    this.#email = Client.#validerEmail(email);
  }

  changerTelephone(telephone) {
    this.#telephone = Client.#validerTelephone(telephone);
  }

  static #validerEmail(email) {
    if (typeof email !== 'string' || !FORMAT_EMAIL.test(email.trim())) {
      throw new ErreurClientInvalide(`Email invalide : ${JSON.stringify(email)}`);
    }
    return email.trim().toLowerCase();
  }

  static #validerTelephone(telephone) {
    if (telephone === null) return null;
    if (typeof telephone !== 'string' || telephone.trim() === '') {
      throw new ErreurClientInvalide(`Téléphone invalide : ${JSON.stringify(telephone)}`);
    }
    return telephone.trim();
  }
}
