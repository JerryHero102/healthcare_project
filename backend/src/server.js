import express from 'express';
import employeesRouters from './routes/employeesRouters.js'


const app = express();
app.use(express.json());

app.use(("/api/employee"),employeesRouters);

app.listen(5001, () =>{
    console.log("Start Server on Port:5001");
});



