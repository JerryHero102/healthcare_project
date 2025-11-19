import express from 'express';
import employeesRouters from './routes/employeesRouters.js';
import usersRouters from './routes/usersRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

// Import Swagger
import { swaggerUi, swaggerSpec } from './swagger.js';

// Import new API routes
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import positionRoutes from './routes/positionRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Existing routes
app.use(("/api/employee"), employeesRouters);
app.use('/api/department', departmentRoutes);
app.use('/api/position', positionRoutes);

// New REST API routes
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/account', accountRoutes);

// =======================
// Tạo admin mặc định
// =======================
const ensureDefaultAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const full_name = 'Admin System';
  const position_id = 1;      // Admin
  const department_id = 1;    // System
  const phone_number = '0000000000';
  const card_id = '000000000000';
  try {
    //Kiểm tra xem đã có admin trong bảng auth_users
    const authCheck = await pool.query(
      'SELECT auth_id FROM auth_users WHERE username = $1 AND role = $2 LIMIT 1',
      [adminUsername, 'admin']
    );

    if (authCheck.rowCount === 0) {
      // Tạo record trong auth_users
      const hashed = await bcrypt.hash(adminPassword, 10);
      const insertAuth = await pool.query(
        `INSERT INTO auth_users (username, phone_number, password, role, created_date_auth)
         VALUES ($1, $2, $3, $4, NOW()) RETURNING auth_id`,
        [adminUsername, phone_number, hashed, 'admin']
      );
      const auth_id = insertAuth.rows[0].auth_id;

      // Tạo users trỏ tới auth_id (nếu chưa có số điện thoại đó)
      const userCheck = await pool.query(
        'SELECT auth_id FROM infor_users WHERE auth_id = $1 LIMIT 1', [auth_id]);
      let user_id;
      if (userCheck.rowCount === 0) {
        const userResult = await pool.query(
          `INSERT INTO infor_users (auth_id, phone_number, full_name, card_id)
           VALUES ($1, $2, $3, $4) RETURNING user_id`,
          [auth_id, phone_number, full_name, card_id]
        );
        user_id = userResult.rows[0].user_id;
      } else {
        user_id = userCheck.rows[0].user_id;
        // cập nhật auth_id nếu cần
        await pool.query('UPDATE infor_users SET auth_id = $1 WHERE user_id = $2', [auth_id, user_id]);
      }

      //Tạo employee nếu chưa tồn tại
      const empCheck = await pool.query('SELECT employee_id FROM infor_employee WHERE user_id = $1 LIMIT 1', [user_id]);
      if (empCheck.rowCount === 0) {
        const empInsert = await pool.query(
          `INSERT INTO infor_employee (user_id, auth_id, position_id, department_id, status_employee)
           VALUES ($1, $2, $3, $4, 'active') RETURNING employee_id`,
          [user_id, auth_id, position_id, department_id]
        );
        console.log(`✅ Default admin created. Employee ID: ${empInsert.rows[0].employee_id}`);
      } else {
        console.log('ℹ️ Default admin employee already exists.');
      }
    } else {
      console.log('ℹ️ Default admin account already exists.');
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
    const defaultUsername = process.env.USER_USERNAME || 'user_default';

    // Kiểm tra user auth existence
    const authCheck = await pool.query('SELECT auth_id FROM auth_users WHERE username = $1 LIMIT 1', [defaultUsername]);
    let auth_id;
    if (authCheck.rowCount === 0) {
      const hashed = await bcrypt.hash(userPassword, 10);
      const insertAuth = await pool.query(
        `INSERT INTO auth_users (username,phone_number, password, role, created_date_auth) VALUES ($1, $2, $3, $4, NOW()) RETURNING auth_id`,
        [defaultUsername, phone_number, hashed, 'customer']
      );
      auth_id = insertAuth.rows[0].auth_id;
    } else {
      auth_id = authCheck.rows[0].auth_id;
    }

    // Tạo users nếu chưa có theo phone_number
    const userCheck = await pool.query('SELECT user_id FROM infor_users WHERE phone_number = $1 LIMIT 1', [phone_number]);
    if (userCheck.rowCount === 0) {
      const userResult = await pool.query(
        `INSERT INTO infor_users (auth_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id`,
        [auth_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address]
      );
      console.log(`✅ Default user created successfully. User ID: ${userResult.rows[0].user_id}`);
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
