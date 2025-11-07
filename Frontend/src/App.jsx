import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Blog from './Pages/Blog/BlogListPage.jsx'
import AboutUs from './Pages/AboutUs/aboutUs'
import Support from './Pages/Support/support'
import StoreLocator from './Pages/StoreLocator/storeLocator'
import Account from './Pages/account/account'
import Login from './Pages/account/login'
import Signup from './Pages/account/signup'
import ProtectedRoute from "./Components/ProtectedRoute";
import ProductDetails from './Pages/productDetails.jsx'
import ProductsPage from './Pages/ProductsPage.jsx'
import BlogDetailPage from './Pages/Blog/BlogDetailPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/storeLocator" element={<StoreLocator />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </>
  );
}

export default App