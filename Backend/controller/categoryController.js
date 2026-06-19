import * as categoryModel from '../models/categoryModel.js';

// CREATE
export async function createCategoryController(req, res) {
  const { family_id, name, color, created_by, created_at, updated_at, is_active } = req.body;

  try {
    const result = await categoryModel.createCategoryModel(family_id, name, color, created_by, created_at, updated_at, is_active);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la création de la catégorie' });
  }
}

// READ
export async function getAllCategoriesController(req, res) {
  try {
    const result = await categoryModel.getAllCategoriesModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des catégories' });
  }
}

export async function getCategoryByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await categoryModel.getCategoryByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la catégorie' });
  }
}

// UPDATE
export async function updateCategoryByIdController(req, res) {
  const { id } = req.params;
  const { family_id, name, color, created_by, created_at, updated_at, is_active } = req.body;

  try {
    const result = await categoryModel.updateCategoryByIdModel(id, family_id, name, color, created_by, created_at, updated_at, is_active);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour de la catégorie' });
  }
}

// DELETE
export async function deleteCategoryByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await categoryModel.deleteCategoryByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression de la catégorie' });
  }
}