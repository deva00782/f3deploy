import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function UploadProduce() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    produce: "",
    quantity: "",
    price: "",
  });
  

  const [mandiPrice, setMandiPrice] = useState(null);
  const [priceValid, setPriceValid] = useState(true);
  const [image, setImage] = useState(null);

  const selectedState = localStorage.getItem("selectedState");

  useEffect(() => {
  const delay = setTimeout(() => {
    if (formData.produce && selectedState) {
      fetchMandiPrice();
    }
  }, 800);

  return () => clearTimeout(delay);
}, [formData.produce]);

  const fetchMandiPrice = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/agmarket-prices?commodity=${formData.produce}&state=${selectedState}`
      );

      if (res.data.price_per_kg) {
        setMandiPrice(parseFloat(res.data.price_per_kg));
      }
    } catch (error) {
      console.log("Error fetching mandi price");
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedData = { ...formData, [name]: value };

  // ✅ When quantity changes → auto update minimum price
  if (name === "quantity" && mandiPrice) {
    const calculatedTotal =
      parseFloat(value || 0) * parseFloat(mandiPrice);

    updatedData.price = calculatedTotal.toFixed(2);
  }

  // ✅ Validate that entered price is not below minimum
  if (name === "price" && mandiPrice && updatedData.quantity) {
    const minTotal =
      parseFloat(updatedData.quantity) * parseFloat(mandiPrice);

    if (parseFloat(value) < minTotal) {
      setPriceValid(false);
    } else {
      setPriceValid(true);
    }
  }

  setFormData(updatedData);
};
 const handleSubmit = async (e) => {
  e.preventDefault();

  const pricePerKg =
    parseFloat(formData.price) / parseFloat(formData.quantity);

  if (pricePerKg < parseFloat(mandiPrice)) {
    alert("Price cannot be below Mandi Price per Kg");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name);
  data.append("place", formData.place);
  data.append("produce", formData.produce);
  data.append("quantity", formData.quantity);
  data.append("price", formData.price);
  data.append("state", selectedState);
  data.append("image", image);

  try {
    await axios.post(
      `${API_BASE_URL}/upload-produce`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert("Produce Uploaded Successfully!");
    navigate("/marketplace");

  } catch (err) {
    console.log(err);
  }
};
const minimumTotalPrice =
  mandiPrice && formData.quantity
    ? parseFloat(mandiPrice) * parseFloat(formData.quantity)
    : 0;
  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleSubmit}>
        <h2 style={heading}>📦 Upload Produce</h2>

        <input
          type="text"
          name="name"
          placeholder="Farmer Name"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="place"
          placeholder="Place"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="produce"
          placeholder="Produce Name"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity (kg)"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        {/* Price Field */}
        <input
  type="number"
  name="price"
  value={formData.price}
  min={minimumTotalPrice}
  onChange={handleChange}
  style={{
    ...inputStyle,
    borderColor: priceValid ? "#ccc" : "red",
  }}
  required
/>
        <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  style={inputStyle}
/>

        {/* Mandi Info */}
        {/* Mandi Price Section */}
{mandiPrice ? (
  <div style={{ marginBottom: "15px", textAlign: "left" }}>
    <small>
      Mandi Price: ₹{mandiPrice} /kg
    </small>

    {formData.quantity && (
      <div style={{ marginTop: "8px", fontWeight: "600" }}>
        Minimum Total Price for {formData.quantity} kg: ₹
        {(parseFloat(mandiPrice) * parseFloat(formData.quantity)).toFixed(2)}
      </div>
    )}
  </div>
) : null}
        {/* Safe Indicator */}
        {formData.price && priceValid && mandiPrice && (
          <div style={safeStyle}>
            ↑ Safe Price
          </div>
        )}

        {!priceValid && (
          <div style={errorStyle}>
            Price must be equal or above Mandi Price
          </div>
        )}

        <button
          type="submit"
          style={{
            ...buttonStyle,
            backgroundColor: priceValid ? "#2ecc71" : "#ccc",
            cursor: priceValid ? "pointer" : "not-allowed",
          }}
          disabled={!priceValid}
        >
          Submit Produce
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #2a9d8f, #1d3557)",
};

const cardStyle = {
  background: "#ffffff",
  padding: "40px",
  borderRadius: "20px",
  width: "400px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
};

const heading = {
  textAlign: "center",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
  color: "white",
  transition: "0.3s",
};

const safeStyle = {
  color: "green",
  fontWeight: "600",
  marginBottom: "10px",
};

const errorStyle = {
  color: "red",
  marginBottom: "10px",
  fontSize: "14px",
};

export default UploadProduce;