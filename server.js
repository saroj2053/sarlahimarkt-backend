const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const wishlistRouter = require("./routes/wishlistRoute");
const paymentRouter = require("./routes/PaymentRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");
const app = express();

// connecting to database
require("./database");

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// to serve static files
app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/payment", paymentRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my Ecommerce Site👋🔥</h1>");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.underline.italic.gray);
});
