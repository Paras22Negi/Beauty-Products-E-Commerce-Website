const express = require('express');
const cors = require('cors');
const mainRoutes = require('./Routes/routes');
require("dotenv").config();
const Port = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', mainRoutes)

app.listen(Port, ()=>{
    console.log(`server is running on ${Port}`)
})