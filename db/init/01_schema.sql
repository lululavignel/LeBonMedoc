-- Schéma initial LeBonMédoc, dérivé du premier modèle du domaine

CREATE TYPE statut_reservation AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'TERMINEE', 'EXPIREE');

CREATE TABLE administrateurs (
    id          SERIAL PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    prenom      VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    telephone   VARCHAR(30),
    cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacies (
    id                  SERIAL PRIMARY KEY,
    nom                 VARCHAR(150) NOT NULL,
    adresse             VARCHAR(255) NOT NULL,
    ville               VARCHAR(100) NOT NULL,
    code_postal         VARCHAR(10)  NOT NULL,
    telephone           VARCHAR(30),
    email               VARCHAR(255),
    horaires_ouverture  JSONB NOT NULL DEFAULT '{}'::jsonb, -- ex: {"lun": ["09:00","19:00"], ...}
    est_partenaire      BOOLEAN NOT NULL DEFAULT true,
    cree_le             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmaciens (
    id            SERIAL PRIMARY KEY,
    pharmacie_id  INTEGER NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    telephone     VARCHAR(30),
    cree_le       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE clients (
    id                       SERIAL PRIMARY KEY,
    nom                      VARCHAR(100) NOT NULL,
    prenom                   VARCHAR(100) NOT NULL,
    numero_securite_sociale  CHAR(15) NOT NULL UNIQUE,
    email                    VARCHAR(255) NOT NULL UNIQUE,
    telephone                VARCHAR(30),
    cree_le                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE medicaments (
    id                    SERIAL PRIMARY KEY,
    nom                   VARCHAR(150) NOT NULL,
    categorie             VARCHAR(100),
    necessite_ordonnance  BOOLEAN NOT NULL DEFAULT false,
    cree_le               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock : quantité disponible d'un médicament dans une pharmacie
CREATE TABLE stocks (
    pharmacie_id    INTEGER NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicament_id   INTEGER NOT NULL REFERENCES medicaments(id) ON DELETE CASCADE,
    quantite        INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
    mis_a_jour_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (pharmacie_id, medicament_id)
);

CREATE TABLE reservations (
    id             SERIAL PRIMARY KEY,
    client_id      INTEGER NOT NULL REFERENCES clients(id),
    pharmacie_id   INTEGER NOT NULL REFERENCES pharmacies(id),
    statut         statut_reservation NOT NULL DEFAULT 'EN_ATTENTE',
    retrait_le     TIMESTAMPTZ,
    cree_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
    mis_a_jour_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lignes de réservation : une réservation contient au moins 1 médicament
-- (règle garantie par le domaine)
CREATE TABLE lignes_reservation (
    reservation_id  INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    medicament_id   INTEGER NOT NULL REFERENCES medicaments(id),
    quantite        INTEGER NOT NULL CHECK (quantite > 0),
    PRIMARY KEY (reservation_id, medicament_id)
);

CREATE INDEX idx_reservations_pharmacie_statut ON reservations (pharmacie_id, statut);
CREATE INDEX idx_reservations_client ON reservations (client_id);
CREATE INDEX idx_medicaments_nom ON medicaments (lower(nom));
