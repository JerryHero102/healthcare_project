------/////BẢNG NGƯỜI DÙNG (KHÁCH HÀNG / NHÂN VIÊN)/////--------
CREATE TABLE infor_users (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) UNIQUE, --Dùng để đăng nhập nhân viên
  phone_number VARCHAR(10) UNIQUE NOT NULL, --Dùng để đăng nhập khách hàng
  password VARCHAR(255) NOT NULL, --Dùng để đăng nhập nhân viên/ khách hàng
  card_id VARCHAR(12) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  date_of_birth DATE,
  permanent_address VARCHAR(255),
  current_address VARCHAR(255),
  role_user varchar(20) DEFAULT 'users', -- Phân quyền (users, employees, admins)
  -- Nhân viên 
  position VARCHAR(50), -- Chức vụ
  department VARCHAR(50), -- Phòng ban
  started_date DATE, -- Ngày bắt đầu làm việc
  salary INT, -- Lương cơ bản
  status_employee VARCHAR(20) DEFAULT 'active' -- Trạng thái làm việc (active, inactive, on_leave)
);
ALTER TABLE infor_users ADD column gender INT


------/////BẢNG BÁC SĨ/ Y Tá / Điều dưỡng //////--------
CREATE TABLE infor_doctor_nurse(
  doctor_nurse_id varchar(10) PRIMARY KEY NOT NULL,
  Specialty varchar(100), --Chuyên khoa
  educational_level varchar(100), --Trình độ
  experience varchar(100), --Kinh nghiệm
  professtional_license varchar(100), --giấy phép hành ngheè
  professtional_description varchar(255), --mô tả
  card_id varchar(12) UNIQUE not NULL,
  CONSTRAINT fk_cardid_infor_user_doctor FOREIGN KEY (card_id) REFERENCES infor_users(card_id)
);


------/////BẢNG Thông tin hành chính/ công việc //////--------
CREATE TABLE work_information_doctor (
  id_work_information serial PRIMARY KEY,
  id_schedule_doctor INT UNIQUE,  --Lịch làm việc (lưu vào chuối + tạo bảng lịch riêng)
  business varchar(100), --Phòng khám / bệnh viện công tác
  status_work varchar(50), --Trang thái làm việc (làm việc, nghỉ phép, nghỉ hưu)
  doctor_nurse_id varchar(10) NOT NULL,
  FOREIGN KEY (doctor_nurse_id) REFERENCES infor_doctor_nurse(doctor_nurse_id)
);

DROP TABLE work_information_doctor


------/////BẢNG Lịch của BÁC SĨ //////--------
CREATE TABLE work_schedule_list_doctor (
  id_schedule_doctor serial PRIMARY KEY,
  date_work date NOT NULL, 
  description_work_in varchar(255), --mô tả công việc
  status_work varchar(20) DEFAULT 'not yet examined',
  CONSTRAINT fk_work_schedule FOREIGN KEY (id_schedule_doctor) REFERENCES work_information_doctor(id_schedule_doctor)
);


------/////BẢNG Thông tin bệnh nhân //////--------
CREATE TABLE infor_medical_users(
  infor_medical_id serial PRIMARY key,
  bhyt_id varchar(17) UNIQUE NOT null,
  card_id varchar(12) UNIQUE not null, 
  blood_type varchar(5), --Loại máu
  medical_history varchar (255), --Lịch sử khám
  allergy varchar(255), --Dị ứng
  note_users varchar(255), --ghi chú
  created_date date NOT NULL, --Ngày tạo hồ sơ
  update_new_date date, --Cập nhật mới nhất
  status_medical_users varchar DEFAULT 'not yet examined',
  -- Under treatment (đang điều trị) / Discharged (xuất viện) / Deleted / Paused
  FOREIGN key (card_id) REFERENCES infor_users(card_id)
);

------/////Bảng lịch của bệnh nhân //////--------
CREATE TABLE schadule_patient(
  schadule_patient_id serial PRIMARY key not null,
  infor_medical_id INT not null, --Bảng infor_medical_users
  doctor_nurse_id varchar(10), --Bảng infor_doctor_nurse
  examination_day date, --Ngày khám
  examination_hour time, --Giờ khám
  clinic varchar(50), -- Phòng khám
  reason_examination text, -- Lý do khám
  status_schadule_patient varchar(30) DEFAULT 'booked', --Checked | Canclle | Pending
  FOREIGN key (infor_medical_id) REFERENCES infor_medical_users(infor_medical_id),
  FOREIGN key (doctor_nurse_id) REFERENCES infor_doctor_nurse(doctor_nurse_id)
);




