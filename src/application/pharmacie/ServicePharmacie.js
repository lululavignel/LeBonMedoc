import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServicePharmacie {
  constructor(depotPharmacie) {
    this.depotPharmacie = depotPharmacie;
  }

  listerPharmacies() {
    return this.depotPharmacie.trouverToutes();
  }

  async obtenirPharmacieParId(id) {
    const pharmacie = await this.depotPharmacie.trouverParId(id);
    if (!pharmacie) throw new ErreurIntrouvable(`Pharmacie ${id} introuvable`);
    return pharmacie;
  }

  creerPharmacie(donnees) {
    const manquants = ['nom', 'adresse', 'ville', 'codePostal'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    return this.depotPharmacie.creer(donnees);
  }
}
