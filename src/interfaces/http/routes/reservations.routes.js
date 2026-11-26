import { Router } from 'express';
import { ErreurValidation } from '../../../application/erreurs.js';

function lireId(requete) {
  const id = Number(requete.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new ErreurValidation('Identifiant invalide');
  return id;
}

function versJsonLigne(ligne) {
  return { medicamentId: ligne.medicamentId, quantite: ligne.quantite };
}

function versJson(reservation) {
  return {
    id: reservation.id,
    clientId: reservation.clientId,
    pharmacieId: reservation.pharmacieId,
    statut: reservation.statut,
    retraitLe: reservation.retraitLe,
    expireLe: reservation.expireLe,
    lignes: reservation.lignes.map(versJsonLigne),
  };
}

export function routeurReservations(serviceReservation) {
  const routeur = Router();

  routeur.get('/', async (_requete, reponse) => {
    const reservations = await serviceReservation.listerReservations();
    reponse.json(reservations.map(versJson));
  });

  routeur.get('/:id', async (requete, reponse) => {
    reponse.json(versJson(await serviceReservation.obtenirReservationParId(lireId(requete))));
  });

  routeur.get('/:id/lignes', async (requete, reponse) => {
    const lignes = await serviceReservation.listerLignesReservation(lireId(requete));
    reponse.json(lignes.map(versJsonLigne));
  });

  routeur.post('/', async (requete, reponse) => {
    const reservation = await serviceReservation.creerReservation(requete.body);
    reponse.status(201).json(versJson(reservation));
  });

  routeur.post('/:id/acceptation', async (requete, reponse) => {
    reponse.json(versJson(await serviceReservation.accepterReservation(lireId(requete))));
  });

  routeur.post('/:id/refus', async (requete, reponse) => {
    reponse.json(versJson(await serviceReservation.refuserReservation(lireId(requete))));
  });

  routeur.post('/:id/annulation', async (requete, reponse) => {
    reponse.json(versJson(await serviceReservation.annulerReservation(lireId(requete))));
  });

  routeur.post('/:id/retrait', async (requete, reponse) => {
    reponse.json(versJson(await serviceReservation.terminerReservation(lireId(requete))));
  });

  return routeur;
}
