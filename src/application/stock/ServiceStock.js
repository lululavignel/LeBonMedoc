import { ErreurIntrouvable } from '../erreurs.js';
import { Stock } from '../../modele/stock/Stock.js';

export class ServiceStock {
  constructor(depotStock, depotMedicament) {
    this.depotStock = depotStock;
    this.depotMedicament = depotMedicament;
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

  // Le médicament associé porte les règles de prix (remboursable = prix par défaut imposé)
  async #obtenirMedicament(medicamentId) {
    const medicament = await this.depotMedicament.getById(medicamentId);
    if (!medicament) {
      throw new ErreurIntrouvable(`Médicament ${medicamentId} introuvable`);
    }
    return medicament;
  }

  async creerStock(parametresJson) {
    const donnees = parametresJson ?? {};
    const medicament = await this.#obtenirMedicament(donnees.medicamentId);
    // Les invariants (identifiants, prix de vente, quantité) sont garantis par le modèle Stock -> modèle enrichi
    const stock = Stock.creer(donnees, medicament);
    return this.depotStock.creer(stock);
  }

  async modifierStock(identifiants, modifications) {
    const stock = await this.obtenirStock(identifiants);
    // Le médicament n'est nécessaire que si le prix de vente change (règles de "définirPrixVente" de Stock.js)
    const medicament = modifications?.prix !== undefined ? await this.#obtenirMedicament(stock.medicamentId) : null;
    const nouveauStock = stock.modifier(modifications, medicament)
    return this.depotStock.modifier(nouveauStock);
  }
}
