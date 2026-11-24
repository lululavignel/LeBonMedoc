import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServicePharmacien {
  constructor(depotPharmacien) {
    this.depotPharmacien = depotPharmacien;
  }

  listerPharmaciens() {
    return this.depotPharmacien.getAll();
  }

  async obtenirPharmacienParId(id) {
    const pharmacien = await this.depotPharmacien.getById(id);
    if (!pharmacien) throw new ErreurIntrouvable(`Pharmacien ${id} introuvable`);
    return pharmacien;
  }

  creerPharmacien(donnees) {
    const manquants = ['pharmacieId', 'nom', 'prenom', 'email'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    if (!Number.isInteger(donnees.pharmacieId) || donnees.pharmacieId <= 0) {
      throw new ErreurValidation('pharmacieId doit être un entier positif');
    }
    return this.depotPharmacien.creer(donnees);
  }
}
