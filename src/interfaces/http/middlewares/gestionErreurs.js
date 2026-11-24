import { ErreurApplication } from '../../../application/erreurs.js';
import { ErreurDomaine } from '../../../domaine/erreurs.js';

export function gestionnaireRouteIntrouvable(requete, reponse) {
  reponse.status(404).json({ erreur: `Route ${requete.method} ${requete.originalUrl} introuvable` });
}

// eslint-disable-next-line no-unused-vars
export function gestionnaireErreurs(erreur, _requete, reponse, _suivant) {
  if (erreur instanceof ErreurApplication) {
    return reponse.status(erreur.statut).json({ erreur: erreur.message });
  }
  if (erreur.type === 'entity.parse.failed') {
    return reponse.status(400).json({ erreur: 'Corps JSON invalide' });
  }
  // Violations de contraintes PostgreSQL
  if (erreur.code === '23505') {
    return reponse.status(409).json({ erreur: 'Ressource déjà existante (valeur unique en doublon)', detail: erreur.detail });
  }
  if (erreur.code === '23503') {
    return reponse.status(400).json({ erreur: 'Référence vers une ressource inexistante', detail: erreur.detail });
  }
  console.error(erreur);
  reponse.status(500).json({ erreur: 'Erreur interne du serveur' });
}
