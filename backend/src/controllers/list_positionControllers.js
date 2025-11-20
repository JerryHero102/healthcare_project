import db from '../config/db.js';

/*--------- 
CREATE NEW POSITION (PASS API)
---------*/
export const createNewPosition = async (req, res) => {
    let { position_name, department_id } = req.body; // <-- dùng let
    if (!department_id) {
        return res.status(400).json({ message: 'Thiếu thông tin Phòng ban' });
    }
    if (!position_name) {
        return res.status(400).json({ message: 'Thiếu thông tin Chức vụ' });
    }

    position_name = position_name.trim().toLowerCase();

    try {
        // Kiểm tra trùng chức vụ trong phòng ban
        const checkExist = await db.query(
            "SELECT * FROM list_position WHERE LOWER(position_name) = $1 AND department_id = $2",
            [position_name, department_id]
        );

        if (checkExist.rowCount > 0) {
            return res.status(400).json({ error: "Chức vụ đã tồn tại trong phòng ban này!" });
        }

        const result = await db.query(
            'INSERT INTO list_position (position_name, department_id) VALUES ($1, $2) RETURNING *',
            [position_name, department_id]
        );

        res.status(201).json({ message: 'Tạo Chức vụ thành công', position: result.rows[0] });

    } catch (err) {
        console.error("Create Position Error:", err);
        res.status(500).json({ message: 'Lỗi kết nối Server', error: err.message });
    }
};


/*--------- 
GET LIST POSITION
---------*/
export const getListPosition = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM list_position ORDER BY position_id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }   
};


/*--------- 
 DELETE POSITION
---------*/
export const deletePosition = async (req, res) => {
    const { position_id } = req.params;
    try {
        const result = await db.query( 
            'DELETE FROM list_position WHERE position_id = $1 RETURNING *',
            [position_id]
        ); 
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa Chức vụ thành công', position: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};


/*--------- 
 UPDATE POSITION
---------*/
export const updatePosition = async (req, res) => {
    const { position_id } = req.params;
    const { position_name } = req.body;
    try {
        const result = await db.query(
            'UPDATE list_position SET position_name = $1 WHERE position_id = $2 RETURNING *',
            [position_name, position_id]
        ); 
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        }
        res.status(200).json({ message: 'Cập nhật Chức vụ thành công', position: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};


/*--------- 
GET POSITION BY ID
---------*/
export const getPositionByID = async (req, res) => {
    const { position_id } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM list_position WHERE position_id = $1',
            [position_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        } 
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi kết nối Server' });
    }
};

