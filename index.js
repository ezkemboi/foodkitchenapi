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
    })
});


app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
});
