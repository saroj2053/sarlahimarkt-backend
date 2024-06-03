const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: [
      {
        firstName: {
          type: String,
          required: true,
        },

        lastName: {
          type: String,
          required: true,
        },

        company: String,

        address1: {
          type: String,
          required: true,
        },

        address2: String,

        city: String,

        country: {
          type: String,
          required: true,
        },

        postalCode: {
          type: String,
          required: true,
        },

        phone: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
