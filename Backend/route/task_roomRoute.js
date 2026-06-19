import express from 'express';
import {
    createTaskRoomController,
    getAllTaskRoomsController,
    getTaskRoomController,
    updateTaskRoomController,
    deleteTaskRoomController
} from '../controller/task_roomsController.js';

const router = express.Router();

// CREATE
router.post('/', createTaskRoomController);

// READ ALL
router.get('/', getAllTaskRoomsController);

// READ ONE (composite key)
router.get('/:room_id/:task_id', getTaskRoomController);

// UPDATE (composite key)
router.put('/:room_id/:task_id', updateTaskRoomController);

// DELETE (composite key)
router.delete('/:room_id/:task_id', deleteTaskRoomController);

export default router;