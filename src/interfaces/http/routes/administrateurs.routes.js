import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurAdministrateurs(serviceAdministrateur) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await serviceAdministrateur.listerAdministrateurs());
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(await serviceAdministrateur.obtenirAdministrateurParId(id));
  });

  routeur.post('/', async (requete, reponse) => {
    const administrateur = await serviceAdministrateur.creerAdministrateur(requete.body);
    reponse.status(201).json(administrateur);
  });

  return routeur;
}
