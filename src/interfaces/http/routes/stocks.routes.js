import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurStocks(serviceStock) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await serviceStock.listerStocks());
  });

  routeur.get('/:pharmacieId/:medicamentId', async (requete, reponse) => {
    const pharmacieId = Number(requete.params.pharmacieId);
    const medicamentId = Number(requete.params.medicamentId);
    if (![pharmacieId, medicamentId].every((id) => Number.isInteger(id) && id > 0)) {
      throw new ErreurValidation('Identifiant invalide');
    }
    reponse.json(await serviceStock.obtenirStock(pharmacieId, medicamentId));
  });

  routeur.post('/', async (requete, reponse) => {
    const stock = await serviceStock.creerStock(requete.body);
    reponse.status(201).json(stock);
  });

  return routeur;
}
