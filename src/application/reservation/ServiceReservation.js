import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServiceReservation {
  constructor(depotReservation) {
    this.depotReservation = depotReservation;
  }

  listerReservations() {
    return this.depotReservation.getAll();
  }

  async obtenirReservationParId(id) {
    const reservation = await this.depotReservation.getById(id);
    if (!reservation) throw new ErreurIntrouvable(`Réservation ${id} introuvable`);
    return reservation;
  }

  async listerLignesReservation(id) {
    await this.obtenirReservationParId(id);
    return this.depotReservation.getLignes(id);
  }

  creerReservation(donnees) {
    const manquants = ['clientId', 'pharmacieId', 'lignes'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    for (const champ of ['clientId', 'pharmacieId']) {
      if (!Number.isInteger(donnees[champ]) || donnees[champ] <= 0) {
        throw new ErreurValidation(`${champ} doit être un entier positif`);
      }
    }

    // Règle du domaine : une réservation contient au moins un médicament
    if (!Array.isArray(donnees.lignes) || donnees.lignes.length === 0) {
      throw new ErreurValidation('Une réservation doit contenir au moins un médicament');
    }
    const medicaments = new Set();
    for (const { medicamentId, quantite } of donnees.lignes) {
      if (!Number.isInteger(medicamentId) || medicamentId <= 0) {
        throw new ErreurValidation('Chaque ligne doit avoir un medicamentId entier positif');
      }
      if (!Number.isInteger(quantite) || quantite <= 0) {
        throw new ErreurValidation('Chaque ligne doit avoir une quantite entière strictement positive');
      }
      if (medicaments.has(medicamentId)) {
        throw new ErreurValidation(`Le médicament ${medicamentId} apparaît plusieurs fois`);
      }
      medicaments.add(medicamentId);
    }

    if (donnees.retraitLe !== undefined && Number.isNaN(Date.parse(donnees.retraitLe))) {
      throw new ErreurValidation('retraitLe doit être une date valide');
    }
    return this.depotReservation.creer(donnees);
  }
}
