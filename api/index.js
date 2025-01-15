import express from "express";
import bodyParser from "body-parser";
import { PORT } from "../src/config.js";
import { connectDB } from "../src/db.js";
import userRoute from "../src/routes/userRoute.js";
import categoryRoute from "../src/routes/categoryRoute.js";
import productRoute from "../src/routes/productRoute.js";
import cors from "cors"
import cookieParser from 'cookie-parser'
import session from "express-session"

//Ejecucion de express
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

//Middleware

//Parsea a json las solicitudes
app.use(bodyParser.json());

//Habilitando lectura de las cookies
app.use(cookieParser())

//Parsea cuerpo de la solicitud para que pueda ser leida - querystring
app.use(bodyParser.urlencoded({ extended: true }));

//Generamos el uso de la sesion 
app.use(
  session({
    secret: "secret",
    resave: false, //evita que la sesion se vuelva a guardar si no hay datos,
    saveUninitialized: false, //evita que se guarde una sesion no inicializada
  })
)

//Conexion a la base de datos
connectDB();

//Rutas
//  http://localhost:3000/api/user
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

//Siempre tiene que ir ultimo
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
