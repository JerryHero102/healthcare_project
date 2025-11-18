import db from '../config/db.js';

/*--------- 
 GET LIST DEPARTMENT (PASS API)
---------*/
export const getListDepartment = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM list_department ORDER BY department_id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    } 
};

/*--------- 
 GREATE NEW DEPARTMENT (PASS API)
---------*/
export const createNewDepartment = async (req, res) => {
    let { department_name} =  req.body;
    if  (!department_name) {
        return res.status(400).json({ message: 'Thiếu thông tin Phòng ban' });
    }
    // Chuyển tên thành lowercase để thống nhất
    department_name = department_name.trim().toLowerCase();
    //Kiểm tra trùng tên phòng ban (không phân biệt chữ hoa/thường)
    const checkExist = await db.query(
      "SELECT * FROM list_department WHERE LOWER(department_name) = $1",
      [department_name]
    );
    if (checkExist.rowCount > 0) {
      return res.status(400).json({ error: "⚠️ Phòng ban đã tồn tại!" });
    }
    try {
        const result = await db.query(
            'INSERT INTO list_department (department_name) VALUES ($1) RETURNING *',
            [department_name]
        );
        res.status(201).json({ message: 'Tạo Phòng ban thành công', department: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};

/*--------- 
 GET DEPARTMENT BY ID
---------*/
export const getDepartmentByID = async (req, res) => {
    const { department_id } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM list_department WHERE department_id = $1',
            [department_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Phòng ban không tồn tại' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};

/*--------- 
 DELETE DEPARTMENT (PASS API)
---------*/
export const deleteDepartment = async (req, res) => {
    const { department_id } = req.params;
    try {
        const result = await db.query(
            'DELETE FROM list_department WHERE department_id = $1 RETURNING *',
            [department_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Phòng ban không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa Phòng ban thành công', department: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};

/*--------- 
 UPDATE DEPARTMENT (PASS API)
---------*/
export const updateDepartment = async (req, res) => {
    const { department_id } = req.params;
    let { newdepartment_name } = req.body;

    if (!newdepartment_name) {
        return res.status(400).json({ message: 'Thiếu tên Phòng ban mới' });
    }
    newdepartment_name = newdepartment_name.trim().toLowerCase();

    try {
        const result = await db.query(
            'UPDATE list_department SET department_name = $1 WHERE department_id = $2 RETURNING *',
            [newdepartment_name, department_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Phòng ban không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật Phòng ban thành công', department: result.rows[0] });
    } catch (err) {
        console.error("Update Department Error:", err);
        res.status(500).json({ message: 'Lỗi kết nối Server', error: err.message });
    }
};

 