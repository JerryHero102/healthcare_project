import express from "express";

const router = express.Router();

router.get("/", getListPosition);
router.post("/create-new", createNewPosition);
router.get('/:id', getPositionByID); // <-- Lấy theo employee_id
router.delete("/delete/:id", deletePosition);
router.put("/update/:id", updatePosition);
export default router;