export class ErreurDomaine extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ErreurReservationInvalide extends ErreurDomaine {}

export class ErreurTransitionInterdite extends ErreurDomaine {}

export class ErreurReservationExpiree extends ErreurDomaine {}
