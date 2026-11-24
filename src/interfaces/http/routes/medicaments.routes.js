import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

export function routeurMedicaments(serviceMedicament) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    reponse.json(await serviceMedicament.listerMedicaments());
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(await serviceMedicament.obtenirMedicamentParId(id));
  });

  routeur.post('/', async (requete, reponse) => {
    const medicament = await serviceMedicament.creerMedicament(requete.body);
    reponse.status(201).json(medicament);
  });

  return routeur;
}
