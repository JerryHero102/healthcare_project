import express from "express";

const router = express.Router();

router.get("/", getListDepartment);
router.post("/create-new", createNewDepartMent);
router.get('/:id', getDepartmentByID); // <-- Lấy theo employee_id
router.delete("/delete/:id", deleteDepartment);
router.put("/update/:id", updateDepartment);
export default router;