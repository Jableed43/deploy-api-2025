import Product, { statusEnum } from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    //En los productos tenemos categoria que es un esquema aparte
    //Para poder traer dichos datos debemos popular
    const products = await Product.find().populate("category");
    if (products.length === 0) {
      return res.status(204).json({ message: "There are no products" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = new Product(req.body);
    const { name } = productData;
    const productExist = await Product.findOne({ name });

    if (productExist) {
      return res
        .status(400)
        .json({ message: `Product ${name} already exists` });
    }

    const savedProduct = await productData.save();
    return res.status(200).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const findProductByName = async (req, res) => {
  try {
    const name = req.body.name;
    //Quito espacios y paso a minuscula
    const parsedName = name.trim().toLowerCase();
    const productExist = await Product.findOne({ name: parsedName });
    if (!productExist) {
      return res.status(400).json({ message: `Product ${name} doesn't exist` });
    }
    res.status(200).json({ productExist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const findProductById = async (req, res) => {
  try {
    const _id = req.params.id;
    //Quito espacios y paso a minuscula
    const productExist = await Product.findOne({ _id });
    if (!productExist) {
      return res.status(400).json({ message: `Product ${_id} doesn't exist` });
    }
    res.status(200).json({ productExist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const _id = req.params.id;
    const productExist = await Product.findOne({ _id })
    if(!productExist){
      return res.status(400).json({ message: "User you're trying to update does not exist" })
    }

    const updateProduct = await Product.findByIdAndUpdate({ _id }, req.body, {new: true})

    // const updateProduct = await Product.updateOne( {_id}, req.body, {new: true} )

    res.status(201).json(updateProduct)

  } catch (error) {
    res.status(500).json({ message: "internal server error", error })
  }
}


export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findOne({ _id: id });
    if (!productExist) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.findByIdAndDelete(id);
    res.status(201).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

export const getStatus = async (req, res) => {
  try {
    return res.status(200).json(statusEnum);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};