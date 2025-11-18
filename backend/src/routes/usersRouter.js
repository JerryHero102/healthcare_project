import express, { Router } from 'express';
import {deleteUser, getUserById, loginUser, registerUser, updateUser } from '../controllers/usersController.js';

const router_users = express.Router();


//----- CRUD -----//
// router_users.get("/users", getListUser);
router_users.post("/auth/register", registerUser);
router_users.post("/auth/login", loginUser);
router_users.get('/id/:id', getUserById);
router_users.delete("/delete/:id", deleteUser)
router_users.put("/update/:id", updateUser);
// router_users.put("/delete/:user_id");
export default router_users;