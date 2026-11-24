import { ErreurIntrouvable, ErreurValidation } from '../erreurs.js';

export class ServiceClient {
  constructor(depotClient) {
    this.depotClient = depotClient;
  }

  listerClients() {
    return this.depotClient.getAll();
  }

  async obtenirClientParId(id) {
    const client = await this.depotClient.getById(id);
    if (!client) throw new ErreurIntrouvable(`Client ${id} introuvable`);
    return client;
  }

  creerClient(donnees) {
    const manquants = ['nom', 'prenom', 'numeroSecuriteSociale', 'email'].filter((champ) => !donnees?.[champ]);
    if (manquants.length) {
      throw new ErreurValidation(`Champs obligatoires manquants : ${manquants.join(', ')}`);
    }
    if (!/^\d{15}$/.test(donnees.numeroSecuriteSociale)) {
      throw new ErreurValidation('numeroSecuriteSociale doit contenir exactement 15 chiffres');
    }
    return this.depotClient.creer(donnees);
  }
}
