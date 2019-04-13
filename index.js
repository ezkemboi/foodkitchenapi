// External imports
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Local modules import 
import { Product, User } from './models';

const app = express();
const PORT = 5000;

// Set up body parser for parsing arguments
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/gennaskitchen', {
    useNewUrlParser: true
});

// Set up router endpoint
app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Welcome to Gennas Kitchen"
    });
});

// Sign up to the system
app.post('/register', (req, res) => {
    let newUser = new User();
    newUser.firstname = req.body.firstname;
    newUser.surname = req.body.surname;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.save(err => {
        if(err) {
            res.send(err)
        }
        res.status(201).send({
            success: true,
            message: "You have registered successfully",
            data: newUser
        });
    })
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    res.status(200).send({
        success: true,
        message: "You have logged in successfully",
    });
});

// Get all items in store
app.get('/products', (req, res) => {
    Product.find((err, products) => {
        if (err) {
            res.send(err)
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
    })
});

// Add food to the list of products
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    let newProduct = new Product();
    newProduct.name = name;
    newProduct.price = price;
    newProduct.save(err => {
        if (err) {
            res.send(err)
        }
        res.status(201).send({
            success: true,
            message: "Product added successfully",
        });
    });
});

// Get a single item
app.get('/products/:id', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Product retrieved successfully",
    });
});

// Update a single item
app.put('/products/:id', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Product updated successfully",
    });
});

// Delete a single item
app.delete('/products/:id', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Product deleted successfully",
    });
});


app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
});
