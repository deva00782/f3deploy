import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Address() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    house: "",
    road: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* SEND NOTIFICATION */

  const handleFinalBuy = async () => {

  const checkoutItems =
    JSON.parse(
      localStorage.getItem("checkoutItems")
    ) || [];

  if (checkoutItems.length === 0) {
    console.log("No items to notify");
    return;
  }

  try {

    const response = await fetch(
      `${API_BASE_URL}/add-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          state: form.state,
          city: form.city,
          house: form.house,
          road: form.road,
          items: checkoutItems
        })
      }
    );

    const data = await response.json();

    console.log("Notification response:", data);

  } catch (error) {

    console.log(
      "Notification error:",
      error
    );

  }

};

  /* PAYMENT */

  const handlePayment = async () => {

    const items =
      JSON.parse(
        localStorage.getItem("checkoutItems")
      ) || [];

    if (items.length === 0) {

      alert("No items to pay");

      return;

    }

    try {

      await axios.post(
        `${API_BASE_URL}/transaction`,
        {
          customer_name: form.name,
          produce: items[0].produce,
          quantity: items[0].cartQuantity,
          total_price: items[0].price,
          payment_method: "UPI"
        }
      );

      await handleFinalBuy();

      alert("Payment Successful");

      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutItems");

      navigate("/marketplace");

    } catch (error) {

      console.log("Payment error:", error);

      alert("Payment Failed");

    }

  };

  return (

    <div style={containerStyle}>

      <h2>Address Details</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
      />

      <input
        name="pincode"
        placeholder="Pincode"
        onChange={handleChange}
      />

      <input
        name="state"
        placeholder="State"
        onChange={handleChange}
      />

      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
      />

      <input
        name="house"
        placeholder="House No / Building"
        onChange={handleChange}
      />

      <input
        name="road"
        placeholder="Road / Area"
        onChange={handleChange}
      />

      <button
        style={buyButtonStyle}
        onClick={handlePayment}
      >
        Pay Now
      </button>

    </div>

  );

}

const containerStyle = {
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const buyButtonStyle = {
  marginTop: "20px",
  padding: "14px 28px",
  background: "#ff6f00",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

export default Address;