import express from 'express';
import { healthRouter } from './interfaces/http/routes/health.routes.js';
import { pharmacyRouter } from './interfaces/http/routes/pharmacy.routes.js';
import { errorHandler, notFoundHandler } from './interfaces/http/middlewares/errorHandler.js';
import { PgPharmacyRepository } from './infrastructure/repositories/PgPharmacyRepository.js';
import { PharmacyService } from './application/pharmacy/PharmacyService.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  // Composition : infrastructure -> application -> interface HTTP
  const pharmacyService = new PharmacyService(new PgPharmacyRepository());

  app.get('/', (_req, res) => res.json({ name: 'LeBonMédoc API', version: '0.1.0' }));
  app.use('/api/health', healthRouter);
  app.use('/api/pharmacies', pharmacyRouter(pharmacyService));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
