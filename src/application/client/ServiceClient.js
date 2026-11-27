import { ErreurIntrouvable } from '../erreurs.js';
import { Client } from '../../modele/client/Client.js';

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
    const client = Client.creer(donnees ?? {});
    return this.depotClient.creer(client);
  }
}
