import { createApp } from './app.js';
import { config } from './config/env.js';
import { pool } from './infrastructure/database/pool.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`LeBonMédoc API démarrée sur http://localhost:${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} reçu, arrêt en cours...`);
  server.close();
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
