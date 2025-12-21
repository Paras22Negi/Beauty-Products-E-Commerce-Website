import express from "express";
import cors from "cors";
import UserRoutes from "./Routes/User.Routes.js";
import ProductRoutes from "./Routes/Product.Routes.js";
import connectDB from "./config/db.Config.js";
import dotenv from "dotenv";
import CartRoutes from "./Routes/Cart.Routes.js";
import CartItemsRoutes from "./Routes/CartItems.Routes.js";
import OrderRoutes from "./Routes/Order.Routes.js";
import PaymentRoutes from "./Routes/Payment.Routes.js";
import BlogRoutes from "./Routes/Blog.Routes.js";
import CouponRoutes from "./Routes/coupon.Routes.js";
import RatingRoutes from "./Routes/Ratings.Routes.js";
import ReviewRoutes from "./Routes/Review.Routes.js";
import UserQueryRoutes from "./Routes/UserQuery.Routes.js";
import AdminOrderRoutes from "./Routes/AdminOrder.Routes.js";
import ProductAdminRoutes from "./Routes/Product.Admin.Routes.js";
import AdminRoutes from "./Routes/Admin.Routes.js";
import VideoRoutes from "./Routes/Video.Routes.js";

dotenv.config();
const Port = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/cart-items", CartItemsRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/videos", VideoRoutes);
app.use("/api/coupons", CouponRoutes);
app.use("/api/ratings", RatingRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/user-query", UserQueryRoutes);
app.use("/api/admin/orders", AdminOrderRoutes);
app.use("/api/admin/products", ProductAdminRoutes);
app.use("/api/admin/auth", AdminRoutes);

app.listen(Port, async () => {
  await connectDB();
  console.log(`server is running on ${Port}`);
});
