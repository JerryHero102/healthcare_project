-- ------/////TẠO BẢNG THÔNG TIN NGƯỜI DÙNG (KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(50) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL
-- );
--   ALTER TABLE users ADD CoLUMN email VARCHAR(100) UNIQUE;
--   ALTER TABLE users ADD CoLUMN phone_number VARCHAR(10) UNIQUE;
--   ALTER TABLE users ADD CoLUMN card_id VARCHAR(12) UNIQUE; --Không được trùng lặp (UNIQUE)
--   ALTER TABLE users ADD CoLUMN full_name VARCHAR(100);
--   ALTER TABLE users ADD CoLUMN date_of_birth DATE;
--   ALTER TABLE users ADD CoLUMN permanent_address VARCHAR(255); --Địa chỉ thường trú
--   ALTER TABLE users ADD CoLUMN current_address VARCHAR(255); --Địa chỉ hiện tại
-- -//ĐỔI TÊN BẢNG THÀNH THÔNG TIN NGƯỜI DÙNG
-- ALTER TABLE users RENAME TO information_user;

--ALTER TABLE information_user add column employee_id VARCHAR(10) UNIQUE;
-- ALTER TABLE information_user ADD CONSTRAINT fk_employee_id -- Đặt tên ràng buộc (nên dùng)
-- FOREIGN KEY (employee_id)           -- Cột trong bảng con (employees)
-- REFERENCES auth_users (employee_id);     -- Tham chiếu đến cột id trong bảng cha (auth_users)

-- ------/////TẠO BẢNG XÁC THỰC NGƯỜI DÙNG (ĐĂNG NHẬP/ ĐĂNG KÝ CHO KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
-- CREATE TABLE auth_users (
--   id SERIAL PRIMARY KEY,
--   employee_id VARCHAR(10) UNIQUE,
--   phone_number VARCHAR(10) UNIQUE,
--   password VARCHAR(255) NOT NULL
-- )

-- INSERT INTO auth_users (employee_id, phone_number, password) VALUES
-- ('0201050607', '0123456789', 'hashed_password_1');


-- Tạo view tổng hợp (tuỳ chọn)
CREATE OR REPLACE VIEW vw_employee_full AS
SELECT a.employee_id,
       a.phone_number    AS auth_phone,
       i.full_name,
       i.email,
       i.phone_number    AS contact_phone,
       i.card_id,
       i.date_of_birth,
       i.permanent_address,
       i.current_address
FROM auth_users a
LEFT JOIN information_user i ON a.employee_id = i.employee_id;
