const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    productImages: [],

    stock: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    // rating: {
    //   type: Number,
    //   default: 0,
    // },

    // images: [
    //   {
    //     public_id: {
    //       type: String,
    //       required: true,
    //     },
    //     url: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],

    // numOfReviews: {
    //   type: Number,
    //   default: 0,
    // },

    // reviews: [
    //   {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     rating: {
    //       type: Number,
    //       required: true,
    //     },
    //     comment: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],

    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
