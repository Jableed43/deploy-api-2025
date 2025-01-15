import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

//Crear la conexion con la base de datos

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to database", error);
    //Si falla, tenemos que salir de esta ejecucion
    process.exit(1);
  }
};
