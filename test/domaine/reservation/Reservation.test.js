import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Reservation } from '../../../src/modele/reservation/Reservation.js';
import { StatutReservation } from '../../../src/modele/reservation/StatutReservation.js';
import { ErreurReservationExpiree, ErreurReservationInvalide, ErreurTransitionInterdite } from '../../../src/modele/erreurs.js';

const maintenant = new Date('2026-01-01T10:00:00Z');
const dansQuatreJours = new Date('2026-01-05T10:00:00Z');

const donneesValides = { clientId: 1, pharmacieId: 2, lignes: [{ medicamentId: 3, quantite: 1 }] };

function reservationEnAttente() {
  return Reservation.creer(donneesValides);
}

test('créer une réservation la place en attente avec ses lignes', () => {
  const reservation = Reservation.creer(donneesValides);

  assert.equal(reservation.statut, StatutReservation.EN_ATTENTE);
  assert.equal(reservation.lignes.length, 1);
  assert.equal(reservation.lignes[0].medicamentId, 3);
});

test('impossible de créer une réservation sans médicament', () => {
  assert.throws(() => Reservation.creer({ ...donneesValides, lignes: [] }), ErreurReservationInvalide);
});

test('impossible de demander deux fois le même médicament', () => {
  const lignes = [{ medicamentId: 3, quantite: 1 }, { medicamentId: 3, quantite: 2 }];

  assert.throws(() => Reservation.creer({ ...donneesValides, lignes }), ErreurReservationInvalide);
});

test('impossible de créer une ligne avec une quantité nulle', () => {
  const lignes = [{ medicamentId: 3, quantite: 0 }];

  assert.throws(() => Reservation.creer({ ...donneesValides, lignes }), ErreurReservationInvalide);
});

function reservationAcceptee() {
  const reservation = reservationEnAttente();
  reservation.accepter(maintenant);
  return reservation;
}

test('accepter une réservation en attente fixe une date limite à 3 jours', () => {
  const reservation = reservationAcceptee();

  assert.equal(reservation.statut, StatutReservation.ACCEPTEE);
  assert.deepEqual(reservation.expireLe, new Date('2026-01-04T10:00:00Z'));
});

test('refuser une réservation en attente', () => {
  const reservation = reservationEnAttente();

  reservation.refuser();

  assert.equal(reservation.statut, StatutReservation.REFUSEE);
});

test('annuler une réservation acceptée', () => {
  const reservation = reservationAcceptee();

  reservation.annuler();

  assert.equal(reservation.statut, StatutReservation.ANNULEE);
});

test('terminer une réservation acceptée avant la date limite', () => {
  const reservation = reservationAcceptee();

  reservation.terminer(maintenant);

  assert.equal(reservation.statut, StatutReservation.TERMINEE);
});

test('impossible de terminer une réservation après la date limite', () => {
  const reservation = reservationAcceptee();

  assert.throws(() => reservation.terminer(dansQuatreJours), ErreurReservationExpiree);
});

test('expirer une réservation acceptée après la date limite', () => {
  const reservation = reservationAcceptee();

  reservation.expirer(dansQuatreJours);

  assert.equal(reservation.statut, StatutReservation.EXPIREE);
});

test('impossible d\'annuler une réservation encore en attente', () => {
  const reservation = reservationEnAttente();

  assert.throws(() => reservation.annuler(), ErreurTransitionInterdite);
});
