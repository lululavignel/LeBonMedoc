import { pool } from '../database/pool.js';

const COLUMNS = 'id, name, address, city, postal_code, phone, email, opening_hours, is_partner, created_at';

export class PgPharmacyRepository {
  async findAll() {
    const { rows } = await pool.query(`SELECT ${COLUMNS} FROM pharmacies ORDER BY id`);
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(`SELECT ${COLUMNS} FROM pharmacies WHERE id = $1`, [id]);
    return rows[0] ?? null;
  }

  async create({ name, address, city, postalCode, phone = null, email = null, openingHours = {} }) {
    const { rows } = await pool.query(
      `INSERT INTO pharmacies (name, address, city, postal_code, phone, email, opening_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLUMNS}`,
      [name, address, city, postalCode, phone, email, openingHours],
    );
    return rows[0];
  }
}
