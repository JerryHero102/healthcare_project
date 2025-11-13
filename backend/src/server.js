import express from 'express';
import employeesRouters from './routes/employeesRouters.js';
import usersRouters from './routes/usersRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use("/api/employee", employeesRouters);
app.use("/api/users", usersRouters);

// =======================
// Tạo admin mặc định
// =======================
const ensureDefaultAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const full_name = 'Admin System';
  const position_id = 1;      // Admin
  const department_id = 1;    // System
  const phone_number = '0000000000';

  try {
    // 1️⃣ Kiểm tra admin đã tồn tại chưa (theo phone_number)
    const userCheck = await pool.query(
      'SELECT infor_users_id FROM infor_users WHERE phone_number = $1',
      [phone_number]
    );

    if (userCheck.rowCount === 0) {
      // 2️⃣ Tạo infor_users
      const userResult = await pool.query(
        `INSERT INTO infor_users (phone_number, full_name) 
         VALUES ($1, $2)
         RETURNING infor_users_id`,
        [phone_number, full_name]
      );
      const infor_users_id = userResult.rows[0].infor_users_id;

      // 3️⃣ Tạo infor_auth_employee (login)
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const authResult = await pool.query(
        `INSERT INTO infor_auth_employee (password_employee)
         VALUES ($1)
         RETURNING infor_auth_employee_id`,
        [hashedPassword]
      );
      const infor_auth_employee_id = authResult.rows[0].infor_auth_employee_id;

      // 4️⃣ Tạo infor_employee (thông tin nhân viên)
      const employeeResult = await pool.query(
        `INSERT INTO infor_employee (infor_users_id, infor_auth_employee, position_id, department_id, status_employee)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING infor_employee_id`,
        [infor_users_id, infor_auth_employee_id, position_id, department_id]
      );

      console.log(`✅ Default admin created successfully. Employee ID: ${employeeResult.rows[0].infor_employee_id}`);
    } else {
      console.log('ℹ️ Default admin already exists.');
    }
  } catch (err) {
    console.error('❌ Error ensuring default admin:', err.message || err);
  }
};

// =======================
// Tạo user mặc định
// =======================
const ensureDefaultUser = async () => {
  const userPassword = process.env.USER_PASSWORD || 'User123@';
  const full_name = 'Nguyễn Văn A';
  const card_id = '012345678912';
  const date_of_birth = '2005-08-26';
  const phone_number = '0123456789';
  const permanent_address = 'Phường Tân Sơn Nhất, TP. Hồ Chí Minh';
  const current_address = 'Phường Sơn Kỳ, TP. Hồ Chí Minh';
  const gender = 0;

  try {
    const userCheck = await pool.query(
      'SELECT infor_users_id FROM infor_users WHERE phone_number = $1',
      [phone_number]
    );

    if (userCheck.rowCount === 0) {
      // 1️⃣ Tạo infor_auth_user
      const hashed = await bcrypt.hash(userPassword, 10);
      const authResult = await pool.query(
        `INSERT INTO infor_auth_user (password)
         VALUES ($1)
         RETURNING infor_auth_user_id`,
        [hashed]
      );
      const infor_auth_user_id = authResult.rows[0].infor_auth_user_id;

      // 2️⃣ Tạo infor_users (thông tin chung)
      const userResult = await pool.query(
        `INSERT INTO infor_users (infor_auth_user_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING infor_users_id`,
        [infor_auth_user_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address]
      );

      console.log(`✅ Default user created successfully. User ID: ${userResult.rows[0].infor_users_id}`);
    } else {
      console.log('ℹ️ Default user already exists.');
    }
  } catch (err) {
    console.error('❌ Error ensuring default User:', err.message || err);
  }
};

// =======================
// Start server
// =======================
const start = async () => {
  await ensureDefaultAdmin();
  await ensureDefaultUser();

  app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`);
  });
};

start();
