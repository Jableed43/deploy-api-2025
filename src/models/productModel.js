import mongoose from "mongoose";

//Podes asignar en el required un mensaje de "error" para explicar porque el valor
//Es invalido. Como segundo parametro el mensaje [true, "Name field is required"]

export const statusEnum = ["AVAILABLE", "NOT AVAILABLE", "DISCONTINUED"];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    minLength: 3,
    maxLength: 30,
    unique: true,
    lowercase: true,
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "Price field is required"],
    min: [0, "Price field has to be a number"],
  },

  profitRate: {
    type: Number,
    default: 1.21,
    min: [1, "Profit rate must be grater than or equal to 1"],
  },

  description: {
    type: String,
    minLength: 5,
    maxLength: 100,
  },

  status: {
    type: String,
    validate: {
      validator: function (status) {
        return statusEnum.includes(status);
      },
      message: props => `${props.value} is not a valid status`,
    },
    required: true, // Opcional: asegura que el campo sea obligatorio
    enum: statusEnum, // Validador nativo de Mongoose
  },
  
  quantity: {
    type: Number,
    required: true, // Opcional: asegura que el campo sea obligatorio
    min: 0, // Opcional: asegura que no sea un número negativo
  },

  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },

  highlighted: {
    type: Boolean,
    default: false,
  },

  creationDate: {
    type: Date,
    default: Date.now(),
  },

  stock: {
    type: Number,
    default: 0,
  },
});

//Esta funcion queda guardada en el modelo y cuando la necesitamos la usamos
//No se ejecuta automaticamente, entonces la incluimos donde necesitamos restar stock
productSchema.methods.decreaseStock = function (amount) {
  if (this.stock < amount) {
    throw new Error("Not enough stock available");
  }
  this.stock -= amount;
  return this.save();
};

//Virtual permite generar un valor virtual sin haberlo escrito en el esquema
//Esto facilita mucho porque podemos hacer calculos con nuestros propios valores

productSchema.virtual("priceWithProfitRate").get(function () {
  return this.price * this.profitRate;
});

//Habilita valores virtuales en json y objetos
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("product", productSchema);
