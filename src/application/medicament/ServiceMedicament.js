import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

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
    if (!donnees?.nom) {
      throw new ErreurValidation('Champs obligatoires manquants : nom');
    }
    if (donnees.necessiteOrdonnance !== undefined && typeof donnees.necessiteOrdonnance !== 'boolean') {
      throw new ErreurValidation('necessiteOrdonnance doit être un booléen');
    }
    return this.depotMedicament.creer(donnees);
  }
}
