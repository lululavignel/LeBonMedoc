import { Router } from 'express';
import { checkDatabase } from '../../../infrastructure/database/pool.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  try {
    const db = await checkDatabase();
    res.json({ status: 'ok', database: { status: 'up', name: db.database, time: db.now } });
  } catch (err) {
    res.status(503).json({ status: 'degraded', database: { status: 'down', error: err.message } });
  }
});
