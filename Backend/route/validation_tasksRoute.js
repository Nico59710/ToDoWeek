import express from 'express';
import {
    createValidationTaskController,
    getAllValidationTasksController,
    getValidationTaskByIdController,
    updateValidationTaskByIdController,
    deleteValidationTaskByIdController
} from '../controller/validation_tasksController.js';

const router = express.Router();

// CREATE
router.post('/', createValidationTaskController);

// READ
router.get('/', getAllValidationTasksController);
router.get('/:id', getValidationTaskByIdController);

// UPDATE
router.put('/:id', updateValidationTaskByIdController);

// DELETE
router.delete('/:id', deleteValidationTaskByIdController);

export default router;