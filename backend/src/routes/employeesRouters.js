import express, { Router } from 'express'
<<<<<<< HEAD
import { deleteAccountEmployee, getListAccountEmloyee, loginEmployee, registerEmployee, updateAccountEmployee} from '../controllers/employeeControllers.js'
import { authenticateToken, authorizeEmployeeOrAdmin } from '../middleware/authMiddleware.js';
=======
import { deleteEmployee, getEmployeeById, getListEmployee, loginEmployee, registerEmployee, updateEmployee } from '../controllers/employeeControllers.js'
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87

const router = express.Router();


//----- CRUD -----//
<<<<<<< HEAD
/*ACCOUNT*/
router.get("/accounts-e", getListAccountEmloyee);
router.post("/auth/register", registerEmployee);
router.post("/auth/login", loginEmployee);
router.put("/auth/delete-e/:auth_id", authenticateToken, authorizeEmployeeOrAdmin, deleteAccountEmployee);
router.put("/auth/update/:auth_id", authenticateToken, authorizeEmployeeOrAdmin, updateAccountEmployee);

/*INFOR*/
// router.get('/:employee_id', getEmployeeById); // <-- Lấy theo employee_id
// router.get("/", getListEmployee);
// router.delete("/delete/:employee_id", deleteEmployee);
=======
// Login
router.get("/employee-list", getListEmployee);
router.post("/register", registerEmployee);
router.get('/:employee_id', getEmployeeById); // <-- Lấy theo employee_id
router.post("/login", loginEmployee);
router.delete("/delete/:employee_id", deleteEmployee);
router.put("/update/:employee_id", updateEmployee);
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
export default router;