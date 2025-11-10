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

drop TABLE infor_users;
