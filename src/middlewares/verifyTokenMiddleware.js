import { verifyToken } from "../utils/verifyToken.js";

export const verifyTokenMiddleware = (req, res, next) => {
    
    try {

        // lee el token de la sesion del backend
        // const token = req.session.token

        const authHeader = req.headers.authorization;

        console.log({authHeader})

        if(!authHeader || !authHeader.startsWith("Bearer ") ){
            return res.status(400).json({ message: "Token de acceso no proporcionado" })
        }

        //Separamos bearer del resto del token, y tomamos solo el token
        const token = authHeader.split(" ")[1];

        //el mismo sistema que lo firmo tiene que verificar que sea valido el token
        const decoded = verifyToken(token)

        console.log({decoded})

        //guardamos en el request el usuario
        req.user = decoded

        //si esta todo bien pasamos al controlador
        next();    

    } catch (error) {
        return res.status(400).json({message: "Token de acceso invalido", error})
    }
}