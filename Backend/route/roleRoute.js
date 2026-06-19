import express from 'express';
import {
  createRoleController,
  getAllRolesController,
  getRoleByIdController,
  getRolesByFamilyIdController,
  updateRoleByIdController,
  deleteRoleByIdController
} from '../controller/roleController.js';

const router = express.Router();

//CREATE
router.post('/', createRoleController);
//READ
router.get('/', getAllRolesController);
router.get('/family/:family_id', getRolesByFamilyIdController);
router.get('/:id', getRoleByIdController);
//UPDATE
router.put('/:id', updateRoleByIdController);
//DELETE
router.delete('/:id', deleteRoleByIdController);

export default router;