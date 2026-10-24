import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Navbar({ userRole }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // ✅ Sync cart count from localStorage
  useEffect(() => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  setCartCount(cartItems.length);

  fetch(`${API_BASE_URL}/notifications`)
    .then(res => res.json())
    .then(data => {
      setNotificationCount(data.length);
    })
    .catch(err => console.log(err));

}, []);
  return (
    <nav style={navbarStyle}>
      <h2 style={logoStyle}>🌱 F3 Food From Farm</h2>

      <div style={linkContainer}>
        <Link style={linkStyle} to="/">Home</Link>

        {userRole === "consumer" && (
          <>
            <Link style={linkStyle} to="/marketplace">
              Marketplace
            </Link>

            {/* 🛒 CART ICON */}
            <div
              style={cartWrapper}
              onClick={() => navigate("/cart")}
            >
              🛒
              {cartCount > 0 && (
                <span style={badgeStyle}>
                  {cartCount}
                </span>
              )}
            </div>
          </>
        )}

        {userRole === "farmer" && (
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    
    <Link style={linkStyle} to="/dashboard">
      Dashboard
    </Link>

    <span style={{ marginLeft: "8px", fontSize: "20px", position: "relative" }}>
      🔔

      {notificationCount > 0 && (
        <span style={badgeStyle}>
          {notificationCount}
        </span>
      )}

    </span>

  </div>
)}
        {!userRole && (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    
    {notificationCount > 0 && (
      <span style={{ fontSize: "20px" }}>🔔</span>
    )}

    <Link style={linkStyle} to="/login">
      Login
    </Link>

  </div>
)}
      </div>
    </nav>
  );
}

/* ================= PROFESSIONAL STYLES ================= */

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  background: "linear-gradient(135deg, #2a9d8f, #1d3557)",
  color: "white",
  position: "sticky",
  top: 0,
  zIndex: 1000,

  /* ✅ ADDED ONLY TO REMOVE BOTTOM LINE */
  borderBottom: "none",
  boxShadow: "none"
};

const logoStyle = {
  margin: 0,
  fontSize: "22px"
};

const linkContainer = {
  display: "flex",
  alignItems: "center",
  gap: "25px"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "15px"
};

const cartWrapper = {
  position: "relative",
  cursor: "pointer",
  fontSize: "22px"
};


const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "red",
  color: "white",
  borderRadius: "50%",
  padding: "3px 7px",
  fontSize: "11px",
  fontWeight: "bold"
};
export default Navbar;