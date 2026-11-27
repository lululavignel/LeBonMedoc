import express from 'express';
import { routeurSante } from './interfaces/http/routes/sante.routes.js';
import { routeurPharmacies } from './interfaces/http/routes/pharmacies.routes.js';
import { routeurAdministrateurs } from './interfaces/http/routes/administrateurs.routes.js';
import { routeurPharmaciens } from './interfaces/http/routes/pharmaciens.routes.js';
import { routeurClients } from './interfaces/http/routes/clients.routes.js';
import { routeurMedicaments } from './interfaces/http/routes/medicaments.routes.js';
import { routeurStocks } from './interfaces/http/routes/stocks.routes.js';
import { routeurReservations } from './interfaces/http/routes/reservations.routes.js';
import { gestionnaireErreurs, gestionnaireRouteIntrouvable } from './interfaces/http/middlewares/gestionErreurs.js';
import { DepotPharmaciePg } from './infrastructure/depots/DepotPharmaciePg.js';
import { DepotAdministrateurPg } from './infrastructure/depots/DepotAdministrateurPg.js';
import { DepotPharmacienPg } from './infrastructure/depots/DepotPharmacienPg.js';
import { DepotClientPg } from './infrastructure/depots/DepotClientPg.js';
import { DepotMedicamentPg } from './infrastructure/depots/DepotMedicamentPg.js';
import { DepotStockPg } from './infrastructure/depots/DepotStockPg.js';
import { DepotReservationPg } from './infrastructure/depots/DepotReservationPg.js';
import { ServicePharmacie } from './application/pharmacie/ServicePharmacie.js';
import { ServiceAdministrateur } from './application/administrateur/ServiceAdministrateur.js';
import { ServicePharmacien } from './application/pharmacien/ServicePharmacien.js';
import { ServiceClient } from './application/client/ServiceClient.js';
import { ServiceMedicament } from './application/medicament/ServiceMedicament.js';
import { ServiceStock } from './application/stock/ServiceStock.js';
import { ServiceReservation } from './application/reservation/ServiceReservation.js';

export function creerApplication() {
  const application = express();
  application.use(express.json());

  // Composition : infrastructure -> application -> interface HTTP
  const servicePharmacie = new ServicePharmacie(new DepotPharmaciePg());
  const serviceAdministrateur = new ServiceAdministrateur(new DepotAdministrateurPg());
  const servicePharmacien = new ServicePharmacien(new DepotPharmacienPg());
  const serviceClient = new ServiceClient(new DepotClientPg());
  const serviceMedicament = new ServiceMedicament(new DepotMedicamentPg());
  const serviceStock = new ServiceStock(new DepotStockPg(), new DepotMedicamentPg());
  const serviceReservation = new ServiceReservation(new DepotReservationPg());

  application.get('/', (_requete, reponse) => reponse.json({ nom: 'LeBonMédoc API', version: '0.1.0' }));
  application.use('/api/health', routeurSante);
  application.use('/api/pharmacies', routeurPharmacies(servicePharmacie));
  application.use('/api/administrateurs', routeurAdministrateurs(serviceAdministrateur));
  application.use('/api/pharmaciens', routeurPharmaciens(servicePharmacien));
  application.use('/api/clients', routeurClients(serviceClient));
  application.use('/api/medicaments', routeurMedicaments(serviceMedicament));
  application.use('/api/stocks', routeurStocks(serviceStock));
  application.use('/api/reservations', routeurReservations(serviceReservation));

  application.use(gestionnaireRouteIntrouvable);
  application.use(gestionnaireErreurs);
  return application;
}
