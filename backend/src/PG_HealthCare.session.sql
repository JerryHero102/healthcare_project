-- Xóa các bảng (theo thứ tự tránh vi phạm FK)
DROP TABLE IF EXISTS schadule_patient_with_doctor CASCADE;
DROP TABLE IF EXISTS schadule_patient CASCADE;
DROP TABLE IF EXISTS infor_medical_users CASCADE;
DROP TABLE IF EXISTS schedule_employee CASCADE;
DROP TABLE IF EXISTS infor_expertise_doctor_nurse CASCADE;
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_user CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;


------------------------
-- Bảng xác thực khách hàng (login)
------------------------
CREATE TABLE infor_auth_user (
  infor_auth_user_id SERIAL PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- -----------------------
-- Bảng xác thực nhân viên (login employee)
-- Lưu ý: employee_id ở đây map tới infor_employee.infor_employee_id
-- -----------------------
CREATE TABLE infor_auth_employee (
  infor_auth_employee_id SERIAL PRIMARY KEY,       -- map đến infor_employee.infor_employee_id
  password_employee VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------
-- Thông tin chung (khách hàng / nhân viên)
-- -----------------------
CREATE TABLE infor_users (
  infor_users_id SERIAL PRIMARY KEY,
  infor_auth_user_id INT UNIQUE,
  phone_number VARCHAR(10) UNIQUE,
  card_id VARCHAR(12) UNIQUE,
  full_name VARCHAR(100),
  date_of_birth DATE,
  gender INT,
  permanent_address VARCHAR(255),
  current_address VARCHAR(255),
  CONSTRAINT fk_authuser_phone FOREIGN KEY (infor_auth_user_id) REFERENCES infor_auth_user(infor_auth_user_id) ON DELETE CASCADE
);


-- -----------------------
-- Danh sách phòng ban
-- -----------------------
CREATE TABLE list_department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);
INSERT INTO list_department (department_name) VALUES ('System');


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
VALUES('Admin', 1)

-- -----------------------
-- Thông tin nhân viên (kế thừa infor_users)
-- -----------------------
CREATE TABLE infor_employee (
  infor_employee_id SERIAL PRIMARY KEY,
  infor_users_id INT UNIQUE NOT NULL,
  infor_auth_employee INT UNIQUE NOT NULL,
  position_id INT,                 -- FK tới list_position.position_id
  department_id INT,               -- FK tới list_department.department_id (tiện cho lookup nhanh)
  business VARCHAR(200),           -- chi nhánh / cơ sở
  started_date DATE,
  salary INT,
  coefficient NUMERIC(8,2),        -- hệ số lương (decimal)
  attached INT,                    -- gắn bó (số tháng/năm - tuỳ bạn interpret)
  status_employee VARCHAR(20) DEFAULT 'active',
  CONSTRAINT fk_employee_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
  CONSTRAINT fk_auth_employee FOREIGN key (infor_auth_employee) REFERENCES infor_auth_employee(infor_auth_employee_id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES list_position(position_id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);

-- -----------------------
-- Thông tin chuyên môn cho bác sĩ / y tá
-- -----------------------
CREATE TABLE infor_expertise_doctor_nurse (
  doctor_nurse_id SERIAL PRIMARY KEY,
  infor_employee_id INT NOT NULL UNIQUE,
  specialty VARCHAR(150),
  educational_level VARCHAR(150),
  experience TEXT,
  professional_license VARCHAR(150),
  professional_description VARCHAR(400),
  CONSTRAINT fk_expertise_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE
);

-- -----------------------
-- Lịch làm việc của nhân viên (bác sĩ, y tá, ...)
-- -----------------------
CREATE TABLE schedule_employee (
  schedule_employee_id SERIAL PRIMARY KEY,
  infor_employee_id INT NOT NULL,
  date_work DATE,
  work_shift TIME,
  work_location VARCHAR(150),
  description_work_in VARCHAR(400),
  status_work VARCHAR(20) DEFAULT 'ready',
  CONSTRAINT fk_schedule_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE
);

-- -----------------------
-- Hồ sơ y tế của người dùng (khách hàng)
-- -----------------------
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


-- -- -----------------------
-- -- Index tối ưu (nếu cần)
-- -- -----------------------
-- CREATE INDEX idx_users_cardid ON infor_users(card_id);
-- CREATE INDEX idx_medical_cardid ON infor_medical_users(card_id);
-- CREATE INDEX idx_employee_userid ON infor_employee(infor_users_id);
-- CREATE INDEX idx_schedule_emp ON schedule_employee(infor_employee_id);

--Timeline: 03:00 AM: Cập nhật lại toàn bộ bảng, thêm bảng, xoá bảng...
--Sử dụng bảng auth_user cho đăng nhập khách hàng (map tham chiếu với phone_number)
--Sử dụng bảng auth_employee cho đăng nhập nhân viên (map tham chiếu với employee)

select * FROM infor_auth_employee
select * from infor_auth_user
select * from infor_employee
select * from infor_users
select * from list_department
select * from list_position

SELECT 
        iae.infor_auth_employee_id, 
        ie.infor_employee_id, 
        iu.full_name, --user
        ld.department_name, 
        pn.position_name,  
        iae.created_at,
        ie.status_employee 
      FROM infor_employee ie
      JOIN infor_users iu ON ie.infor_users_id = iu.infor_users_id
      LEFT JOIN infor_auth_employee iae on ie.infor_auth_employee = iae.infor_auth_employee_id
      LEFT JOIN list_department ld ON ie.department_id = ld.department_id
      LEFT JOIN list_position pn ON ie.position_id = pn.position_id
      ORDER BY iu.full_name ASC;

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

SELECT ie.infor_employee_id, iae.password_employee
      FROM infor_employee ie
      JOIN infor_auth_employee iae ON ie.infor_auth_employee = iae.infor_auth_employee_id
      WHERE ie.infor_employee_id = $ 1
      LIMIT 1

SELECT ie.infor_employee_id, iae.password_employee
      FROM infor_employee ie
      JOIN infor_auth_employee iae ON ie.infor_auth_employee = iae.infor_auth_employee_id
      WHERE ie.infor_employee_id = $1
      LIMIT 1
      
SELECT 
        e.infor_employee_id,
        u.full_name,
        u.card_id,
        u.phone_number,
        u.date_of_birth,
        u.gender,
        u.permanent_address,
        u.current_address,
        p.position_name AS position,
        d.department_name AS department,
        e.business,
        e.started_date,
        e.salary,
        e.coefficient,
        e.attached,
        e.status_employee
      FROM infor_employee e
      JOIN infor_users u ON e.infor_users_id = u.infor_users_id
      LEFT JOIN list_position p ON e.position_id = p.position_id
      LEFT JOIN list_department d ON e.department_id = d.department_id
      WHERE e.infor_employee_id = $1
      LIMIT 1;