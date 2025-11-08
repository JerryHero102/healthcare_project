import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép từ frontend
app.use(express.json());

app.use(("/api/employee"), employeesRouters);

app.listen(PORT, () => {
        console.log(`Start Server on Port: ${PORT}`);
});



