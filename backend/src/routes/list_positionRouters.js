import express from "express";
import { createNewPosition, deletePosition, getListPosition, getPositionByID, updatePosition } from "../controllers/list_positionControllers.js";

const router = express.Router();

router.get("/", getListPosition);
router.post("/create_new", createNewPosition);
router.get('/:position_id', getPositionByID); 
router.delete("/delete/:position_id", deletePosition);
router.put("/update/:position_id", updatePosition);
export default router;