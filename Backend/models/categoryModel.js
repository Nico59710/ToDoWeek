import { db } from '../config/db.js';

// CREATE
export async function createCategoryModel(family_id, name, color, created_by, created_at, updated_at, is_active) {
  const query = 'INSERT INTO categories (family_id, name, color, created_by, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const [result] = await db.query(query, [family_id, name, color, created_by, created_at, updated_at, is_active]);
  return result;
}

// READ
export async function getAllCategoriesModel() {
  const query = 'SELECT * FROM categories';
  const [result] = await db.query(query);
  return result;
}

export async function getCategoryByIdModel(id) {
  const query = 'SELECT * FROM categories WHERE category_id = ?';
  const [result] = await db.query(query, [id]);
  return result[0];
}

// UPDATE
export async function updateCategoryByIdModel(category_id, family_id, name, color, created_by, created_at, updated_at, is_active) {
  const query = 'UPDATE categories SET family_id = ?, name = ?, color = ?, created_by = ?, created_at = ?, updated_at = ?, is_active = ? WHERE category_id = ?';
  const [result] = await db.query(query, [family_id, name, color, created_by, created_at, updated_at, is_active, category_id]);
  return result;
}

// DELETE
export async function deleteCategoryByIdModel(id) {
  const query = 'UPDATE categories SET is_active = 0 WHERE category_id = ?';
  const [result] = await db.query(query, [id]);
  return result;
}