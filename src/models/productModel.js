import mongoose from "mongoose";

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
    min: [1, "Profit rate must be greater than or equal to 1"],
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
    enum: statusEnum,
  },
  
  quantity: {
    type: Number,
    required: true,
    min: 0,
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

productSchema.methods.decreaseStock = function (amount) {
  if (this.stock < amount) {
    throw new Error("Not enough stock available");
  }
  this.stock -= amount;
  return this.save();
};

productSchema.virtual("priceWithProfitRate").get(function () {
  return this.price * this.profitRate;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("product", productSchema);
