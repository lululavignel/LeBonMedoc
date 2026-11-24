-- Schéma initial LeBonMédoc, dérivé du premier modèle du domaine

CREATE TYPE reservation_status AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'TERMINEE', 'EXPIREE');

CREATE TABLE administrators (
    id          SERIAL PRIMARY KEY,
    last_name   VARCHAR(100) NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(30),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacies (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    address        VARCHAR(255) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    postal_code    VARCHAR(10)  NOT NULL,
    phone          VARCHAR(30),
    email          VARCHAR(255),
    opening_hours  JSONB NOT NULL DEFAULT '{}'::jsonb, -- ex: {"mon": ["09:00","19:00"], ...}
    is_partner     BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacists (
    id           SERIAL PRIMARY KEY,
    pharmacy_id  INTEGER NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    last_name    VARCHAR(100) NOT NULL,
    first_name   VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    phone        VARCHAR(30),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE clients (
    id                      SERIAL PRIMARY KEY,
    last_name               VARCHAR(100) NOT NULL,
    first_name              VARCHAR(100) NOT NULL,
    social_security_number  CHAR(15) NOT NULL UNIQUE,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    phone                   VARCHAR(30),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE medications (
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(150) NOT NULL,
    category               VARCHAR(100),
    requires_prescription  BOOLEAN NOT NULL DEFAULT false,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock : quantité disponible d'un médicament dans une pharmacie
CREATE TABLE stocks (
    pharmacy_id    INTEGER NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medication_id  INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    quantity       INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (pharmacy_id, medication_id)
);

CREATE TABLE reservations (
    id           SERIAL PRIMARY KEY,
    client_id    INTEGER NOT NULL REFERENCES clients(id),
    pharmacy_id  INTEGER NOT NULL REFERENCES pharmacies(id),
    status       reservation_status NOT NULL DEFAULT 'EN_ATTENTE',
    pickup_at    TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lignes de réservation : une réservation contient au moins 1 médicament
-- (règle garantie par le domaine)
CREATE TABLE reservation_lines (
    reservation_id  INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    medication_id   INTEGER NOT NULL REFERENCES medications(id),
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (reservation_id, medication_id)
);

CREATE INDEX idx_reservations_pharmacy_status ON reservations (pharmacy_id, status);
CREATE INDEX idx_reservations_client ON reservations (client_id);
CREATE INDEX idx_medications_name ON medications (lower(name));
