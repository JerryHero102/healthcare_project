import express, { Router } from 'express'
import { getListEmployee, loginEmployee, registerEmployee } from '../controllers/employeeControllers.js'

const router = express.Router();


//----- CRUD -----//
// Login
router.get("/", getListEmployee);
router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
export default router;