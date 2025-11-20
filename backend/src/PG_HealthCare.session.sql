DROP TABLE IF EXISTS schadule_patient_with_doctor;
DROP TABLE IF EXISTS schadule_patient;
DROP TABLE IF EXISTS infor_familymember_user;
DROP TABLE IF EXISTS infor_medical_users;
DROP TABLE IF EXISTS infor_employee;
DROP TABLE IF EXISTS list_position;
DROP TABLE IF EXISTS list_department;
DROP TABLE IF EXISTS infor_users;
DROP TABLE IF EXISTS auth_users;
DROP TYPE IF EXISTS role_type;
-- -----------------------

SELECT au.auth_id
FROM auth_users au
JOIN infor_users iu ON au.auth_id = iu.auth_id
WHERE au.phone_number = iu.phone_number;


CREATE type role_type AS ENUM ('admin', 'employee', 'customer'); 
CREATE TABLE auth_users (
  auth_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  phone_number varchar(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_type DEFAULT 'customer',
  created_date_auth date DEFAULT now()
);


CREATE TABLE infor_users (
  user_id SERIAL PRIMARY KEY,
  auth_id INT UNIQUE,
  card_id VARCHAR(12) UNIQUE,
  phone_number VARCHAR(10) UNIQUE,
  full_name VARCHAR(100),
  date_of_birth DATE,
  gender INT,
  permanent_address VARCHAR(255),
  current_address VARCHAR(255),
  FOREIGN KEY (auth_id) REFERENCES auth_users(auth_id) ON DELETE CASCADE
);


-- -----------------------
-- Danh sách phòng ban
-- -----------------------
CREATE TABLE list_department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);
INSERT INTO list_department (department_name, department_id) VALUES ('System', 1);


-- -----------------------
-- Danh sách chức vụ
-- -----------------------
CREATE TABLE list_position (
  position_id SERIAL PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL,
  department_id INT,
  CONSTRAINT fk_position_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);
insert into list_position (position_name,department_id)
VALUES('Admin', 1);


-- -----------------------
-- Thông tin nhân viên (kế thừa infor_users)
-- -----------------------
CREATE TABLE infor_employee (
  employee_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  auth_id INT UNIQUE NOT NULL,
  position_id INT,                 -- FK tới list_position.position_id
  department_id INT,               -- FK tới list_department.department_id (tiện cho lookup nhanh)
  business VARCHAR(200),           -- chi nhánh / cơ sở
  started_date DATE,
  salary INT,
  coefficient NUMERIC(8,2),        -- hệ số lương (decimal)
  attached INT,                    -- gắn bó (số tháng/năm - tuỳ bạn interpret)
  status_employee VARCHAR(20) DEFAULT 'active',
  CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES infor_users(user_id),
  CONSTRAINT fk_employee_auth FOREIGN KEY (auth_id) REFERENCES auth_users(auth_id) 
);


-- -----------------------
-- Hồ sơ y tế của người dùng (khách hàng)
-- -----------------------
CREATE TABLE medical_users (
  medical_id SERIAL PRIMARY KEY,
  bhyt_id VARCHAR(17) UNIQUE,
  user_id VARCHAR(12) UNIQUE NOT NULL,
  blood_type VARCHAR(5),
  medical_history TEXT,
  allergy TEXT,
  note_users TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  update_new_date DATE,
  status_medical_users VARCHAR(50) DEFAULT 'not yet examined',
  FOREIGN KEY (user_id) REFERENCES infor_users(user_id)
);
ALTER TABLE infor_medical_users ADD COLUMN weight_user varchar(10);
ALTER TABLE infor_medical_users  ADD COLUMN height_user varchar(10);

CREATE TABLE infor_familymember_user (
  infor_familymember_user_id SERIAL PRIMARY key,
  infor_users_id int UNIQUE not null,
  full_name varchar(255),
  phone_number varchar(10),
  relationship varchar(20),
  CONSTRAINT fk_users_id FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id)
);

-- -----------------------
-- Lịch đăng ký khám bệnh của khách hàng
-- (Ở đây map card_id -> hồ sơ y tế; bạn có thể đổi để trỏ tới infor_medical_users.infor_medical_id nếu muốn)
-- -----------------------
CREATE TABLE schadule_patient (
  schadule_patient_id SERIAL PRIMARY KEY,
  card_id VARCHAR(12) NOT NULL,
  examination_day DATE,
  examination_hour TIME,
  clinic VARCHAR(100),
  reason_examination TEXT,
  status_schadule_patient VARCHAR(30) DEFAULT 'booked',
  CONSTRAINT fk_schadule_patient_card FOREIGN KEY (card_id) REFERENCES infor_medical_users(card_id) ON DELETE CASCADE
);

-- -----------------------
-- Bảng hẹn (liên kết bệnh nhân - bác sĩ)
-- -----------------------
CREATE TABLE schadule_patient_with_doctor (
  schadule_patient_with_doctor_id SERIAL PRIMARY KEY,
  date_medical_examination DATE,
  hour_medical_examination TIME,
  infor_employee_id INT NOT NULL,
  infor_users_id INT NOT NULL,
  CONSTRAINT fk_spwd_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE,
  CONSTRAINT fk_spwd_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);


  CREATE TABLE infor_medical_users (
  infor_medical_id SERIAL PRIMARY KEY,
  bhyt_id VARCHAR(17) UNIQUE,
  card_id VARCHAR(12) UNIQUE NOT NULL,
  blood_type VARCHAR(5),
  medical_history TEXT,
  allergy TEXT,
  note_users TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  update_new_date DATE,
  status_medical_users VARCHAR(50) DEFAULT 'not yet examined',
  CONSTRAINT fk_medical_user_card FOREIGN KEY (card_id) REFERENCES infor_users(card_id) ON DELETE CASCADE
);

CREATE TABLE infor_familymember_user (
  infor_familymember_user_id SERIAL PRIMARY key,
  infor_users_id int UNIQUE not null,
  full_name varchar(255),
  phone_number varchar(10),
  relationship varchar(20),
  CONSTRAINT fk_users_id FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id)
);
