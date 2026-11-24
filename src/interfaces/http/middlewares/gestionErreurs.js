import { ErreurApplication } from '../../../application/erreurs.js';

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
  console.error(erreur);
  reponse.status(500).json({ erreur: 'Erreur interne du serveur' });
}
