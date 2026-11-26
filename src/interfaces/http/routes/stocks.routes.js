import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurStocks(serviceStock) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const stocks = await serviceStock.listerStocks();
    reponse.json(stocks);
  });

  routeur.get('/:pharmacieId/:medicamentId', async (requete, reponse) => {
    const stock = await serviceStock.obtenirStock(requete.params)
    reponse.json(stock);
  });

  routeur.post('/', async (requete, reponse) => {
    const stock = await serviceStock.creerStock(requete.body);
    reponse.status(201).json(stock);
  });

  routeur.patch('/:pharmacieId/:medicamentId', async (requete, reponse) => {
    const stock = await serviceStock.modifierStock(requete.params, requete.body);
    reponse.status(200).json(stock);
  });

  return routeur;
}
