import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProductByName,
  getProducts,
  getStatus,
  updateProduct,
} from "../controllers/productController.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const productRoute = Router();

productRoute.get("/get", getProducts);
//endpoint exclusivo para obtener los status disponibles
productRoute.get("/status",verifyTokenMiddleware, getStatus);
productRoute.post("/create", createProduct);
productRoute.get("/get-by-id/:id", verifyTokenMiddleware, findProductById);
productRoute.post("/get-by-name", verifyTokenMiddleware, findProductByName);
productRoute.put("/update/:id", updateProduct)
productRoute.delete("/delete/:id", deleteProduct)


export default productRoute;
