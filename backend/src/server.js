import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép từ frontend
app.use(express.json())

app.use(("/api/employee"), employeesRouters);

// Ensure default admin account exists before starting server
const ensureDefaultAdmin = async () => {
        const adminId = process.env.ADMIN_EMPLOYEE_ID || '00000admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const card_id = process.env.ADMIN_CARD_ID || '000000000000';
        const phone_number = process.env.ADMIN_PHONE || '0000000000';
        const role_user = 'employee';
        try {
                const { rowCount } = await pool.query('SELECT 1 FROM infor_users WHERE employee_id = $1', [adminId]);
                if (rowCount === 0) {
                        const hashed = await bcrypt.hash(adminPassword, 10);
                        await pool.query('INSERT INTO infor_users (employee_id, phone_number, password, card_id, role_user) VALUES ($1, $2, $3, $4, $5)', [adminId, phone_number, hashed, card_id, role_user]);
                        console.log(`Default admin created -> employee_id: ${adminId}`);
                } else {
                        console.log('Default admin already exists');
                }
        } catch (err) {
                console.error('Error ensuring default admin:', err.message || err);
        }
};

const start = async () => {
        await ensureDefaultAdmin();

        app.listen(PORT, () => {
                console.log(`Start Server on Port: ${PORT}`);
        });
};

start();



