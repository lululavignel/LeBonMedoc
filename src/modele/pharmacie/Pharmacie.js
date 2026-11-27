import { ErreurPharmacieInvalide } from '../erreurs.js';
import { Email } from '../commun/Email.js';
import { Telephone } from '../commun/Telephone.js';
import { CodePostal } from './CodePostal.js';

const LONGUEUR_MAX_NOM = 150;
const LONGUEUR_MAX_ADRESSE = 255;
const LONGUEUR_MAX_VILLE = 100;

export class Pharmacie {
  #id;
  #nom;
  #adresse;
  #ville;
  #codePostal;
  #telephone;
  #email;
  #horaires;
  #creeLe;

  static creer({ nom, adresse, ville, codePostal, telephone = null, email = null, horaires = {} }) {
    return new Pharmacie({ id: null, nom, adresse, ville, codePostal, telephone, email, horaires, creeLe: null });
  }

  constructor({
    id = null, nom, adresse, ville, codePostal, telephone = null, email = null, horaires = {}, creeLe = null,
  }) {
    this.#definirId(id);
    this.#nom = Pharmacie.#validerTexte('nom', nom, LONGUEUR_MAX_NOM);
    this.#adresse = Pharmacie.#validerTexte('adresse', adresse, LONGUEUR_MAX_ADRESSE);
    this.#ville = Pharmacie.#validerTexte('ville', ville, LONGUEUR_MAX_VILLE);
    this.#codePostal = new CodePostal(codePostal);
    this.#telephone = telephone === null ? null : new Telephone(telephone);
    this.#email = email === null ? null : new Email(email);
    this.#horaires = Pharmacie.#validerHoraires(horaires);
    this.#definirCreeLe(creeLe);
  }

  #definirId(id) {
    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      throw new ErreurPharmacieInvalide('id doit être un entier positif');
    }
    this.#id = id;
  }

  #definirCreeLe(creeLe) {
    if (creeLe !== null && Number.isNaN(new Date(creeLe).getTime())) {
      throw new ErreurPharmacieInvalide('creeLe doit être une date valide');
    }
    this.#creeLe = creeLe !== null ? new Date(creeLe) : null;
  }

  get id() { return this.#id; }
  get nom() { return this.#nom; }
  get adresse() { return this.#adresse; }
  get ville() { return this.#ville; }
  get codePostal() { return this.#codePostal; }
  get telephone() { return this.#telephone; }
  get email() { return this.#email; }
  get horaires() { return structuredClone(this.#horaires); }
  get creeLe() { return this.#creeLe ? new Date(this.#creeLe) : null; }

  changerEmail(email) {
    this.#email = email === null ? null : new Email(email);
  }

  changerTelephone(telephone) {
    this.#telephone = telephone === null ? null : new Telephone(telephone);
  }

  static #validerTexte(champ, valeur, longueurMax) {
    if (typeof valeur !== 'string' || valeur.trim() === '') {
      throw new ErreurPharmacieInvalide(`Le champ ${champ} de la pharmacie est obligatoire`);
    }
    if (valeur.trim().length > longueurMax) {
      throw new ErreurPharmacieInvalide(`Le champ ${champ} de la pharmacie ne doit pas dépasser ${longueurMax} caractères`);
    }
    return valeur.trim();
  }

  static #validerHoraires(horaires) {
    if (horaires === null || typeof horaires !== 'object' || Array.isArray(horaires)) {
      throw new ErreurPharmacieInvalide('Les horaires doivent être un objet, ex : { "lun": ["09:00", "19:00"] }');
    }
    return structuredClone(horaires);
  }
}
