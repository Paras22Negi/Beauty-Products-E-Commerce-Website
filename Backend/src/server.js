import express from 'express';
import cors from 'cors';
import UserRoutes from './Routes/User.Routes.js';
import ProductRoutes from './Routes/Product.Routes.js';
import connectDB from './config/db.Config.js';
import dotenv from 'dotenv';
dotenv.config();
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

app.use('/api', UserRoutes)
app.use('/api', ProductRoutes)

app.listen(Port, async()=>{
  await connectDB();
  console.log(`server is running on ${Port}`)
})