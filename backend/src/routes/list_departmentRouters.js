import express from "express";
import { createNewDepartment, deleteDepartment, getDepartmentByID, getListDepartment, updateDepartment } from "../controllers/list_departmentController.js";

const router = express.Router();

router.get("/", getListDepartment);
router.post("/create-new", createNewDepartment);
router.get('/:department_id', getDepartmentByID);
router.delete("/delete/:department_id", deleteDepartment);
router.put("/update/:department_id", updateDepartment);
export default router;