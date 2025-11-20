import express, { Router } from 'express'
import { deleteAccountEmployee, getListAccountEmloyee, loginEmployee, registerEmployee, updateAccountEmployee, addInforEmployee, getEmployeeById, updateEmployee, deleteEmployee, getListAEmployee } from '../controllers/employeeControllers.js'
import { authenticateToken, authorizeEmployeeOrAdmin } from '../middleware/authMiddleware.js';



const router = express.Router();


//----- CRUD -----//
/*ACCOUNT*/
router.get("/accounts-e", getListAccountEmloyee);
router.post("/auth/register", registerEmployee);
router.post("/auth/login", loginEmployee);
router.put("/auth/delete-e", authenticateToken, authorizeEmployeeOrAdmin, deleteAccountEmployee);
router.put("/auth/update", authenticateToken, authorizeEmployeeOrAdmin, updateAccountEmployee);

// ----- INFOR_USERS (employee information)
// Add new infor (by phone_number)
router.post('/infor/add', addInforEmployee  );
// Get infor by infor_users_id
router.get('/infor/profile', authenticateToken, authorizeEmployeeOrAdmin, getEmployeeById);
// Update infor (requires token)
router.put('/infor/update', authenticateToken, updateEmployee);
// Delete infor (requires token)
router.delete('/infor/delete', authenticateToken, deleteEmployee);
// List infor users
router.get('/infor', getListAEmployee);

export default router;