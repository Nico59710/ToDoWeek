import * as roleModel from '../models/roleModel.js';
// On importe les fonctions de permissions pour les lier automatiquement aux rôles
import { seedPermissionsForRoleModel, softDeletePermissionsByRoleIdModel, reactivatePermissionsByRoleIdModel } from '../models/roles_permissionsModel.js';

// CREATE — crée le rôle en BDD, puis génère automatiquement les 14 permissions à false
// Comme ça la grille de permissions est toujours complète dès la création
export async function createRoleController(req, res) {
  const { role, is_active, family_id } = req.body;

  try {
    const result = await roleModel.createRoleModel(role, is_active, family_id);

    if (result.reactivated) {
      // Rôle déjà connu → on réactive ses permissions (config conservée)
      await reactivatePermissionsByRoleIdModel(result.insertId);
      res.status(200).json({ role_id: result.insertId, message: 'Rôle réactivé' });
    } else {
      // Nouveau rôle → on génère les 14 permissions à false
      await seedPermissionsForRoleModel(result.insertId);
      res.status(201).json({ role_id: result.insertId, message: 'Rôle créé' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Échec de la création du rôle' });
  }
}

// READ — tous les rôles
export async function getAllRolesController(req, res) {
  try {
    const result = await roleModel.getAllRolesModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des rôles' });
  }
}

// READ — rôles d'une famille (utilisé par le front pour afficher la liste des rôles)
export async function getRolesByFamilyIdController(req, res) {
  const { family_id } = req.params;
  try {
    const result = await roleModel.getRolesByFamilyIdModel(family_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des rôles de la famille' });
  }
}

export async function getRoleByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await roleModel.getRoleByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération du rôle' });
  }
}

// UPDATE
export async function updateRoleByIdController(req, res) {
  const { id } = req.params;
  const { role, is_active, created_by, family_id } = req.body;

  try {
    const result = await roleModel.updateRoleByIdModel(id, role, is_active, created_by, family_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour du rôle' });
  }
}

// DELETE — soft-delete du rôle + de ses permissions
export async function deleteRoleByIdController(req, res) {
  const { id } = req.params;
  try {
    await roleModel.deleteRoleByIdModel(id);
    await softDeletePermissionsByRoleIdModel(id);
    res.status(200).json({ message: 'Rôle supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression du rôle' });
  }
}