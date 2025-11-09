------/////TẠO BẢNG XÁC THỰC NGƯỜI DÙNG (ĐĂNG NHẬP/ ĐĂNG KÝ CHO KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
CREATE TABLE auth_users (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) UNIQUE,
  phone_number VARCHAR(10) UNIQUE,
  password VARCHAR(255) NOT NULL
)

------/////TẠO BẢNG THÔNG TIN NGƯỜI DÙNG (KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
CREATE TABLE information_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(10) UNIQUE,
  card_id VARCHAR(12) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  date_of_birth DATE,
  permanent_address VARCHAR(255),
  current_address VARCHAR(255),
  CONSTRAINT fk_auth_card_id FOREIGN KEY (phone_number) REFERENCES auth_users(phone_number)
);

----/////TẠO BẢNG THÔNG TIN NHÂN VIÊN/////--------
CREATE TABLE information_employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) unique NOT NULL, -- Mã nhân viên
    card_id varchar(12) unique, -- Số CMND/CCCD
    position VARCHAR(50), -- Chức vụ
    department VARCHAR(50), -- Phòng ban
    started_date DATE, -- Ngày bắt đầu làm việc
    salary INT NOT NULL, -- Lương cơ bản
    status VARCHAR(20) DEFAULT 'active', -- Trạng thái làm việc (active, inactive, on_leave)
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES auth_users(employee_id),
    CONSTRAINT fk_card_id FOREIGN KEY (card_id) REFERENCES information_user(card_id)
);

INSERT INTO auth_users (employee_id, phone_number, password) VALUES
('0201050607', '0123456789', 'hashed_password_1');


--Tạo view tổng hợp
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
LEFT JOIN information_user i ON a.phone_number = i.phone_number;
