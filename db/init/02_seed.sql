-- Données de démonstration (fictives)

INSERT INTO administrators (last_name, first_name, email) VALUES
    ('Admin', 'Super', 'admin@lebonmedoc.test');

INSERT INTO pharmacies (name, address, city, postal_code, phone, opening_hours) VALUES
    ('Pharmacie de la Comédie', '1 place de la Comédie', 'Montpellier', '34000', '0400000001',
     '{"mon":["09:00","19:30"],"tue":["09:00","19:30"],"wed":["09:00","19:30"],"thu":["09:00","19:30"],"fri":["09:00","19:30"],"sat":["09:00","13:00"]}'),
    ('Pharmacie Antigone', '10 avenue de l''Europe', 'Montpellier', '34000', '0400000002',
     '{"mon":["08:30","20:00"],"tue":["08:30","20:00"],"wed":["08:30","20:00"],"thu":["08:30","20:00"],"fri":["08:30","20:00"]}');

INSERT INTO pharmacists (pharmacy_id, last_name, first_name, email) VALUES
    (1, 'Martin', 'Claire', 'claire.martin@pharma-comedie.test'),
    (2, 'Durand', 'Paul', 'paul.durand@pharma-antigone.test');

INSERT INTO clients (last_name, first_name, social_security_number, email) VALUES
    ('Dupont', 'Jean', '185073400000012', 'jean.dupont@example.test');

INSERT INTO medications (name, category, requires_prescription) VALUES
    ('Doliprane 1000mg', 'Antalgique', false),
    ('Amoxicilline 500mg', 'Antibiotique', true),
    ('Spasfon 80mg', 'Antispasmodique', false);

INSERT INTO stocks (pharmacy_id, medication_id, quantity) VALUES
    (1, 1, 25), (1, 2, 0), (1, 3, 10),
    (2, 1, 5),  (2, 2, 12);
