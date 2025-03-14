import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItemModel.js";

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
    const { productId, quantity } = req.body;
    const { userId } = req.params;
    
    try {
      let cart = await Cart.findOne({ userId }).populate("items");
      
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      
      let existingItem = cart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return res.status(404).json({ message: "To add more of the same product, use the updateCart endpoint" });
      } else {
        const newItem = await CartItem.create({ productId, quantity });
        cart.items.push(newItem._id);
      }
  
      await cart.save();
      
      return res.status(200).json(await cart.populate("items"));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
  

  export const updateCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId }).populate("items");
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      let existingItem = cart.items.find((item) => item.productId === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;  // 🔥 SUMAMOS en lugar de sobrescribir
        await existingItem.save();
      } else {
        return res.status(404).json({ message: "Product not found in your cart" });
      }
  
      await cart.save();
      return res.status(200).json(await cart.populate("items"));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
  

  export const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    try {
      // Buscar el carrito del usuario
      const cart = await Cart.findOne({ userId }).populate("items");
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const productExists = cart.items.some((item) => item.productId === productId);
      if (!productExists) {
        return res.status(400).json({ message: "Product not found in the cart" });
      }
  
      cart.items = cart.items.filter((item) => item.productId !== productId);
      await cart.save();
  
      return res.status(200).json(await cart.populate("items"));
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
