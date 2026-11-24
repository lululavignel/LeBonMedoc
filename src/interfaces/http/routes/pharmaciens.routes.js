import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurPharmaciens(servicePharmacien) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await servicePharmacien.listerPharmaciens());
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(await servicePharmacien.obtenirPharmacienParId(id));
  });

  routeur.post('/', async (requete, reponse) => {
    const pharmacien = await servicePharmacien.creerPharmacien(requete.body);
    reponse.status(201).json(pharmacien);
  });

  return routeur;
}
