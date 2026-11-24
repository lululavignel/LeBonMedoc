import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServiceAdministrateur {
  constructor(depotAdministrateur) {
    this.depotAdministrateur = depotAdministrateur;
  }

  listerAdministrateurs() {
    return this.depotAdministrateur.getAll();
  }

  async obtenirAdministrateurParId(id) {
    const administrateur = await this.depotAdministrateur.getById(id);
    if (!administrateur) throw new ErreurIntrouvable(`Administrateur ${id} introuvable`);
    return administrateur;
  }

  creerAdministrateur(donnees) {
    const manquants = ['nom', 'prenom', 'email'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    return this.depotAdministrateur.creer(donnees);
  }
}
