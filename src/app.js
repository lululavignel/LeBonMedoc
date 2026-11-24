import express from 'express';
import { routeurSante } from './interfaces/http/routes/sante.routes.js';
import { routeurPharmacies } from './interfaces/http/routes/pharmacies.routes.js';
import { gestionnaireErreurs, gestionnaireRouteIntrouvable } from './interfaces/http/middlewares/gestionErreurs.js';
import { DepotPharmaciePg } from './infrastructure/depots/DepotPharmaciePg.js';
import { ServicePharmacie } from './application/pharmacie/ServicePharmacie.js';

export function creerApplication() {
  const application = express();
  application.use(express.json());

  // Composition : infrastructure -> application -> interface HTTP
  const servicePharmacie = new ServicePharmacie(new DepotPharmaciePg());

  application.get('/', (_requete, reponse) => reponse.json({ nom: 'LeBonMédoc API', version: '0.1.0' }));
  application.use('/api/health', routeurSante);
  application.use('/api/pharmacies', routeurPharmacies(servicePharmacie));

  application.use(gestionnaireRouteIntrouvable);
  application.use(gestionnaireErreurs);
  return application;
}
