import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const categoryRoute = Router();

categoryRoute.get("/get", verifyTokenMiddleware, getCategories);
categoryRoute.post("/create", verifyTokenMiddleware, createCategory);
categoryRoute.delete("/delete/:id", verifyTokenMiddleware, deleteCategory);

export default categoryRoute;
