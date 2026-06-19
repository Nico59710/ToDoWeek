import express from 'express';
import {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryByIdController,
    deleteCategoryByIdController
} from '../controller/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

//CREATE
router.post('/', createCategoryController);
//READ
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);
//UPDATE
router.put('/:id', updateCategoryByIdController);
//DELETE
router.delete('/:id', deleteCategoryByIdController);

export default router;