import express from 'express';
<<<<<<< HEAD
import employeesRouters from './routes/employeesRouters.js'
import list_departmentsRouters from './routes/list_departmentRouters.js'
import list_positionRouters from './routes/list_positionRouters.js'
import userRouters from './routes/usersRouter.js'
=======
import employeesRouters from './routes/employeesRouters.js';
import usersRouters from './routes/usersRouter.js';
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
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

        app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        });
};

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
