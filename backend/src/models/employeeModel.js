import pool from '../config/db'

const UserModel = {
  findByUsername: async (employee_id) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [employee_id]);
    return result.rows[0];
  },

  createUser: async (employee_id, password) => {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [employee_id, password]);
  }
};

module.exports = UserModel;
