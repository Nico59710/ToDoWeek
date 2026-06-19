import * as familiesModel from '../models/familiesModel.js';

// CREATE
export async function createFamilyController(req, res) {
  try {
    const {
      name,
      owner_user_id,
      invite_code,
      is_active,
      avatar_url
    } = req.body;
    const exist = await familiesModel.getFamilyByOwnerIdModel(owner_user_id) || [];
    const alreadyExists = exist.some(family => family.name === name);

    if (alreadyExists) {
      return res.status(409).json({ error: 'Vous avez déjà créé une famille avec ce nom' });
    }

    const result = await familiesModel.createFamilyModel(
      name,
      owner_user_id,
      invite_code,
      is_active,
      avatar_url
    );

    return res.status(201).json({
      message: "Famille créée",
      family_id: result.family_id,

    });

  } catch (error) {
    res.status(500).json({ error: 'Échec de la création de la famille' });
    console.log(error);
  }
}

// READ
export async function getAllFamiliesController(req, res) {
  try {
    const result = await familiesModel.getAllFamiliesModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des familles' });
  }
}

//READ Family by owner id
export async function getFamilyByOwnerIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await familiesModel.getFamilyByOwnerIdModel(id)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la famille' });
  }
}
//READ Family by ownerID and name
export async function getFamilyByOwnerAndNameControler(req, res) {
  try {
    const {
      owner_user_id,
      name,
    } = req.query;
    const result = await familiesModel.getFamilyByOwnerAndNameModel(owner_user_id, name)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la famille' });
  }
}

export async function getFamilyByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await familiesModel.getFamilyByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la famille' });
  }
}

//READ family by user ID 
export async function getFamilyByUserIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await familiesModel.getFamilyByUserIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la famille' });
  }
}

// UPDATE
export async function updateFamilyByIdController(req, res) {
  const { id } = req.params;
  const { name, owner_user_id, invite_code, is_active, avatar_url } = req.body;

  try {
    const result = await familiesModel.updateFamilyByIdModel(
      id,
      name,
      owner_user_id,
      invite_code,
      is_active,
      avatar_url
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour de la famille' });
  }
}

// DELETE
export async function deleteFamilyByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await familiesModel.deleteFamilyByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression de la famille' });
  }
}

// Generation d'un code aléatoir pour les invités
export async function generateInviteCodeController(req, res) {
    const { id } = req.params;
    try {
        const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await familiesModel.updateFamilyInviteCodeModel(id, invite_code);
        res.status(200).json({ invite_code });
    } catch (error) {
        res.status(500).json({ error: "Erreur génération du code" });
        console.log(error);
    }
}