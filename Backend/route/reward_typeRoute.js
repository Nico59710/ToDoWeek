import express from 'express';
import {
    createRewardTypeController,
    getAllRewardTypesController,
    getRewardTypeByIdController,
    updateRewardTypeByIdController,
    deleteRewardTypeByIdController
} from '../controller/reward_typeController.js';

const router = express.Router();

// CREATE
router.post('/', createRewardTypeController);

// READ
router.get('/', getAllRewardTypesController);
router.get('/:id', getRewardTypeByIdController);

// UPDATE
router.put('/:id', updateRewardTypeByIdController);

// DELETE
router.delete('/:id', deleteRewardTypeByIdController);

export default router;