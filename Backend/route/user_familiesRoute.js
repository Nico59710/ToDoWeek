import express from 'express';
import {
    createUserFamilyController,
    getAllUsersFamiliesController,
    getUserFamilyController,
    updateUserFamilyController,
    deleteUserFamilyController,
    getUserFamilyByIdController,
    joinFamilyByCodeController,
    getPendingRequestsController,
    updateRequestStatusController,
    getMembersByFamilyIdController,
    updateMemberRoleController
} from '../controller/user_familiesController.js';


const router = express.Router();

// CREATE
router.post('/', createUserFamilyController);
router.post('/join', joinFamilyByCodeController);

// READ 
router.get('/', getAllUsersFamiliesController);
router.get('/pending/:family_id', getPendingRequestsController);
router.get('/members/:family_id', getMembersByFamilyIdController);
router.get('/:family_id/:user_id', getUserFamilyController);
router.get('/:user_id', getUserFamilyByIdController);


// UPDATE
router.put('/status/:family_id/:user_id', updateRequestStatusController);
router.put('/role/:family_id/:user_id', updateMemberRoleController);
router.put('/:family_id/:user_id', updateUserFamilyController);

// DELETE
router.delete('/:family_id/:user_id', deleteUserFamilyController);

export default router;