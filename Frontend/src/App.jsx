import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Blog from './Pages/Blog'
import AboutUs from './Pages/aboutUs'
import Support from './Pages/support'
import StoreLocator from './Pages/storeLocator'
import Account from './Pages/account/account'
import Login from './Pages/account/login'
import Signup from './Pages/account/signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/storeLocator" element={<StoreLocator />} />
        <Route path="/account" element={<Account />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </>
  )
}

export default App
