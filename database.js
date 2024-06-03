const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    if (!conn) {
      console.log("Awaiting connection to mongodb...");
    } else {
      console.log(
        `Successfully connected to mongodb at ${conn.connection.host}`.underline
          .italic.yellow
      );
    }
  } catch (err) {
    console.log(err);
  }
};

connectDB();
