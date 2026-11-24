export class ErreurStockInsuffisant extends Error {
  constructor(disponible, demandee) {
    super(`Stock insuffisant : ${disponible} disponible(s), ${demandee} demandé(s)`);
    this.name = 'ErreurStockInsuffisant';
    this.code = 'STOCK_INSUFFISANT';
  }
}

export class StockPharmacie {
  constructor({ pharmacieId, medicamentId, quantiteTotale, quantiteReservee = 0 }) {
    this.pharmacieId = pharmacieId;
    this.medicamentId = medicamentId;
    this.quantiteTotale = quantiteTotale;
    this.quantiteReservee = quantiteReservee;
  }

  get quantiteDisponible() {
    return this.quantiteTotale - this.quantiteReservee;
  }

  reserver(quantite) {
    if (!Number.isInteger(quantite) || quantite <= 0) {
      throw new Error('La quantité à réserver doit être un entier positif');
    }

    if (quantite > this.quantiteDisponible) {
      throw new ErreurStockInsuffisant(this.quantiteDisponible, quantite);
    }

    this.quantiteReservee += quantite;
  }

  liberer(quantite) {
    if (!Number.isInteger(quantite) || quantite <= 0 || quantite > this.quantiteReservee) {
      throw new Error('Quantité à libérer invalide');
    }

    this.quantiteReservee -= quantite;
  }

  retirer(quantite) {
    if (!Number.isInteger(quantite) || quantite <= 0 || quantite > this.quantiteReservee) {
      throw new Error('Quantité à retirer invalide');
    }

    this.quantiteReservee -= quantite;
    this.quantiteTotale -= quantite;
  }
}