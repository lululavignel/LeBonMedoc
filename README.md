# LeBonMedoc
Atelier de Domain-Driven Design dans le cadre de cours chez Ynov Campus Montpellier.

## Stack

- **Backend** : Node.js (≥ 22) + Express 5, modules ES
- **Base de données** : PostgreSQL 17 (Docker Compose)
- **Tests manuels d'API** : collection Postman dans [`postman/`](postman/)

## Démarrage

Prérequis : Node.js et Docker Desktop lancé.

```powershell
npm install
copy .env.example .env   # si .env n'existe pas
npm run db:up            # lance Postgres, crée le schéma et les données de démo au 1er démarrage
npm run dev              # API sur http://localhost:3000 (rechargement auto)
```

| Script             | Rôle                                                     |
| ------------------ | -------------------------------------------------------- |
| `npm run dev`      | API avec rechargement automatique                        |
| `npm start`        | API sans rechargement                                    |
| `npm run db:up`    | Démarre le conteneur Postgres                            |
| `npm run db:down`  | Arrête le conteneur (données conservées)                 |
| `npm run db:reset` | Supprime le volume et rejoue `db/init/*.sql` (⚠ efface tout) |
| `npm run db:logs`  | Logs Postgres                                            |

Connexion directe à la base : `docker exec -it lebonmedoc-db psql -U lebonmedoc`
(ou un client graphique sur `localhost:5432`, utilisateur/mot de passe/base `lebonmedoc`).

## Postman

1. Postman → **Import** → sélectionner les deux fichiers de [`postman/`](postman/).
2. Choisir l'environnement **LeBonMédoc - Local** en haut à droite.
3. Lancer **Santé › Vérification de santé** : `baseDeDonnees.statut` doit valoir `disponible`.

La requête « Créer une pharmacie » enregistre automatiquement l'id créé dans `{{pharmacieId}}`.

## Endpoints

| Méthode | Route                  | Description                         |
| ------- | ---------------------- | ----------------------------------- |
| GET     | `/api/health`          | État de l'API et de la base         |
| GET     | `/api/pharmacies`      | Liste des pharmacies                |
| GET     | `/api/pharmacies/:id`  | Détail d'une pharmacie              |
| POST    | `/api/pharmacies`      | Création (`nom`, `adresse`, `ville`, `codePostal` obligatoires) |
| GET     | `/api/administrateurs`     | Liste des administrateurs       |
| GET     | `/api/administrateurs/:id` | Détail d'un administrateur      |
| POST    | `/api/administrateurs`     | Création (`nom`, `prenom`, `email` obligatoires) |
| GET     | `/api/pharmaciens`         | Liste des pharmaciens           |
| GET     | `/api/pharmaciens/:id`     | Détail d'un pharmacien          |
| POST    | `/api/pharmaciens`         | Création (`pharmacieId`, `nom`, `prenom`, `email` obligatoires) |
| GET     | `/api/clients`             | Liste des clients               |
| GET     | `/api/clients/:id`         | Détail d'un client              |
| POST    | `/api/clients`             | Création (`nom`, `prenom`, `numeroSecuriteSociale` (15 chiffres), `email` obligatoires) |
| GET     | `/api/medicaments`         | Liste des médicaments           |
| GET     | `/api/medicaments/:id`     | Détail d'un médicament          |
| POST    | `/api/medicaments`         | Création (`nom` obligatoire, `categorie`, `necessiteOrdonnance`) |
| GET     | `/api/stocks`              | Liste des stocks                |
| GET     | `/api/stocks/:pharmacieId/:medicamentId` | Stock d'un médicament dans une pharmacie |
| POST    | `/api/stocks`              | Création (`pharmacieId`, `medicamentId` obligatoires, `quantite`) |
| GET     | `/api/reservations`        | Liste des réservations          |
| GET     | `/api/reservations/:id`    | Détail d'une réservation, avec ses lignes |
| GET     | `/api/reservations/:id/lignes` | Lignes (médicaments) d'une réservation |
| POST    | `/api/reservations`        | Création (`clientId`, `pharmacieId`, `lignes: [{ medicamentId, quantite }]` ≥ 1 ligne, `retraitLe`) |
| POST    | `/api/reservations/:id/acceptation` | Accepte une réservation en attente (date limite de retrait fixée à J+3, `409` si transition interdite) |
| POST    | `/api/reservations/:id/refus` | Refuse une réservation en attente |
| POST    | `/api/reservations/:id/annulation` | Annule une réservation acceptée |
| POST    | `/api/reservations/:id/retrait` | Le pharmacien délivre une réservation acceptée et non échue (passe à `TERMINEE`) |

Une transition d'état interdite (ex. accepter une réservation déjà refusée) ou un retrait après la date limite renvoie `409`.
Les autres règles métier violées renvoient `400`.
Les violations de contraintes en base renvoient `409` (doublon, ex. email déjà utilisé) ou `400` (référence inexistante).

## Architecture (couches DDD)

```
src/
├── domaine/         # Cœur métier, sans dépendance technique (ex. états de réservation)
├── application/     # Cas d'usage / services applicatifs, erreurs métier
├── infrastructure/  # Accès Postgres (connexions, dépôts)
├── interfaces/http/ # Routes Express, middlewares
├── app.js           # Composition des dépendances
└── serveur.js       # Point d'entrée
db/init/             # Schéma SQL + données de démo (exécutés au 1er lancement du conteneur)
postman/             # Collection + environnement Postman
```

Le schéma ([`db/init/01_schema.sql`](db/init/01_schema.sql)) reprend le premier modèle du domaine :
pharmacies, pharmaciens, clients, médicaments, stocks, réservations (+ lignes) et administrateurs.
Les statuts de réservation (`EN_ATTENTE → ACCEPTEE | REFUSEE`, `ACCEPTEE → TERMINEE | EXPIREE`)
sont définis dans [`src/domaine/reservation/StatutReservation.js`](src/domaine/reservation/StatutReservation.js).
