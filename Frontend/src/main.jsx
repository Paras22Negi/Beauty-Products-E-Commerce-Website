import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Header from './Pages/Header.jsx'
import { Provider } from "react-redux";
import store from './redux/store.js';
import AddsBar from './Pages/PromoBanner.jsx'
import Footer from './Pages/Footer.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AddsBar />
        <Header />
        <App />
        <Footer />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
