import express from 'express';
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskByIdController,
  deleteTaskByIdController,
  getTaskByUserIdController,
  getTaskByFamilyIdController,
  updateTaskStatusController,
  updateAttributeTaskController
} from '../controller/taskController.js';

const router = express.Router();

//CREATE
router.post('/', createTaskController);
//READ
router.get('/', getAllTasksController);
router.get('/user/:id', getTaskByUserIdController);
router.get('/family/:id', getTaskByFamilyIdController);
router.get('/:id', getTaskByIdController);

//UPDATE
router.put('/:id/status', updateTaskStatusController);
router.put('/:id/assign', updateAttributeTaskController);
router.put('/:id', updateTaskByIdController);
//DELETE
router.delete('/:id', deleteTaskByIdController);

export default router;