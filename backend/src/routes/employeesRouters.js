import express, { Router } from 'express'
import { getListEmployee } from '../controllers/employeesControllers.js'

const router = express.Router();


//----- CRUD -----//
// Login
router.get("/login", getListEmployee);


export default router;