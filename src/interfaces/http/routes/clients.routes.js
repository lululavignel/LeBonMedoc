import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurClients(serviceClient) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await serviceClient.listerClients());
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(await serviceClient.obtenirClientParId(id));
  });

  routeur.post('/', async (requete, reponse) => {
    const client = await serviceClient.creerClient(requete.body);
    reponse.status(201).json(client);
  });

  return routeur;
}
