import express from 'express';
import { getPermissionsByRoleIdController, updatePermissionsController, getPermissionsByUserAndFamilyController } from '../controller/permissionsController.js';

const router = express.Router();

// READ — permissions d'un rôle
router.get('/role/:role_id', getPermissionsByRoleIdController);

// READ — permissions de l'utilisateur dans une famille
router.get('/user/:user_id/family/:family_id', getPermissionsByUserAndFamilyController);

// UPDATE — mise à jour des permissions d'un rôle
router.put('/role/:role_id', updatePermissionsController);

export default router;
