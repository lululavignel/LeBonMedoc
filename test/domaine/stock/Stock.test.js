import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Stock } from '../../../src/modele/stock/Stock.js';
import { ErreurStockInvalide } from '../../../src/modele/erreurs.js';

const donneesValides = { pharmacieId: 1, medicamentId: 2, prix: 450, quantite: 10 };

test('créer un stock conserve ses valeurs et n\'a pas encore de date de mise à jour', () => {
  const stock = Stock.creer(donneesValides);

  assert.equal(stock.pharmacieId, 1);
  assert.equal(stock.medicamentId, 2);
  assert.equal(stock.prix, 450);
  assert.equal(stock.quantite, 10);
  assert.equal(stock.misAJourLe, null);
});

test('la quantité vaut 0 par défaut', () => {
  const { quantite, ...sansQuantite } = donneesValides;

  assert.equal(Stock.creer(sansQuantite).quantite, 0);
});

test('reconstituer un stock depuis le dépôt conserve sa date de mise à jour', () => {
  const stock = new Stock({ ...donneesValides, misAJourLe: '2026-01-01T10:00:00Z' });

  assert.deepEqual(stock.misAJourLe, new Date('2026-01-01T10:00:00Z'));
});

test('impossible de créer un stock sans pharmacie ou médicament valide', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, pharmacieId: 0 }), ErreurStockInvalide);
  assert.throws(() => Stock.creer({ ...donneesValides, medicamentId: '2' }), ErreurStockInvalide);
});

test('impossible de créer un stock avec un prix négatif ou non entier', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, prix: -1 }), ErreurStockInvalide);
  assert.throws(() => Stock.creer({ ...donneesValides, prix: 4.5 }), ErreurStockInvalide);
});

test('impossible de créer un stock avec une quantité négative', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, quantite: -1 }), ErreurStockInvalide);
});

test('impossible de créer un stock sans données', () => {
  assert.throws(() => Stock.creer({}), ErreurStockInvalide);
});
