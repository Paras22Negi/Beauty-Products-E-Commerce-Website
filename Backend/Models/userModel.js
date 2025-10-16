const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const dbConnect = require('../dbConfig');
dbConnect();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minimum: 3,
    maximum: 20,
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);