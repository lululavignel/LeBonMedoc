import { ErreurCodePostalInvalide, ErreurPharmacieInvalide } from '../erreurs.js';

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMAT_CODE_POSTAL = /^\d{5}$/;

const LONGUEUR_MAX_NOM = 150;
const LONGUEUR_MAX_ADRESSE = 255;
const LONGUEUR_MAX_VILLE = 100;
const LONGUEUR_MAX_EMAIL = 255;
const LONGUEUR_MAX_TELEPHONE = 30;

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
    this.#codePostal = Pharmacie.#validerCodePostal(codePostal);
    this.#telephone = Pharmacie.#validerTelephone(telephone);
    this.#email = Pharmacie.#validerEmail(email);
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
    this.#email = Pharmacie.#validerEmail(email);
  }

  changerTelephone(telephone) {
    this.#telephone = Pharmacie.#validerTelephone(telephone);
  }

  toJSON() {
    return {
      id: this.#id,
      nom: this.#nom,
      adresse: this.#adresse,
      ville: this.#ville,
      codePostal: this.#codePostal,
      telephone: this.#telephone,
      email: this.#email,
      horaires: structuredClone(this.#horaires),
      creeLe: this.#creeLe ? this.#creeLe.toISOString() : null,
    };
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

  static #validerCodePostal(codePostal) {
    const code = typeof codePostal === 'string' ? codePostal.replace(/\s/g, '') : codePostal;
    if (typeof code !== 'string' || !FORMAT_CODE_POSTAL.test(code)) {
      throw new ErreurCodePostalInvalide('Le code postal doit comporter 5 chiffres');
    }
    return code;
  }

  static #validerEmail(email) {
    if (email === null) return null;
    if (typeof email !== 'string' || !FORMAT_EMAIL.test(email.trim())) {
      throw new ErreurPharmacieInvalide(`Email invalide : ${JSON.stringify(email)}`);
    }
    if (email.trim().length > LONGUEUR_MAX_EMAIL) {
      throw new ErreurPharmacieInvalide(`L'email ne doit pas dépasser ${LONGUEUR_MAX_EMAIL} caractères`);
    }
    return email.trim().toLowerCase();
  }

  static #validerTelephone(telephone) {
    if (telephone === null) return null;
    if (typeof telephone !== 'string' || telephone.trim() === '') {
      throw new ErreurPharmacieInvalide(`Téléphone invalide : ${JSON.stringify(telephone)}`);
    }
    if (telephone.trim().length > LONGUEUR_MAX_TELEPHONE) {
      throw new ErreurPharmacieInvalide(`Le téléphone ne doit pas dépasser ${LONGUEUR_MAX_TELEPHONE} caractères`);
    }
    return telephone.trim();
  }

  static #validerHoraires(horaires) {
    if (horaires === null || typeof horaires !== 'object' || Array.isArray(horaires)) {
      throw new ErreurPharmacieInvalide('Les horaires doivent être un objet, ex : { "lun": ["09:00", "19:00"] }');
    }
    return structuredClone(horaires);
  }
}
