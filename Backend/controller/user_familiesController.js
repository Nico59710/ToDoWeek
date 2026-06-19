import * as usersFamiliesModel from '../models/users_familiesModel.js';
import * as userModel from '../models/userModel.js';
import { db } from '../config/db.js';

// CREATE
export async function createUserFamilyController(req, res) {
  const { family_id, user_id, role } = req.body;

  try {
    const result = await usersFamiliesModel.createUserFamilyModel(family_id, user_id, role);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec création user_family' });
    console.log(error);
  }
}

// READ
export async function getAllUsersFamiliesController(req, res) {
  try {
    const result = await usersFamiliesModel.getAllUsersFamiliesModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec récupération users_families' });
  }
}

// READ ONE
export async function getUserFamilyController(req, res) {
  const { family_id, user_id } = req.params;

  try {
    const result = await usersFamiliesModel.getUserFamilyModel(family_id, user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec récupération user_family' });
  }
}

// READ by user_id
export async function getUserFamilyByIdController(req, res) {
  const { user_id } = req.params;
  try {
    const result = await usersFamiliesModel.getUserFamiliesByUserIdModel(user_id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Échec récupération user_familyByUserId' });
  }
}

// Récupérer les membres d'une famille
export async function getMembersByFamilyIdController(req, res) {
    const { family_id } = req.params;
    try {
        const result = await usersFamiliesModel.getMembersByFamilyIdModel(family_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération membres" });
        console.log(error);
    }
}

// UPDATE
export async function updateUserFamilyController(req, res) {
  const { family_id, user_id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await usersFamiliesModel.updateUserFamilyModel(family_id, user_id, is_active);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec update user_family' });
  }
}

// DELETE — retire un membre d'une famille
// Si c'était sa dernière famille active, son rôle repasse à "temp"
export async function deleteUserFamilyController(req, res) {
  const { family_id, user_id } = req.params;

  try {
    await usersFamiliesModel.deleteUserFamilyModel(family_id, user_id);

    const remainingFamilies = await usersFamiliesModel.countActiveFamiliesByUserIdModel(user_id);
    if (remainingFamilies === 0) {
      const [tempRole] = await db.query("SELECT role_id FROM roles WHERE role = 'temp' LIMIT 1");
      if (tempRole.length > 0) {
        await userModel.updateRoleByUserIdModel(user_id, tempRole[0].role_id);
      }
    }

    res.status(200).json({ message: 'Membre retiré de la famille' });
  } catch (error) {
    res.status(500).json({ error: 'Échec suppression user_family' });
  }
}

// Changer le rôle d'un membre dans une famille (admin uniquement)
export async function updateMemberRoleController(req, res) {
    const { family_id, user_id } = req.params;
    const { role_id } = req.body;
    try {
        const result = await usersFamiliesModel.updateMemberRoleModel(family_id, user_id, role_id);
        res.status(200).json({ message: 'Rôle du membre mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du rôle du membre' });
        console.log(error);
    }
}

// Rejoindre via code
export async function joinFamilyByCodeController(req, res) {
    const { invite_code, user_id } = req.body;
    try {
        const result = await usersFamiliesModel.joinFamilyByCodeModel(invite_code, user_id);
        if (!result) return res.status(404).json({ error: "Code invalide" });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
        console.log(error);
    }
}

// Récupérer les demandes en attente
export async function getPendingRequestsController(req, res) {
    const { family_id } = req.params;
    try {
        const result = await usersFamiliesModel.getPendingRequestsModel(family_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
        console.log(error);
    }
}

// Accepter ou refuser
export async function updateRequestStatusController(req, res) {
    const { family_id, user_id } = req.params;
    const { status } = req.body;
    try {
        const result = await usersFamiliesModel.updateRequestStatusModel(family_id, user_id, status);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
        console.log(error);
    }
}
