import pool from '../config/db'

const UserModel = {
  findByUsername: async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  createUser: async (username, password) => {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
  }
};

module.exports = UserModel;
