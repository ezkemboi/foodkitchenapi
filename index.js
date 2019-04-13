import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

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
    res.status(200).send({
        success: true,
        message: "Product added successfully",
    });
});

// Login
app.post('/login', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Product added successfully",
    });
});

// Get all items in store
app.get('/products', (req, res) => {
    const items = [
        {
            id: "00292999jghsss",
            name: "Prawn",
            price: 7.00
        },
        {
            id: "00297777hgddd0088hsss",
            name: "Crab Platter",
            price: 15.00
        },
        {
            id: "0po078888hyyyoo",
            name: "Fries",
            price: 1.50
        }
    ]
    res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: items
    });
});

// Add food to the list of products
app.post('/products', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Product added successfully",
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
