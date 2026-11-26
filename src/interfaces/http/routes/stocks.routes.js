import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function versJson(stock) {
  return {
    pharmacieId: stock.pharmacieId,
    medicamentId: stock.medicamentId,
    prix: stock.prix,
    quantite: stock.quantite,
    misAJourLe: stock.misAJourLe,
  };
}

export function routeurStocks(serviceStock) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const stocks = await serviceStock.listerStocks();
    reponse.json(stocks.map(versJson));
  });

  routeur.get('/:pharmacieId/:medicamentId', async (requete, reponse) => {
    const pharmacieId = Number(requete.params.pharmacieId);
    const medicamentId = Number(requete.params.medicamentId);
    if (![pharmacieId, medicamentId].every((id) => Number.isInteger(id) && id > 0)) {
      throw new ErreurValidation('Identifiant invalide');
    }
    reponse.json(versJson(await serviceStock.obtenirStock(pharmacieId, medicamentId)));
  });

  routeur.post('/', async (requete, reponse) => {
    const stock = await serviceStock.creerStock(requete.body);
    reponse.status(201).json(versJson(stock));
  });

  return routeur;
}
