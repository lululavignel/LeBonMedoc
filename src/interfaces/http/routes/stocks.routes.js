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
    const stock = await serviceStock.obtenirStock(requete.params)
    reponse.json(versJson(stock));
  });

  routeur.post('/', async (requete, reponse) => {
    const stock = await serviceStock.creerStock(requete.body);
    reponse.status(201).json(versJson(stock));
  });

  routeur.patch('/:pharmacieId/:medicamentId', async (requete, reponse) => {
    const stock = await serviceStock.modifierStock(requete.params, requete.body);
    reponse.status(200).json(versJson(stock));
  });

  return routeur;
}
