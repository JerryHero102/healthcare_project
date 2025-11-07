import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const connectDB = async () => {
try {
    const client = await pool.connect();
    console.log('Kết nối thành công đến PostgreSQL!');
    client.release();
} catch (err) {
    console.error('Lỗi khi kết nối đến PostgreSQL:', err.stack);
}
};
connectDB
export default pool;