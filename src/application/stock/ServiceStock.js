import { ErreurIntrouvable } from '../erreurs.js';
import { Stock } from '../../modele/stock/Stock.js';

export class ServiceStock {
  constructor(depotStock) {
    this.depotStock = depotStock;
  }

  listerStocks() {
    return this.depotStock.getAll();
  }

  async obtenirStock(params) {
    const stock = await this.depotStock.getById(params.pharmacieId, params.medicamentId);
    if (!stock) {
      throw new ErreurIntrouvable(`Stock du médicament ${params.medicamentId} dans la pharmacie ${params.pharmacieId} introuvable`);
    }
    return stock;
  }

  creerStock(parametresJson) {
    // Les invariants (identifiants, prix, quantité) sont garantis par le modèle Stock -> modèle enrichi
    const stock = Stock.creer(parametresJson ?? {});
    return this.depotStock.creer(stock);
  }

  modifierStock(identifiants, modifications){
    const stock = await this.obtenirStock(identifiants);
    const { prix, quantite } = modifications
    stock = stock.modifier(modifications)
    this.depotStock.modifier(stock)
  }
}
