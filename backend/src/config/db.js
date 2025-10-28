const { Pool } = require('pg');
require('dotenv').config();

// Cấu hình kết nối từ biến môi trường
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// Kiểm tra kết nối
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Lỗi khi kết nối đến PostgreSQL:', err.stack);
    }
    console.log('Kết nối thành công đến PostgreSQL!');
    client.release(); // Nhả client về pool
});

module.exports = pool;