/**
 * États possibles d'une réservation et transitions autorisées.
 *
 *   EN_ATTENTE ──► ACCEPTEE ──► TERMINEE
 *        │              └─────► EXPIREE
 *        │              │
 *        │              └─────► ANNULEE
 *        └────────► REFUSEE
 */
export const StatutReservation = Object.freeze({
  EN_ATTENTE: 'EN_ATTENTE',
  ACCEPTEE: 'ACCEPTEE',
  REFUSEE: 'REFUSEE',
  ANNULEE: 'ANNULEE',
  TERMINEE: 'TERMINEE',
  EXPIREE: 'EXPIREE',
});

const TRANSITIONS = Object.freeze({
  [StatutReservation.EN_ATTENTE]: [StatutReservation.ACCEPTEE, StatutReservation.REFUSEE],
  [StatutReservation.ACCEPTEE]: [StatutReservation.ANNULEE, StatutReservation.TERMINEE, StatutReservation.EXPIREE],
  [StatutReservation.REFUSEE]: [],
  [StatutReservation.ANNULEE]: [],
  [StatutReservation.TERMINEE]: [],
  [StatutReservation.EXPIREE]: [],
});

export function peutTransitionner(depuis, vers) {
  return TRANSITIONS[depuis]?.includes(vers) ?? false;
}
