import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServiceStock {
  constructor(depotStock) {
    this.depotStock = depotStock;
  }

  listerStocks() {
    return this.depotStock.getAll();
  }

  async obtenirStock(pharmacieId, medicamentId) {
    const stock = await this.depotStock.getById(pharmacieId, medicamentId);
    if (!stock) {
      throw new ErreurIntrouvable(`Stock du médicament ${medicamentId} dans la pharmacie ${pharmacieId} introuvable`);
    }
    return stock;
  }

  creerStock(donnees) {
    const manquants = ['pharmacieId', 'medicamentId'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    for (const champ of ['pharmacieId', 'medicamentId']) {
      if (!Number.isInteger(donnees[champ]) || donnees[champ] <= 0) {
        throw new ErreurValidation(`${champ} doit être un entier positif`);
      }
    }
    if (donnees.quantite !== undefined && (!Number.isInteger(donnees.quantite) || donnees.quantite < 0)) {
      throw new ErreurValidation('quantite doit être un entier positif ou nul');
    }
    return this.depotStock.creer(donnees);
  }
}
