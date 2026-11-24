import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function lireId(requete) {
  const id = Number(requete.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
  return id;
}

export function routeurReservations(serviceReservation) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await serviceReservation.listerReservations());
  });

  routeur.get('/:id', async (requete, reponse) => {
    reponse.json(await serviceReservation.obtenirReservationParId(lireId(requete)));
  });

  routeur.get('/:id/lignes', async (requete, reponse) => {
    reponse.json(await serviceReservation.listerLignesReservation(lireId(requete)));
  });

  routeur.post('/', async (requete, reponse) => {
    const reservation = await serviceReservation.creerReservation(requete.body);
    reponse.status(201).json(reservation);
  });

  return routeur;
}
