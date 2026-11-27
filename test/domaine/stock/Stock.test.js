import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Stock } from '../../../src/modele/stock/Stock.js';
import { Medicament } from '../../../src/modele/medicament/Medicament.js';
import { ErreurStockInvalide } from '../../../src/modele/erreurs.js';

const donneesValides = { pharmacieId: 1, medicamentId: 2, prix: 450, quantite: 10 };
const medicamentLibre = new Medicament({ id: 2, nom: 'Doliprane', prixDefaut: 300, estRemboursable: false });
const medicamentRemboursable = new Medicament({ id: 2, nom: 'Amoxicilline', prixDefaut: 450, estRemboursable: true });

test('créer un stock conserve ses valeurs et n\'a pas encore de date de mise à jour', () => {
  const stock = Stock.creer(donneesValides, medicamentLibre);

  assert.equal(stock.pharmacieId, 1);
  assert.equal(stock.medicamentId, 2);
  assert.equal(stock.prix, 450);
  assert.equal(stock.quantite, 10);
  assert.equal(stock.misAJourLe, null);
});

test('la quantité vaut 0 par défaut', () => {
  const { quantite, ...sansQuantite } = donneesValides;

  assert.equal(Stock.creer(sansQuantite, medicamentLibre).quantite, 0);
});

test('reconstituer un stock depuis le dépôt conserve sa date de mise à jour', () => {
  const stock = new Stock({ ...donneesValides, misAJourLe: '2026-01-01T10:00:00Z' });

  assert.deepEqual(stock.misAJourLe, new Date('2026-01-01T10:00:00Z'));
});

test('impossible de créer un stock sans pharmacie ou médicament valide', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, pharmacieId: 0 }, medicamentLibre), ErreurStockInvalide);
  assert.throws(() => Stock.creer({ ...donneesValides, medicamentId: '2' }, medicamentLibre), ErreurStockInvalide);
});

test('impossible de créer un stock avec un prix négatif ou non entier', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, prix: -1 }, medicamentLibre), ErreurStockInvalide);
  assert.throws(() => Stock.creer({ ...donneesValides, prix: 4.5 }, medicamentLibre), ErreurStockInvalide);
});

test('impossible de créer un stock avec une quantité négative', () => {
  assert.throws(() => Stock.creer({ ...donneesValides, quantite: -1 }, medicamentLibre), ErreurStockInvalide);
});

test('impossible de créer un stock sans données', () => {
  assert.throws(() => Stock.creer({}, medicamentLibre), ErreurStockInvalide);
});

test('impossible de créer un stock sans médicament associé', () => {
  assert.throws(() => Stock.creer(donneesValides), ErreurStockInvalide);
});

test('un médicament non remboursable peut être vendu à un prix libre', () => {
  assert.equal(Stock.creer({ ...donneesValides, prix: 999 }, medicamentLibre).prix, 999);
});

test('un médicament remboursable doit être vendu à son prix par défaut', () => {
  assert.equal(Stock.creer(donneesValides, medicamentRemboursable).prix, 450);
  assert.throws(() => Stock.creer({ ...donneesValides, prix: 500 }, medicamentRemboursable), ErreurStockInvalide);
});

test('le médicament fourni doit correspondre au medicamentId du stock', () => {
  const autreMedicament = new Medicament({ id: 3, nom: 'Autre', prixDefaut: 450, estRemboursable: false });
  assert.throws(() => Stock.creer(donneesValides, autreMedicament), ErreurStockInvalide);
});

test('modifier le prix exige le médicament et applique la règle de remboursement', () => {
  const stock = Stock.creer(donneesValides, medicamentRemboursable);
  assert.throws(() => stock.modifier({ prix: 450 }), ErreurStockInvalide);
  assert.throws(() => stock.modifier({ prix: 500 }, medicamentRemboursable), ErreurStockInvalide);
  assert.equal(stock.modifier({ quantite: 3 }).quantite, 3);
});
