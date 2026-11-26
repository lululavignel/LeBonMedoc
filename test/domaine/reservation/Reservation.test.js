import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Reservation } from '../../../src/domaine/reservation/Reservation.js';
import { StatutReservation } from '../../../src/domaine/reservation/StatutReservation.js';
import { ErreurReservationExpiree, ErreurTransitionInterdite } from '../../../src/domaine/erreurs.js';

const maintenant = new Date('2026-01-01T10:00:00Z');
const dansQuatreJours = new Date('2026-01-05T10:00:00Z');

function reservationEnAttente() {
  return new Reservation({ id: 1, statut: StatutReservation.EN_ATTENTE });
}

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
