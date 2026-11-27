export class ErreurDomaine extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ErreurReservationInvalide extends ErreurDomaine {}

export class ErreurTransitionInterdite extends ErreurDomaine {}

export class ErreurReservationExpiree extends ErreurDomaine {}

export class ErreurMedicamentInvalide extends ErreurDomaine {}

export class ErreurStockInvalide extends ErreurDomaine {}

export class ErreurNumeroSecuriteSocialeInvalide extends ErreurDomaine {}

export class ErreurClientInvalide extends ErreurDomaine {}

export class ErreurPharmacieInvalide extends ErreurDomaine {}

export class ErreurCodePostalInvalide extends ErreurDomaine {}