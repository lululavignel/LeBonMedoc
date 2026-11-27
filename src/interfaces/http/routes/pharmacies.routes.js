import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function versJson(pharmacie) {
  return {
    id: pharmacie.id,
    nom: pharmacie.nom,
    adresse: pharmacie.adresse,
    ville: pharmacie.ville,
    codePostal: pharmacie.codePostal.valeur,
    telephone: pharmacie.telephone?.valeur ?? null,
    email: pharmacie.email?.valeur ?? null,
    horaires: pharmacie.horaires,
    creeLe: pharmacie.creeLe,
  };
}

export function routeurPharmacies(servicePharmacie) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const pharmacies = await servicePharmacie.listerPharmacies();
    reponse.json(pharmacies.map(versJson));
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(versJson(await servicePharmacie.obtenirPharmacieParId(id)));
  });

  routeur.post('/', async (requete, reponse) => {
    const pharmacie = await servicePharmacie.creerPharmacie(requete.body);
    reponse.status(201).json(versJson(pharmacie));
  });

  return routeur;
}
