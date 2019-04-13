import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: String,
    price: Number
});

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    firstname: String,
    surname: String
})

export const Product = mongoose.model('Product', ProductSchema);
export const User = mongoose.model('User', UserSchema);
