-- Phải tạo thông tin infor_users trước => Tạo tài khoản nhân viên
-- Khách hàng không cần tạo thông tin trước => Tạo tài khoản khách hàng

CREATE TYPE auth_role AS ENUM ('employee', 'customer');
ALTER type auth_role ADD VALUE IF NOT EXISTS 'admin';

-- BẢNG XÁC THỰC USERS (NHÂN VIÊN / KHÁCH HÀNG)
CREATE TABLE auth_users(
  auth_id serial PRIMARY KEY,
  username varchar(155) UNIQUE,
  phone_number varchar(15) NOT NULL UNIQUE,
  password varchar(255),
  role auth_role DEFAULT 'customer',
  created_date_auth date default NOW()
);


-- BẢNG THÔNG TIN CHUNG 
CREATE TABLE infor_users(
  user_id serial PRIMARY KEY,
  auth_id int unique NOT NULL, 
  card_id varchar(12) unique,
  full_name varchar(100),
  phone_number varchar(15) UNIQUE,
  date_of_birth date,
  gender int,
  permanent_address varchar(255),
  current_address varchar(255),
  FOREIGN KEY (auth_id) REFERENCES auth_users(auth_id),
  FOREIGN KEY (phone_number) REFERENCES infor_users(phone_number)
);

drop TABLE infor_work;
drop TABLE infor_users;
drop TABLE auth_users;

CREATE TYPE status_e AS ENUM('working', 'leave', 'empty', 'break')

-- BẢNG THÔNG TIN NHÂN VIÊN
CREATE TABLE infor_work (
  work_id serial PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  department_id INT, --Phòng ban
  position_id INT, --Chức vụ
  business varchar(100), --Chi nhánh
  started_date DATE,
  salary INT,
  coefficient DECIMAL, --Hệ số lương
  attached int, --Gắn bó (bao nhiêu ngày/tháng/ năm)
  status_employee status_e DEFAULT 'working', --working (đang làm việc) / leave (nghỉ phép) / empty (vắng) / break (nghỉ luôn)
  FOREIGN KEY (user_id) REFERENCES infor_users(user_id) 
  );

-- Bảng phòng ban (EX: Phòng Hành chính – Nhân sự (lễ tân, bảo vệ), Kế toán,...)
CREATE TABLE list_department (
  department_id serial PRIMARY KEY,
  department_name varchar(50)
);

-- Bảng chức vụ (EX: )
CREATE TABLE  list_position(
  position_id serial PRIMARY KEY,
  position_name varchar(50),
  department_id int not NULL,
  FOREIGN KEY (department_id) REFERENCES list_department(department_id)
);


