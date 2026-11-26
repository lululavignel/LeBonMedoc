import { ErreurIntrouvable } from '../erreurs.js';
import { Stock } from '../../modele/stock/Stock.js';

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
    // Les invariants (identifiants, prix, quantité) sont garantis par le modèle Stock
    const stock = Stock.creer(donnees ?? {});
    return this.depotStock.creer(stock);
  }
}
