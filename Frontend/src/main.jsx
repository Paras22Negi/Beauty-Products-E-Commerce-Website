import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Header from "./Pages/Header/Header.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import AddsBar from "./Pages/PromoBanner.jsx";
import Footer from "./Pages/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <div className="relative">
          {/* Fixed top bar */}
          <div className="fixed top-0 left-0 w-full z-50">
            <AddsBar />
            <Header />
          </div>

          {/* Reduced top padding to align perfectly */}
          <div className="pt-[6.25rem] sm:pt-[6.75rem] md:pt-[7rem]">
            <App />
            <Footer />
          </div>
        </div>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
