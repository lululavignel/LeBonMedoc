import { Router } from 'express';
import { verifierBaseDeDonnees } from '../../../infrastructure/bdd/connexion.js';

export const routeurSante = Router();

routeurSante.get('/', async (_requete, reponse) => {
  try {
    const bdd = await verifierBaseDeDonnees();
    reponse.json({ statut: 'ok', baseDeDonnees: { statut: 'disponible', nom: bdd.base, heure: bdd.heure } });
  } catch (erreur) {
    reponse.status(503).json({ statut: 'degrade', baseDeDonnees: { statut: 'indisponible', erreur: erreur.message } });
  }
});
