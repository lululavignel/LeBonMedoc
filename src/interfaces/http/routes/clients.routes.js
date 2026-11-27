import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function versJson(client) {
  return {
    id: client.id,
    nom: client.nom,
    prenom: client.prenom,
    numeroSecuriteSociale: client.numeroSecuriteSociale.valeur,
    email: client.email.valeur,
    telephone: client.telephone?.valeur ?? null,
    creeLe: client.creeLe,
  };
}

export function routeurClients(serviceClient) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const clients = await serviceClient.listerClients();
    reponse.json(clients.map(versJson));
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(versJson(await serviceClient.obtenirClientParId(id)));
  });

  routeur.post('/', async (requete, reponse) => {
    const client = await serviceClient.creerClient(requete.body);
    reponse.status(201).json(versJson(client));
  });

  return routeur;
}
