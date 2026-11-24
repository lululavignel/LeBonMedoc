import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurPharmacies(servicePharmacie) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await servicePharmacie.listerPharmacies());
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(await servicePharmacie.obtenirPharmacieParId(id));
  });

  routeur.post('/', async (requete, reponse) => {
    const pharmacie = await servicePharmacie.creerPharmacie(requete.body);
    reponse.status(201).json(pharmacie);
  });

  return routeur;
}
