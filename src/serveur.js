import { creerApplication } from './app.js';
import { configuration } from './config/env.js';
import { connexions } from './infrastructure/bdd/connexion.js';

const application = creerApplication();

const serveur = application.listen(configuration.port, () => {
  console.log(`LeBonMédoc API démarrée sur http://localhost:${configuration.port}`);
});

async function arreter(signal) {
  console.log(`${signal} reçu, arrêt en cours...`);
  serveur.close();
  await connexions.end();
  process.exit(0);
}

process.on('SIGINT', () => arreter('SIGINT'));
process.on('SIGTERM', () => arreter('SIGTERM'));
