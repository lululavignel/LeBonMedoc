export class ErreurApplication extends Error {
  constructor(message, statut = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statut = statut;
  }
}

export class ErreurValidation extends ErreurApplication {
  constructor(message) {
    super(message, 400);
  }
}

export class ErreurIntrouvable extends ErreurApplication {
  constructor(message) {
    super(message, 404);
  }
}
