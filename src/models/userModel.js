import mongoose from "mongoose";
import { isGoodPassword } from "../utils/validators.js";
import bcrypt from "bcrypt"

//Faltaria encriptacion y categoria de usuario

export const rolesEnum = ["ADMIN", "MERCHANT", "CLIENT"];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  lastName: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 6,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
  },

  age: {
    type: Number,
    required: true,
    min: 16,
    max: 110,
  },

  registrationDate: {
    type: Date,
    default: Date.now(),
  },

  password: {
    required: true,
    type: String,
    validate: {
      validator: function (value) {
        return isGoodPassword(value);
      },
      message:
        "Password must be between 6 and 12 characters, with at least one number, one upercase letter and one lowercase letter",
    },
  },

  role: {
    type: String,
    validate: {
      validator: function (role) {
        return rolesEnum.includes(role);
      },
      message: props => `${props.value} is not a valid role`,
    },
    required: true, // Opcional: asegura que el campo sea obligatorio
    enum: rolesEnum, // Esto asegura que el valor esté dentro de los permitidos
  },
});

userSchema.pre("save", function (next) {
  //encriptamos la password antes de guardarla
  this.password = bcrypt.hashSync(this.password, 10)
  //Esta funcion next permite dar el proximo paso si el proceso ha salido bien
  //de lo contrario retorna un error
  next()
})

export default mongoose.model("user", userSchema);
