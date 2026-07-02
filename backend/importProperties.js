import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Property from "./models/propertymodel.js";

dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI); // optional for testing

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const data = JSON.parse(
      fs.readFileSync("./properties.json", "utf-8")
    );

    // Optional: delete old properties before importing
    // await Property.deleteMany({});

    await Property.insertMany(data);

    console.log("✅ Properties Imported Successfully");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });