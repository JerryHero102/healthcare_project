const db = require('../config/db');

export const getListEmployee = (request,response)=>{
    response.status(200).send("OK");
}

exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    
    //Câu lệnh SQL để thêm người dùng
    const queryText = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id
    `;
    
    //Các giá trị để truyền vào ($1, $2, $3)
    const values = [name, email, password]; // Lưu ý: Password phải được BĂM (hashed) trước khi truyền vào đây!

    try {
        //Chạy truy vấn
        const result = await db.query(queryText, values);
        
        res.status(201).json({ 
            message: 'Đăng ký thành công', 
            userId: result.rows[0].id 
        });

    } catch (error) {
        console.error('Lỗi khi đăng ký người dùng:', error.stack);
        res.status(500).send('Lỗi máy chủ khi tạo người dùng.');
    }
};