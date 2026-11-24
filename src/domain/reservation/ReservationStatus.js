/**
 * États possibles d'une réservation et transitions autorisées.
 *
 *   EN_ATTENTE ──► ACCEPTEE ──► TERMINEE
 *        │              └─────► EXPIREE
 *        └────────► REFUSEE
 */
export const ReservationStatus = Object.freeze({
  EN_ATTENTE: 'EN_ATTENTE',
  ACCEPTEE: 'ACCEPTEE',
  REFUSEE: 'REFUSEE',
  TERMINEE: 'TERMINEE',
  EXPIREE: 'EXPIREE',
});

const TRANSITIONS = Object.freeze({
  [ReservationStatus.EN_ATTENTE]: [ReservationStatus.ACCEPTEE, ReservationStatus.REFUSEE],
  [ReservationStatus.ACCEPTEE]: [ReservationStatus.TERMINEE, ReservationStatus.EXPIREE],
  [ReservationStatus.REFUSEE]: [],
  [ReservationStatus.TERMINEE]: [],
  [ReservationStatus.EXPIREE]: [],
});

export function canTransition(from, to) {
  return TRANSITIONS[from]?.includes(to) ?? false;
}
