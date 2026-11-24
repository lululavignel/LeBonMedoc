import { AppError } from '../../../application/errors.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} introuvable` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Corps JSON invalide' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
}
