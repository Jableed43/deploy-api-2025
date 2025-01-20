import User, { rolesEnum } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isGoodPassword } from "../utils/validators.js";

//Controladores: Actua como intermediario entre el cliente y la logica de la aplicacion. Recibe solicitudes, las procesa y devuelve la respuesta.
//Estos controladores incluyen a los servicios

export const createUser = async (req, res) => {
  try {
    //Tomar los datos enviados del post
    //Que llegan por body
    const userData = new User(req.body);

    //Destructuramos y obtenemos el email
    const { email, password } = userData;

    //Validar que el email no sea repetido
    const userExist = await User.findOne({ email });
    //En el objeto escribimos clave: valor, si la clave y el valor se llaman igual, podemos escribirlo una sola vez.
    //Respondemos con un codigo y mensaje
    if (userExist) {
      return res
        .status(400)
        .json({ message: `User with email: ${email} already exists` });
    }

    // const hashedPassword = bcrypt.hashSync(password, 10)

    //Si el email no existe, guardamos el usuario en la db
    await userData.save();

    //201 significa que se ha creado un recurso
    res.status(201).json({ message: "User created" });
  } catch (error) {
    //500 es un error generico del servidor
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    //Nos aseguramos que tenga datos
    if (users.length === 0) {
      //204 No Content: la petición se ha procesado con éxito, pero el resultado está vacío.
      return res.status(204).json({ message: "There are no users" });
    }
    //200 significa que la operacion ha sido exitosa
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    //De esta forma obtenemos por path param el id
    // api/user/delete/id
    const _id = req.params.id;
    //Validar si existe
    const userExist = await User.findOne({ _id });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(_id);
    return res.status(200).json({ message: "User deleted succesfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const userExist = await User.findOne({ _id });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = req.body;

    if(password){
      if(!isGoodPassword(password)){
        return res.status(400).json({
          message: "Password must be between 6 and 12 characters, with at least one number, one upercase letter and one lowercase letter"
        })
      }
      //rest son todos los datos que tiene req.body
      rest.password = bcrypt.hashSync(password, 10)
    }

    //Si utilizamos new: true, nos devolverá el registro actualizado
    // de lo contrario devuelve el registro antes de ser actualizado
    const updatedUser = await User.findByIdAndUpdate({ _id }, rest, {
      new: true,
    });

    return res.status(201).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "internal server error", error });
  }
};

export const validate = async (req, res) => {
  try {
    // Validamos que esten ambos campos necesarios
    if (!(req.body.email && req.body.password)) {
      return res.status(400).json({ message: "There's a missing field" });
    }

    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound) {
      // Return immediately after sending the response
      return res.status(400).json({ message: "User or password is incorrect" });
    }

    console.log({ userFound });

    // Comparar la password que llega del body contra la guardada en la db
    if (bcrypt.compareSync(req.body.password, userFound.password)) {
      // payload es la informacion que le cargamos al token
      const payload = {
        userId: userFound._id,
        userEmail: userFound.email,
      };

      // El token para tener validez debe ser firmado
      // sign necesita: 1. payload, 2. "secret", 3. duracion
      const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
      const role = userFound.role;

      console.log({ token, role, user: {id: userFound._id, email: userFound.email}  });

      // genera una sesion en el backend para manejar el token
      // req.session.token = token;

      return res.status(200).json({ message: "Logged in", token, role, user: {id: userFound._id, email: userFound.email} });
    } else {
      // Return immediately after sending the response
      return res.status(400).json({ message: "User or password is incorrect" });
    }

  } catch (error) {
    return res.status(500).json({ error: "internal server error", error });
  }
};

export const getRoles = async (req, res) => {
  try {
    return res.status(200).json(rolesEnum);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};