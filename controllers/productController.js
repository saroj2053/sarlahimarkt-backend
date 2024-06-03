const Product = require("../models/ProductModel");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("../cloudinary/index");
const fs = require("fs");

// create new product  ---> Admin
exports.createProduct = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.files);

  const {
    productName,
    brand,
    description,
    category,
    stock,
    price,
    sellingPrice,
  } = req.body;

  try {
    if (!productName) {
      return res.status(400).json({ message: "Product Name is required" });
    }

    if (!brand) {
      return res.status(400).json({ message: "Product Brand is required" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: "Product Description is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Product Category is required" });
    }
    if (!stock) {
      return res
        .status(400)
        .json({ message: "Please specify quantity of stock" });
    }

    if (!price || !sellingPrice) {
      return res.status(400).json({ message: "MRP and SP is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select atleast one product image" });
    }

    const imageUrls = [];

    // Traversing through the files obtained after the multer processing
    for (const file of req.files) {
      // console.log(file.path);
      // const result = await cloudinary.uploader.upload(file.path, {
      //   folder: "SarlahiMarkt/ProductPics",
      // });

      // console.log(result);

      // // Storing the cloudinary image urls into imageUrls array
      // imageUrls.push(result.secure_url);

      // // Deleting the local file
      // fs.unlink(file.path, (err) => {
      //   if (err) console.error("Failed to delete local file:", err);
      // });

      try {
        console.log(`Uploading file: ${file.path}`);
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "SarlahiMarkt/ProductPics",
        });

        console.log(result);

        // Storing the Cloudinary image URLs into imageUrls array
        imageUrls.push(result.secure_url);

        // Deleting the local file
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to delete local file:", err);
        });
      } catch (uploadError) {
        console.error(`Failed to upload file: ${file.path}`, uploadError);
        return res.status(500).json({
          status: "fail",
          message: "Something went wrong during file upload",
          error: uploadError.message,
        });
      }
    }

    console.log(imageUrls);

    const productData = {
      productName,
      brand,
      description,
      category,
      stock,
      price,
      sellingPrice,
      productImages: imageUrls,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      status: "success",
      product,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      err,
    });
  }
};

// retrieve all products
exports.getAllProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query;
    return res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      numOfProducts: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      err,
    });
  }
};

//get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.body.category;
    const products = await Product.find({ category: category });
    res.status(200).json({
      status: "success",
      message: "Similar products found",
      products: products,
    });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

// retrieve single product based on id
exports.getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: `${req.params.id} details retrieved successfully`,
        product,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      err,
    });
  }
};

//search product
exports.searchProduct = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const regex = new RegExp(searchTerm, "i", "g");

    const products = await Product.find({
      $or: [
        { productName: regex },
        { brand: regex },
        { description: regex },
        { category: regex },
      ],
    });

    res.status(200).json({
      status: "success",
      products: products,
      message: `Products relevant to ${searchTerm}`,
    });
  } catch (error) {
    console.log("Error in searchProduct controller", error.message);
    res.status(500).josn({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// update Product ---> Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      description,
      category,
      stock,
      price,
      sellingPrice,
    } = req.body;
    if (!productName) {
      return res.status(400).json({ message: "Product Name is required" });
    }

    if (!brand) {
      return res.status(400).json({ message: "Product Brand is required" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: "Product Description is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Product Category is required" });
    }
    if (!stock) {
      return res
        .status(400)
        .json({ message: "Please specify quantity of stock" });
    }

    if (!price || !sellingPrice) {
      return res.status(400).json({ message: "MRP and SP is required" });
    }

    const productData = {
      productName,
      brand,
      description,
      category,
      stock,
      price,
      sellingPrice,
    };

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

// delete Product --> Admin
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};
