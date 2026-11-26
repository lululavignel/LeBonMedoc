import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function versJson(medicament) {
  return {
    id: medicament.id,
    nom: medicament.nom,
    prixDefaut: medicament.prixDefaut,
    estRemboursable: medicament.estRemboursable,
    categorie: medicament.categorie,
    necessiteOrdonnance: medicament.necessiteOrdonnance,
  };
}

export function routeurMedicaments(serviceMedicament) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const medicaments = await serviceMedicament.listerMedicaments();
    reponse.json(medicaments.map(versJson));
  });

  routeur.get('/:id', async (requete, reponse) => {
    const id = Number(requete.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
    reponse.json(versJson(await serviceMedicament.obtenirMedicamentParId(id)));
  });

  routeur.post('/', async (requete, reponse) => {
    const medicament = await serviceMedicament.creerMedicament(requete.body);
    reponse.status(201).json(versJson(medicament));
  });

  return routeur;
}
