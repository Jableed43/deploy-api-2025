import Category from "../models/categoryModel.js";

//Ver de añadir varias category a la vez

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(204).json({ message: "There are no categories" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const newCategory = new Category({ name });
    const response = await newCategory.save();
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    const categoryExist = await Category.findOne({ _id });
    if (!categoryExist) {
      return res.status(400).json({ message: "Category does not exist" });
    }
    const response = await Category.findByIdAndDelete(_id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
