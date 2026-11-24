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
3. Lancer **Santé › Health check** : `database.status` doit valoir `up`.

La requête « Créer une pharmacie » enregistre automatiquement l'id créé dans `{{pharmacyId}}`.

## Endpoints

| Méthode | Route                  | Description                         |
| ------- | ---------------------- | ----------------------------------- |
| GET     | `/api/health`          | État de l'API et de la base         |
| GET     | `/api/pharmacies`      | Liste des pharmacies                |
| GET     | `/api/pharmacies/:id`  | Détail d'une pharmacie              |
| POST    | `/api/pharmacies`      | Création (`name`, `address`, `city`, `postalCode` obligatoires) |

## Architecture (couches DDD)

```
src/
├── domain/          # Cœur métier, sans dépendance technique (ex. états de réservation)
├── application/     # Cas d'usage / services applicatifs, erreurs métier
├── infrastructure/  # Accès Postgres (pool, repositories)
├── interfaces/http/ # Routes Express, middlewares
├── app.js           # Composition des dépendances
└── server.js        # Point d'entrée
db/init/             # Schéma SQL + données de démo (exécutés au 1er lancement du conteneur)
postman/             # Collection + environnement Postman
```

Le schéma ([`db/init/01_schema.sql`](db/init/01_schema.sql)) reprend le premier modèle du domaine :
pharmacies, pharmaciens, clients, médicaments, stocks, réservations (+ lignes) et administrateurs.
Les statuts de réservation (`EN_ATTENTE → ACCEPTEE | REFUSEE`, `ACCEPTEE → TERMINEE | EXPIREE`)
sont définis dans [`src/domain/reservation/ReservationStatus.js`](src/domain/reservation/ReservationStatus.js).
