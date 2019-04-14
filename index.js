// External imports
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Local modules import
import { Product, User } from "./models";

const app = express();
const PORT = process.env.PORT || 5000;

// Set up body parser for parsing arguments
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Connect to MongoDB database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gennaskitchen",
  {
    useNewUrlParser: true
  }
);

// Set up router endpoint
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Welcome to Gennas Kitchen"
  });
});

// Sign up to the system
app.post("/register", async (req, res) => {
  let newUser = new User();
  const { firstname, surname, email, username, password } = req.body;
  // check if user with email exist
  const existingUserEmail = await User.findOne({ email });
  // Check if username already in existence
  const existingUserUsername = await User.findOne({ username });
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  if (existingUserEmail) {
    res.status(409).send({
      success: false,
      message: "User with that email already exist"
    });
  }
  // Existing user by username
  if (existingUserUsername) {
    res.status(409).send({
      success: false,
      message: "User with that username already exist"
    });
  }
  // Create new user and save
  newUser.firstname = firstname;
  newUser.surname = surname;
  newUser.email = email;
  newUser.username = username;
  newUser.password = hashedPassword;
  newUser.save(err => {
    if (err) {
      res.send(err);
    }
    // Exclude password from json data
    const data = {
      firstname: newUser.firstname,
      surname: newUser.surname,
      email: newUser.email,
      username: newUser.username
    };
    res.status(201).send({
      success: true,
      message: "You have registered successfully",
      data
    });
  });
});

// Login to the system
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });
  if (!findUser) {
    res.status(404).send({
      success: false,
      message: "User does not exist"
    });
  }
  // Compare password with hashed one
  const comparePassword = bcrypt.compareSync(password, findUser.password);
  if (!comparePassword) {
    res.status(400).send({
      success: true,
      message: "You have provided wrong password"
    });
  }
  res.status(200).send({
    success: true,
    message: "You have logged in successfully"
  });
});

// Get all items in store
app.get("/products", (req, res) => {
  Product.find((err, products) => {
    if (err) {
      res.send(err);
    }
    if (!products || products.length < 1) {
      res.status(404).send({
        success: false,
        message: "There are no products available at the moment"
      });
    }
    res.status(200).send({
      success: true,
      message: "Products retrieved successfully",
      data: products
    });
  });
});

// Add food to the list of products
app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  const findProduct = await Product.findOne({ name });
  if (findProduct) {
    // Let the user to know product already exist. Can update price or quantity in future
    res.status(409).send({
      success: false,
      message: "The product already exist"
    });
  }
  const newProduct = new Product();
  newProduct.name = name;
  newProduct.price = price;
  newProduct.save(err => {
    if (err) {
      res.send(err);
    }
    res.status(201).send({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });
  });
});

// Get a single item
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const findProduct = await Product.findOne({ _id: id });
  if (!findProduct) {
    res.status(404).send({
      success: false,
      message: "Product does not exist"
    });
  }
  res.status(200).send({
    success: true,
    message: "Product retrieved successfully",
    data: findProduct
  });
});

// Update a single item
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  //  Find product and update it
  const findProduct = await Product.findOneAndReplace(
    { _id: id },
    { name, price }
  );
  if (!findProduct) {
    res.status(404).send({
      success: false,
      message: "Product does not exist"
    });
  }
  res.status(200).send({
    success: true,
    message: "Product updated successfully",
    data: { name, price }
  });
});

// Delete a single item
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const findProduct = await Product.findOneAndDelete({ _id: id });
  if (!findProduct) {
    res.status(404).send({
      success: false,
      message: "Product does not exist"
    });
  }
  res.status(200).send({
    success: true,
    message: "Product deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
