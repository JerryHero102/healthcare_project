import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import list_departmentsRouters from './routes/list_departmentRouters.js'
import list_positionRouters from './routes/list_positionRouters.js'
import userRouters from './routes/usersRouter.js'
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
app.use(("/api/user"), userRouters);
app.use(("/api/department"), list_departmentsRouters);
app.use(("/api/position"), list_positionRouters);

export const ensureDefaultAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const username = "admin";
  const full_name = "Admin System";
  const phone_number = "0000000000"; 

  const role = "admin";
  const department_id = 1; 
  const position_id = 1; // nếu bạn đã tạo chức vụ Admin = 1

  try {
    // 1. Kiểm tra đã có admin chưa
    const checkAdmin = await pool.query(
      `SELECT 1 FROM auth_users WHERE role = 'admin' LIMIT 1`
    );

    if (checkAdmin.rowCount > 0) {
      console.log("ℹ️ Default admin already exists.");
      return;
    }

    // 2. Kiểm tra số điện thoại trùng
    const checkPhone = await pool.query(
      `SELECT 1 FROM infor_users WHERE phone_number = $1 LIMIT 1`,
      [phone_number]
    );

    if (checkPhone.rowCount > 0) {
      console.log("⚠️ Phone number already exists. Skipping admin creation.");
      return;
    }

    // 3. Tạo auth_users
    const hashed = await bcrypt.hash(adminPassword, 10);

    const authResult = await pool.query(
      `INSERT INTO auth_users (username, password, role, created_date_auth)
       VALUES ($1, $2, $3, NOW())
       RETURNING auth_id`,
      [username, hashed, role]
    );

    const auth_id = authResult.rows[0].auth_id;

    // 4. Tạo infor_users
    const userResult = await pool.query(
      `INSERT INTO infor_users (auth_id, full_name, phone_number)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [auth_id, full_name, phone_number]
    );

    const user_id = userResult.rows[0].user_id;

    // 5. Tạo infor_work 
    await pool.query(
      `INSERT INTO infor_work (user_id, department_id, position_id, status_employee)
       VALUES ($1, $2, $3, 'working')`,
      [user_id, department_id, position_id]
    );

    console.log(`✅ Default admin created successfully. User ID: ${user_id}`);

  } catch (err) {
    console.error("❌ Error ensuring default admin:", err.message || err);
  }
};

const start = async () => {
        await ensureDefaultAdmin();

        app.listen(PORT, () => {
                console.log(`Start Server on Port: ${PORT}`);
        });
};

start();



