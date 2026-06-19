import express from 'express';
import {
    createRoomController,
    getAllRoomsController,
    getRoomByIdController,
    updateRoomByIdController,
    deleteRoomByIdController,
    getRoomsByFamilyIdController
} from '../controller/roomsController.js';

const router = express.Router();

// CREATE
router.post('/', createRoomController);

// READ
router.get('/', getAllRoomsController);
router.get('/family/:id', getRoomsByFamilyIdController);
router.get('/:id', getRoomByIdController);

// UPDATE
router.put('/:id', updateRoomByIdController);

// DELETE
router.delete('/:id', deleteRoomByIdController);

export default router;