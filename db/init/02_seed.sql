-- Données de démonstration (fictives)

INSERT INTO administrateurs (nom, prenom, email) VALUES
    ('Admin', 'Super', 'admin@lebonmedoc.test');

INSERT INTO pharmacies (nom, adresse, ville, code_postal, telephone, horaires_ouverture) VALUES
    ('Pharmacie de la Comédie', '1 place de la Comédie', 'Montpellier', '34000', '0400000001',
     '{"lun":["09:00","19:30"],"mar":["09:00","19:30"],"mer":["09:00","19:30"],"jeu":["09:00","19:30"],"ven":["09:00","19:30"],"sam":["09:00","13:00"]}'),
    ('Pharmacie Antigone', '10 avenue de l''Europe', 'Montpellier', '34000', '0400000002',
     '{"lun":["08:30","20:00"],"mar":["08:30","20:00"],"mer":["08:30","20:00"],"jeu":["08:30","20:00"],"ven":["08:30","20:00"]}');

INSERT INTO pharmaciens (pharmacie_id, nom, prenom, email) VALUES
    (1, 'Martin', 'Claire', 'claire.martin@pharma-comedie.test'),
    (2, 'Durand', 'Paul', 'paul.durand@pharma-antigone.test');

INSERT INTO clients (nom, prenom, numero_securite_sociale, email) VALUES
    ('Dupont', 'Jean', '185073400000012', 'jean.dupont@example.test');

-- Prix en centimes
INSERT INTO medicaments (nom, prix_defaut, est_remboursable, categorie, necessite_ordonnance) VALUES
    ('Doliprane 1000mg', 218, true, 'Antalgique', false),
    ('Amoxicilline 500mg', 312, true, 'Antibiotique', true),
    ('Spasfon 80mg', 450, false, 'Antispasmodique', false);

-- Remboursable : prix de vente = prix par défaut ; non remboursable (Spasfon) : prix libre
INSERT INTO stocks (pharmacie_id, medicament_id, prix, quantite) VALUES
    (1, 1, 218, 25), (1, 2, 312, 0), (1, 3, 495, 10),
    (2, 1, 218, 5),  (2, 2, 312, 12);
