import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState(
    localStorage.getItem("selectedState") || ""
  );

  const handleStateChange = (e) => {
    const selected = e.target.value;

    setSelectedState(selected);

    // Save for AgMarket page
    localStorage.setItem("selectedState", selected);
  };

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  return (
    <div style={pageContainer}>
      <div style={glowStyle}></div>

      <h1 style={heading}>
        👨‍🌾 Farmer Dashboard
      </h1>

      <p style={subtitle}>
        Manage your farming activities, track market prices,
        and stay updated with alerts.
      </p>

      <div style={gridContainer}>

        {/* SELECT STATE CARD */}
        <div style={cardStyle}>

          <h3 style={cardTitle}>
            📍 Select State
          </h3>

          <select
            value={selectedState}
            onChange={handleStateChange}
            style={selectStyle}
          >
            <option value="">
              Choose Your State
            </option>

            {states.map((state, index) => (
              <option
                key={index}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>

          {selectedState && (
            <p style={selectedText}>
              Selected:{" "}
              <strong>
                {selectedState}
              </strong>
            </p>
          )}

        </div>

        {/* AGMARKET CARD */}
        <div
          style={cardStyle}
          onClick={() =>
            navigate("/agmarket")
          }
        >
          <h3 style={cardTitle}>
            📊 AgMarket Prices
          </h3>

          <p style={cardDesc}>
            View live mandi prices based on
            your selected state.
          </p>
        </div>

        {/* UPLOAD PHOTO CARD */}
        <div
          style={cardStyle}
          onClick={() =>
            navigate("/upload")
          }
        >
          <h3 style={cardTitle}>
            📷 Upload Produce
          </h3>

          <p style={cardDesc}>
            Add your crop details and list
            it in marketplace.
          </p>
        </div>

        {/* NOTIFICATIONS CARD */}
        <div
          style={cardStyle}
          onClick={() =>
            navigate("/notifications")
          }
        >
          <h3 style={cardTitle}>
            🔔 Notifications
          </h3>

          <p style={cardDesc}>
            Check important alerts and
            updates.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ================= PROFESSIONAL UI ================= */

const pageContainer = {
  padding: "80px 20px",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",

  background: "#e8f5e9",
};

const glowStyle = {
  position: "absolute",
  top: "-120px",
  left: "50%",
  transform: "translateX(-50%)",

  width: "520px",
  height: "520px",

  background: `
    radial-gradient(
      circle,
      rgba(255,255,255,0.18),
      transparent 70%
    )
  `,

  filter: "blur(100px)",

  zIndex: 0,
};
/* Heading */

const heading = {
  textAlign: "center",
  fontSize: "40px",
  fontWeight: "700",
  marginBottom: "12px",

  /* DARK GREEN TEXT */
  color: "#1b5e20",

  letterSpacing: "0.6px",
  position: "relative",
  zIndex: 1,
};
/* Subtitle */

const subtitle = {
  textAlign: "center",
  fontSize: "16px",

 color: "#4b5563",

  marginBottom: "50px",

  position: "relative",
  zIndex: 1,
};

/* Layout */

const gridContainer = {
  display: "grid",

  /* 2 cards per row */
  gridTemplateColumns: "repeat(2, 1fr)",

  gap: "24px",

  maxWidth: "1100px",

  margin: "0 auto",

  position: "relative",
  zIndex: 1,
};

/* Modern Cards */

const cardStyle = {
  background: "#ffffff",

boxShadow:
  "0 20px 45px rgba(0,0,0,0.18)",

  padding: "32px",

  borderRadius: "18px",

  border: "1px solid rgba(255,255,255,0.15)",

  

  cursor: "pointer",

  textAlign: "center",

  transition:
    "transform 0.25s ease, box-shadow 0.25s ease",

  animation:
    "slideUpFade 0.6s ease forwards, floatCard 6s ease-in-out infinite",

  opacity: 0,

  transform: "translateY(30px)",
};
/* Card Title */

const cardTitle = {
  fontSize: "22px",

  marginBottom: "14px",

  fontWeight: "600",

  color: "#1f3b2c",
};

/* Card Description */

const cardDesc = {
  fontSize: "15px",

  color: "#555",

  lineHeight: "1.6",
};

/* Select */

const selectStyle = {
  width: "100%",

  padding: "14px",

  borderRadius: "12px",

  border: "1px solid #d1d5db",

  fontSize: "15px",

  marginTop: "12px",

  outline: "none",

  background: "#ffffff",

  cursor: "pointer",
};

/* Selected Text */

const selectedText = {
  marginTop: "16px",

  fontSize: "14px",

  color: "#2c3e50",

  fontWeight: "500",
};

/* Animation */


if (typeof document !== "undefined") {
  const styleSheet =
    document.createElement("style");

  styleSheet.innerHTML = `
    @keyframes slideUpFade {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    div[style] {
      will-change: transform;
    }

    div[style]:hover {
      transform: translateY(-6px);
      box-shadow:
        0 18px 40px rgba(0,0,0,0.12),
        0 6px 12px rgba(0,0,0,0.06);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 28px !important;
      }
    }
  `;

  document.head.appendChild(styleSheet);
}

export default FarmerDashboard;