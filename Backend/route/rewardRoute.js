import express from 'express';
import {
    createRewardController,
    getAllRewardsController,
    getRewardByIdController,
    updateRewardByIdController,
    deleteRewardByIdController
} from '../controller/rewardsController.js';

const router = express.Router();

// CREATE
router.post('/', createRewardController);

// READ
router.get('/', getAllRewardsController);
router.get('/:id', getRewardByIdController);

// UPDATE
router.put('/:id', updateRewardByIdController);

// DELETE
router.delete('/:id', deleteRewardByIdController);

export default router;