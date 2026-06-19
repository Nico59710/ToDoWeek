import express from 'express';
import {
    createFamilyController,
    getAllFamiliesController,
    getFamilyByIdController,
    updateFamilyByIdController,
    deleteFamilyByIdController,
    getFamilyByUserIdController,
    getFamilyByOwnerIdController,
    getFamilyByOwnerAndNameControler,
    generateInviteCodeController
} from '../controller/familiesController.js';

const router = express.Router();

// CREATE
router.post('/', createFamilyController);

// READ
router.get('/', getAllFamiliesController);
router.get('/user/:id', getFamilyByUserIdController);
router.get('/owner/:id', getFamilyByOwnerIdController);
router.get('/owner/name/', getFamilyByOwnerAndNameControler);
router.get('/:id', getFamilyByIdController);
router.post('/:id/invite', generateInviteCodeController);

// UPDATE
router.put('/:id', updateFamilyByIdController);

// DELETE
router.delete('/:id', deleteFamilyByIdController);

export default router;