import { ErreurIntrouvable } from '../erreurs.js';
import { Pharmacie } from '../../modele/pharmacie/Pharmacie.js';

export class ServicePharmacie {
  constructor(depotPharmacie) {
    this.depotPharmacie = depotPharmacie;
  }

  listerPharmacies() {
    return this.depotPharmacie.getAll();
  }

  async obtenirPharmacieParId(id) {
    const pharmacie = await this.depotPharmacie.getById(id);
    if (!pharmacie) throw new ErreurIntrouvable(`Pharmacie ${id} introuvable`);
    return pharmacie;
  }

  creerPharmacie(donnees) {
    const pharmacie = Pharmacie.creer(donnees ?? {});
    return this.depotPharmacie.creer(pharmacie);
  }
}
