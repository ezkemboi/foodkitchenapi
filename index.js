// External imports
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import Sequelize from "sequelize";
import path from "path";

// Local modules import
// import { Product, User } from "./models";

// import mongoose from 'mongoose';

const dbPath = path.resolve(__dirname, "gennaskitchen.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath
});

// Create tables
const User = sequelize.define(
  "user",
  {
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    // options
  }
);

const Product = sequelize.define(
  "product",
  {
    // attributes
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  },
  {
    // options
  }
);

const app = express();
const PORT = process.env.PORT || 5000;

// Set up body parser for parsing arguments
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());

// Connect to MongoDB database
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gennaskitchen",
//   {
//     useNewUrlParser: true
//   }
// );

// Set up router endpoint
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Welcome to Gennas Kitchen"
  });
});

// Sign up to the system
app.post("/register", async (req, res) => {
  const { firstName, surname, email, username, password } = req.body;
  // check if user with email exist
  const existingUserEmail = await User.findOne({ where: { email: email } });
  // Check if username already in existence
  const existingUserUsername = await User.findOne({
    where: { username: username }
  });
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
  const newUser = await User.create({
    // Create new user and save
    firstName: firstName,
    surname: surname,
    email: email,
    username: username,
    password: hashedPassword
  });
  const data = {
    firstName: newUser.firstName,
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

// Login to the system
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ where: { username: username } });
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
app.get("/products", async (req, res) => {
  const allProducts = await Product.findAll();
  if (!allProducts || allProducts.length < 1) {
    res.status(404).send({
      success: false,
      message: "There are no products available at the moment"
    });
  }

  res.status(200).send({
    success: true,
    message: "Products retrieved successfully",
    data: allProducts
  });
});

// Add food to the list of products
app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  const findProduct = await Product.findOne({ where: { name: name } });
  if (findProduct) {
    // Let the user to know product already exist. Can update price or quantity in future
    res.status(409).send({
      success: false,
      message: "The product already exist"
    });
  } else {
    const newProduct = await Product.create({
      name: name,
      price: price
    });
    res.status(201).send({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });
  }
});

// Get a single item
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const findProduct = await Product.findOne({ where: { id } });
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
  const findAndUpdateProduct = await Product.update(
    { name: name, price: price },
    { where: { id } }
  );
  if (!findAndUpdateProduct) {
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
  const findProduct = await Product.destroy({ where: { id: id } });
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

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync().done();

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
