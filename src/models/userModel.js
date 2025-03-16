import mongoose from "mongoose";
import { isGoodPassword } from "../utils/validators.js";
import bcrypt from "bcrypt"

export const rolesEnum = ["ADMIN", "MERCHANT", "CLIENT"];

const userSchema = new mongoose.Schema({
  username: {
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
        "Password must be between 6 and 12 characters, with at least one number, one uppercase letter, and one lowercase letter",
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
    default: "CLIENT", 
    enum: rolesEnum,
  },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

export default mongoose.model("user", userSchema);
