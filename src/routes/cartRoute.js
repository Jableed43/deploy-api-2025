import { Router } from "express";
import {
  getCarts,
  getCart,
  removeProductFromCart,
  clearCart,
  updateCart,
  createCart,
} from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.get("/", getCarts); 
cartRouter.get("/:userId", getCart); 
cartRouter.post("/:userId", createCart); 
cartRouter.put("/:userId", updateCart); 
cartRouter.delete("/:userId/product/:productId", removeProductFromCart);
cartRouter.delete("/:userId", clearCart);

export default cartRouter;
