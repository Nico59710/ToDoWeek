import express from 'express';
import { createUserController, getAllUsersController, getUserByIdController, updateUserByIdController, deleteUserByIdController, updateUserProfileController } 
from '../controller/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

//CREATE
router.post('/', createUserController);
//READ
router.get('/',  authMiddleware, getAllUsersController);
router.get('/:id', authMiddleware, getUserByIdController);
//UPDATE
router.put('/profile/:id', updateUserProfileController);
router.put('/:id',  updateUserByIdController);
//DELETE
router.delete('/:id', authMiddleware, deleteUserByIdController);

export default router;