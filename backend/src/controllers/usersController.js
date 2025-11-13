import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 REGISTER USER
---------*/
export const registerUser = async (req, res) => {};

/*--------- 
 LOGIN USER
---------*/
export const loginUser = async (req, res) => {};

/*--------- 
 DELETE USER
---------*/
export const deleteUser = async (req, res) => {};

/*--------- 
 UPDATE USER
---------*/
export const updateUser = async (req, res) => {};

/*--------- 
 GET USER BY ID
---------*/
export const getUserById = async (req, res) => {};

/*--------- 
 LIST ALL USER
---------*/
export const getListUser = async (req, res) => {
  try {
    const q = `
      SELECT
      iu.infor_users_id,
      iu.phone_number,
      iu.full_name,
      iu.date_of_birth,
      iu.gender,
      iu.permanent_address,
      iu.current_address,
      iau.created_at
    FROM infor_users iu
    JOIN infor_auth_user iau on iu.infor_auth_user_id = iau.infor_auth_user_id
    ORDER BY iu.full_name ASC;
    `;
    const { rows, rowCount } = await db.query(q);
    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy toàn khoản khách hàng nào!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows
    });

  } catch (err) {
    console.error("Lấy danh sách tin khách hàng không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
};
