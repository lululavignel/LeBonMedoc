import { ErreurIntrouvable } from '../erreurs.js';
import { Medicament } from '../../modele/medicament/Medicament.js';

export class ServiceMedicament {
  constructor(depotMedicament) {
    this.depotMedicament = depotMedicament;
  }

  listerMedicaments() {
    return this.depotMedicament.getAll();
  }

  async obtenirMedicamentParId(id) {
    const medicament = await this.depotMedicament.getById(id);
    if (!medicament) throw new ErreurIntrouvable(`Médicament ${id} introuvable`);
    return medicament;
  }

  creerMedicament(donnees) {
    const medicament = new Medicament(donnees ?? {});
    return this.depotMedicament.creer(medicament);
  }
}
