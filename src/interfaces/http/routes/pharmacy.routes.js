import { Router } from 'express';
import { ValidationError } from '../../../application/errors.js';

export function pharmacyRouter(pharmacyService) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await pharmacyService.listPharmacies());
  });

  router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ValidationError('Identifiant invalide');
    res.json(await pharmacyService.getPharmacy(id));
  });

  router.post('/', async (req, res) => {
    const pharmacy = await pharmacyService.createPharmacy(req.body);
    res.status(201).json(pharmacy);
  });

  return router;
}
