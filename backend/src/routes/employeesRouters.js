import express, { Router } from 'express'
import { deleteAccountEmployee, getListAccountEmloyee, loginEmployee, registerEmployee, updateAccountEmployee} from '../controllers/employeeControllers.js'
import { authenticateToken, authorizeEmployeeOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


//----- CRUD -----//
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
export default router;