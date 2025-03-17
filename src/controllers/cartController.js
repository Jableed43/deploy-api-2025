import Cart from "../models/cartModel.js";
import mongoose from "mongoose";

export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("items");
    if (!carts.length) {
      return res.status(404).json({ message: "No carts found" });
    }
    return res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const cart = await Cart.findOne({ userId }).populate("items");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar si el carrito ya existe para el usuario
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Si el carrito no existe, crearlo vacío
      cart = new Cart({ userId, items: [] });
    }

    // Guardar el carrito (si estaba vacío al inicio, se crea con un array vacío)
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
  
  export const upsertCart = async (req, res) => {
    const { userId } = req.params;
    const { items } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Actualizamos los productos en el carrito con las cantidades enviadas desde el frontend
        items.forEach(newItem => {
            const existingItemIndex = cart.items.findIndex(
                item => item.productId === newItem.productId
            );

            if (existingItemIndex > -1) {
                // Reemplazamos la cantidad con la que viene desde el frontend en lugar de sumarla
                cart.items[existingItemIndex].quantity = newItem.quantity;
            } else {
                cart.items.push(newItem);
            }
        });

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error while upserting cart' });
    }
};

  
export const removeProductFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Verificar si el producto existe en el carrito
    const productExists = cart.items.some(item => item.productId.toString() === productId);
    if (!productExists) {
      return res.status(400).json({ message: "Product not found in the cart" });
    }

    // Eliminar el producto del carrito
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    await cart.save();

    // Popular los productos en la respuesta si necesitas detalles adicionales
    const updatedCart = await cart.populate("items.productId");

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
