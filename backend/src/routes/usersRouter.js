import express, { Router } from 'express';
<<<<<<< HEAD
import { getUserById } from '../controllers/employeeControllers.js';
import { getListUser, loginUser, registerUser, updateUser } from '../controllers/usersController.js';
=======
import {deleteUser, getUserById, loginUser, registerUser, updateUser } from '../controllers/usersController.js';
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87

const router_users = express.Router();


//----- CRUD -----//
<<<<<<< HEAD
router_users.get("/", getListUser);
router_users.post("/auth/register", registerUser);
router_users.post("/auth/login", loginUser);
router_users.get('/users/get-id/:user_id', getUserById);
router_users.put("/users/update/:user_id", updateUser);
=======
// router_users.get("/users", getListUser);
router_users.post("/auth/register", registerUser);
router_users.post("/auth/login", loginUser);
router_users.get('/id/:id', getUserById);
router_users.delete("/delete/:id", deleteUser)
router_users.put("/update/:id", updateUser);
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
// router_users.put("/delete/:user_id");
export default router_users;