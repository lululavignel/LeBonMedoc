import test from 'node:test';
import assert from 'node:assert/strict';
import { StockPharmacie, ErreurStockInsuffisant } from './StockPharmacie.js';

test('réserve une quantité disponible', () => {
  const stock = new StockPharmacie({
    pharmacieId: 1,
    medicamentId: 2,
    quantiteTotale: 10,
  });

  stock.reserver(3);

  assert.equal(stock.quantiteDisponible, 7);
  assert.equal(stock.quantiteReservee, 3);
});

test('refuse une réservation supérieure au disponible', () => {
  const stock = new StockPharmacie({
    pharmacieId: 1,
    medicamentId: 2,
    quantiteTotale: 2,
  });

  assert.throws(() => stock.reserver(3), ErreurStockInsuffisant);
});