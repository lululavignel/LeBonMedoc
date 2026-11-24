/**
 * États possibles d'une réservation et transitions autorisées.
 *
 *   EN_ATTENTE ──► ACCEPTEE ──► TERMINEE
 *        │              └─────► EXPIREE
 *        └────────► REFUSEE
 */
export const StatutReservation = Object.freeze({
  EN_ATTENTE: 'EN_ATTENTE',
  ACCEPTEE: 'ACCEPTEE',
  REFUSEE: 'REFUSEE',
  TERMINEE: 'TERMINEE',
  EXPIREE: 'EXPIREE',
});

const TRANSITIONS = Object.freeze({
  [StatutReservation.EN_ATTENTE]: [StatutReservation.ACCEPTEE, StatutReservation.REFUSEE],
  [StatutReservation.ACCEPTEE]: [StatutReservation.TERMINEE, StatutReservation.EXPIREE],
  [StatutReservation.REFUSEE]: [],
  [StatutReservation.TERMINEE]: [],
  [StatutReservation.EXPIREE]: [],
});

export function peutTransitionner(depuis, vers) {
  return TRANSITIONS[depuis]?.includes(vers) ?? false;
}
