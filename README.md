# LeBonMedoc
Atelier de Domain-Driven Design dans le cadre de cours chez Ynov Campus Montpellier.

## Notes pour la relecture par pairs

Pour la relecture de code plus facile par entité (par exemple Stock), ouvrez les 4 fichiers suivants:
- Dans interfaces/http/routes → stocks.routes.js
- Dans application → stock/ServiceStock.js
- Dans modele → stock/Stock.js
- Dans infrastructure/depots → DepotStockPg.js
Cela permet de retracer le parcours complet d'une requete API, en passant par le service, le modèle objet, et la persistance en base de données.

Les entités les plus complètes à relire sont :
- Réservation 
- Stock
- Medicament
- Pharmacie
- Client

La suite de ce document est une documentation classque auto-générée.

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
| `npm test`         | Tests unitaires du modèle (`node --test`, sans base)     |

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
| POST    | `/api/medicaments`         | Création (`nom`, `prixDefaut` (centimes), `estRemboursable` obligatoires, `categorie`, `necessiteOrdonnance`) |
| GET     | `/api/stocks`              | Liste des stocks                |
| GET     | `/api/stocks/:pharmacieId/:medicamentId` | Stock d'un médicament dans une pharmacie |
| POST    | `/api/stocks`              | Création (`pharmacieId`, `medicamentId`, `prix` (centimes) obligatoires, `quantite`) |
| PATCH   | `/api/stocks/:pharmacieId/:medicamentId` | Modification du `prix` et/ou de la `quantite` |
| GET     | `/api/reservations`        | Liste des réservations          |
| GET     | `/api/reservations/:id`    | Détail d'une réservation, avec ses lignes |
| GET     | `/api/reservations/:id/lignes` | Lignes (médicaments) d'une réservation |
| POST    | `/api/reservations`        | Création (`clientId`, `pharmacieId`, `lignes: [{ medicamentId, quantite }]` ≥ 1 ligne, `retraitLe`) |
| POST    | `/api/reservations/:id/acceptation` | Accepte une réservation en attente (date limite de retrait fixée à J+3, `409` si transition interdite) |
| POST    | `/api/reservations/:id/refus` | Refuse une réservation en attente |
| POST    | `/api/reservations/:id/annulation` | Annule une réservation acceptée |
| POST    | `/api/reservations/:id/retrait` | Le pharmacien délivre une réservation acceptée et non échue (passe à `TERMINEE`) |

Les prix sont exprimés en **centimes** (ex. `218` = 2,18 €).

### Règles métier

- **Médicament remboursable** : son prix de vente en pharmacie est imposé et doit être égal à son `prixDefaut`.
  Un médicament non remboursable peut être vendu au prix librement fixé par la pharmacie.
- **Stock** : prix et quantité sont des entiers positifs ou nuls ; un stock est immuable (une modification produit un nouveau stock validé).
- **Client** : le numéro de sécurité sociale comporte 15 chiffres (espaces ignorés), l'email est obligatoire.
- **Pharmacie** : le code postal comporte 5 chiffres (espaces ignorés) ; email et téléphone sont facultatifs.
- **Email** : format `x@y.z`, 255 caractères max, normalisé en minuscules. **Téléphone** : 30 caractères max.
- **Réservation** : au moins une ligne ; date limite de retrait fixée à J+3 lors de l'acceptation.

### Codes d'erreur

Une transition d'état interdite (ex. accepter une réservation déjà refusée) ou un retrait après la date limite renvoie `409`.
Les autres règles métier violées renvoient `400`.
Les violations de contraintes en base renvoient `409` (doublon, ex. email déjà utilisé) ou `400` (référence inexistante).

## Architecture (couches DDD)

```
src/
├── modele/          # Cœur métier riche, sans dépendance technique : entités auto-validées
│                    #   (Client, Pharmacie, Medicament, Stock, Reservation, LigneReservation),
│                    #   objets valeur (Email, Telephone, NumeroSecuriteSociale, CodePostal) et erreurs du domaine
│   └── commun/      # Objets valeur partagés entre agrégats (Email, Telephone)
├── application/     # Cas d'usage / services applicatifs, erreurs applicatives
├── infrastructure/  # Accès Postgres (connexions, dépôts)
├── interfaces/http/ # Routes Express, middlewares
├── config/          # Lecture des variables d'environnement
├── app.js           # Composition des dépendances
└── serveur.js       # Point d'entrée
db/init/             # Schéma SQL + données de démo (exécutés au 1er lancement du conteneur)
postman/             # Collection + environnement Postman
test/                # Tests unitaires du modèle (node:test)
```

Les entités du modèle encapsulent leur état (champs privés `#`, accès en lecture seule par accesseurs)
et valident leurs invariants dès la construction : un objet invalide ne peut pas exister.
Les nouvelles entités sont créées via une fabrique `creer()` (id nul jusqu'à la persistance), le constructeur servant à la reconstitution depuis la base.
Les données à format contraint sont des **objets valeur** immuables ([`Email`](src/modele/commun/Email.js),
[`Telephone`](src/modele/commun/Telephone.js), [`NumeroSecuriteSociale`](src/modele/client/NumeroSecuriteSociale.js),
[`CodePostal`](src/modele/pharmacie/CodePostal.js)) : ils se valident eux-mêmes, se comparent par valeur (`egale()`)
et exposent leur contenu via `.valeur`. La conversion entités → JSON est faite dans les routes (`versJson`), le modèle ne connaît pas le format HTTP.
Une erreur du domaine (`ErreurDomaine`) est traduite en réponse HTTP par
[`gestionErreurs.js`](src/interfaces/http/middlewares/gestionErreurs.js).

Le schéma ([`db/init/01_schema.sql`](db/init/01_schema.sql)) reprend le premier modèle du domaine :
pharmacies, pharmaciens, clients, médicaments, stocks, réservations (+ lignes) et administrateurs.
Les statuts de réservation (`EN_ATTENTE → ACCEPTEE | REFUSEE`, `ACCEPTEE → ANNULEE | TERMINEE | EXPIREE`)
sont définis dans [`src/modele/reservation/StatutReservation.js`](src/modele/reservation/StatutReservation.js).


