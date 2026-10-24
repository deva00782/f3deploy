import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

import AgMarket from "./pages/AgMarket";
import Cart from "./pages/Cart";
import Address from "./pages/Adress";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import FarmerDashboard from "./pages/FarmerDashboard";
import UploadProduce from "./pages/UploadProduce";
import Notifications from "./pages/Notifications";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const location = useLocation();
  const [role, setRole] = useState(null);

  return (
    <>
      {/* Hide Navbar only on Home */}
      {location.pathname !== "/" && location.pathname !== "" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadProduce />} />
        <Route path="/agmarket" element={<AgMarket />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route
          path="/login"
          element={<Login setRole={setRole} />}
        />

        {/* ✅ Marketplace accessible for both farmer & consumer */}
        <Route
          path="/marketplace"
          element={
            role ? (
              <Marketplace />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Dashboard only for farmer */}
        <Route
          path="/dashboard"
          element={
            role === "farmer" ? (
              <FarmerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;