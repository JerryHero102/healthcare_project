import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/*--------- 
<<<<<<< HEAD
 REGISTER USER (PASS API)
---------*/
export const registerUser = async (req, res) => {
    const { phone, password, role} = req.body;
    try {
        // Kiểm tra nếu user đã tồn tại
        const existingUser = await db.query('SELECT * FROM auth_users WHERE phone_number = $1', [phone]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Người dùng đã tồn tại' });
        }
        // Băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAuth = await db.query(
            'INSERT INTO auth_users (phone_number, password, role, created_date_auth) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [phone, hashedPassword, role || 'customer']
        );
        res.status(201).json({ message: 'Tài khoản người dùng tạo thành công', auth: newAuth.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};

/*--------- 
 LOGIN USER (PASS API)
---------*/
export const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        // Tìm người dùng theo số điện thoại    
        const userResult = await db.query('SELECT * FROM auth_users WHERE phone_number = $1', [phone]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
        }
        const user = userResult.rows[0];
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
        }
        // Tạo JWT
        const token = jwt.sign(
            { auth_id: user.auth_id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'SECRET_KEY',
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};
=======
REGISTER USER
---------*/
export const registerUser = async (req, res) => {
  const { phone, password, card_id, full_name, date_of_birth, gender, permanent_address, current_address } = req.body;

  if (!phone || !password || !card_id) {
    return res.status(400).json({ ok: false, message: "⚠️ Vui lòng nhập đủ thông tin" });
  }

  try {
    // Kiểm tra số điện thoại hoặc card_id đã tồn tại
    const checkQuery = `SELECT * FROM infor_users WHERE phone_number = $1 OR card_id = $2`;
    const checkResult = await db.query(checkQuery, [phone, card_id]);
    if (checkResult.rowCount > 0) {
      return res.status(400).json({ ok: false, message: "❌ Số điện thoại hoặc CCCD đã tồn tại!" });
    }

    // Băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertAuth = `INSERT INTO infor_auth_user (password) VALUES ($1) RETURNING infor_auth_user_id`;
    const authResult = await db.query(insertAuth, [hashedPassword]);
    const authId = authResult.rows[0].infor_auth_user_id;

    const insertUser = `
      INSERT INTO infor_users 
      (infor_auth_user_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING infor_users_id, phone_number, full_name
    `;
    const userResult = await db.query(insertUser, [
      authId, phone, card_id, full_name || '', date_of_birth || null, gender || 0, permanent_address || '', current_address || ''
    ]);
    const user = userResult.rows[0];

    // Tạo JWT
    const token = jwt.sign({ 
      infor_users_id: user.infor_users_id, 
      phone_number: user.phone_number 
    },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      ok: true,
      message: "✅ Đăng ký khách hàng thành công!",
      user,
      token
    });

  } catch (err) {
    console.error("❌ registerUser error:", err);
    return res.status(500).json({ ok: false, message: "❌ Lỗi hệ thống!" });
  }
};


/*--------- 
LOGIN USER
---------*/
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // 1️⃣ Kiểm tra xem người dùng có tồn tại không
    const q = `
      SELECT iu.infor_users_id, iu.phone_number, iau.password
      FROM infor_users iu
      JOIN infor_auth_user iau ON iu.infor_auth_user_id = iau.infor_auth_user_id
      WHERE iu.phone_number = $1 LIMIT 1
    `;
    const { rows } = await db.query(q, [phone]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "❌ Số điện thoại không tồn tại!"
      });
    }

    // 2️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        message: "❌ Mật khẩu không chính xác!"
      });
    }

    // 3️⃣ Tạo JWT Token
    const token = jwt.sign(
      { user_id: user.infor_users_id, phone: user.phone_number },
      process.env.JWT_SECRET || "SECRET_KEY", // thay bằng biến môi trường thực tế
      { expiresIn: "7d" }
    );

    // 4️⃣ Trả dữ liệu về client
    return res.status(200).json({
      ok: true,
      message: "✅ Đăng nhập thành công!",
      data: {
        user_id: user.infor_users_id,
        phone_number: user.phone_number,
        token: token
      }
    });

  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    return res.status(500).json({
      ok: false,
      message: "❌ Lỗi server!"
    });
  }
};

>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87

/*--------- 
GET USER BY ID
---------*/
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT iu.infor_users_id, iu.phone_number, iu.full_name, iu.date_of_birth, iu.gender, iu.permanent_address, iu.current_address
      FROM infor_users iu
      WHERE iu.infor_users_id = $1
      LIMIT 1
    `;
    const { rows, rowCount } = await db.query(query, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ ok: false, message: "❌ Không tìm thấy user!" });
    }

    return res.json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error("❌ getUserById error:", err);
    return res.status(500).json({ ok: false, message: "❌ Lỗi hệ thống!" });
  }
};

/*--------- 
DELETE USER
---------*/
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM infor_users WHERE infor_users_id = $1 RETURNING *`;
    const { rows, rowCount } = await db.query(query, [id]);
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, message: "❌ Không tìm thấy user!" });
    }
    return res.json({ ok: true, message: "✅ Xóa user thành công!", user: rows[0] });
  } catch (err) {
    console.error("❌ deleteUser error:", err);
    return res.status(500).json({ ok: false, message: "❌ Lỗi hệ thống!" });
  }
};

/*--------- 
UPDATE USER
---------*/
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ ok: false, message: "⚠️ Không có dữ liệu để cập nhật!" });
    }

    const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE infor_users SET ${setQuery} WHERE infor_users_id = $${fields.length + 1} RETURNING *`;

    const { rows } = await db.query(query, [...values, id]);
    return res.json({ ok: true, message: "✅ Cập nhật thành công!", user: rows[0] });

  } catch (err) {
    console.error("❌ updateUser error:", err);
    return res.status(500).json({ ok: false, message: "❌ Lỗi hệ thống!" });
  }
};

/*--------- 
GET LIST USER
---------*/
<<<<<<< HEAD
export const getListUser = async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM auth_users where role = $1', ['customer']);
        res.status(200).json(users.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};
=======
// export const getListUser = async (req, res) => {
//   try {
//     const q = `
//       SELECT 
//         iae.infor_auth_employee_id, 
//         ie.infor_employee_id, 
//         iu.full_name, --user
//         ld.department_name, 
//         pn.position_name,  
//         iae.created_at,
//         ie.status_employee 
//       FROM infor_employee ie
//       JOIN infor_users iu ON ie.infor_users_id = iu.infor_users_id
//       LEFT JOIN infor_auth_employee iae on ie.infor_auth_employee = iae.infor_auth_employee_id
//       LEFT JOIN list_department ld ON ie.department_id = ld.department_id
//       LEFT JOIN list_position pn ON ie.position_id = pn.position_id
//       ORDER BY iu.full_name ASC;

//     `;
//     const { rows, rowCount } = await db.query(q);
//     if (rowCount === 0) {
//       return res.status(404).json({
//         ok: false,
//         message: "❌ Không tìm thấy toàn khoản nhân viên nào!"
//       });
//     }

//     return res.status(200).json({
//       ok: true,
//       data: rows
//     });

//   } catch (err) {
//     console.error("Lấy danh sách tin nhân viên không thành công:", err);
//     return res.status(500).json({
//       ok: false,
//       error: "❌ Lỗi kết nối server!"
//     });
//   }
// }

>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
