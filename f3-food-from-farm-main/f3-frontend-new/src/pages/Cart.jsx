import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const navigate = useNavigate();

  /* =========================
     LOAD CART FROM STORAGE
  ========================== */

  useEffect(() => {

    const stored =
      localStorage.getItem("cart");

    try {

      const parsed =
        stored
          ? JSON.parse(stored)
          : [];

      if (Array.isArray(parsed)) {

        setCartItems(parsed);

      } else {

        setCartItems([]);

      }

    } catch (error) {

      setCartItems([]);

    }

  }, []);

  /* =========================
     UPDATE STORAGE
  ========================== */

  const updateStorage = (updatedCart) => {

    setCartItems(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };

  /* =========================
     INCREASE QUANTITY
  ========================== */

  const increaseQty = (index) => {

    const updated =
      [...cartItems];

    const maxStock =
      Number(
        updated[index].quantity
      );

    if (
      updated[index]
        .cartQuantity < maxStock
    ) {

      updated[index]
        .cartQuantity += 1;

      updateStorage(updated);

    } else {

      alert(
        "Cannot exceed available stock"
      );

    }

  };

  /* =========================
     DECREASE QUANTITY
  ========================== */

  const decreaseQty = (index) => {

    const updated =
      [...cartItems];

    if (
      updated[index]
        .cartQuantity > 1
    ) {

      updated[index]
        .cartQuantity -= 1;

      updateStorage(updated);

    }

  };

  /* =========================
     REMOVE ITEM
  ========================== */

  const removeItem = (index) => {

    const updated =
      [...cartItems];

    updated.splice(index, 1);

    updateStorage(updated);

  };

  /* =========================
     BUY NOW
  ========================== */

  const buyNow = (item) => {

    setCheckoutItem(item);

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify([item])
    );

    setTimeout(() => {

      document
        .getElementById(
          "checkout-section"
        )
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }, 200);

  };

  /* =========================
     PAYMENT
  ========================== */

  const handlePayment = async () => {

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    if (cart.length === 0) {

      alert("Cart is empty");

      return;

    }

    try {

      await axios.post(
        `${API_BASE_URL}/transaction`,
        {
          customer_name:
            "Customer",

          produce:
            cart[0].produce,

          quantity:
            cart[0].cartQuantity,

          total_price:
            cart[0].price,

          payment_method:
            "UPI"
        }
      );

      alert(
        "Payment Successful"
      );
      await axios.post(
  `${API_BASE_URL}/add-notification`,
  {
    customerName: "Customer",
    phone: "1234567890",
    state: "Telangana",
    city: "Hyderabad",
    house: "House 12",
    road: "Main Road",
    items: cart
  }
);

      localStorage.removeItem(
        "cart"
      );

      navigate(
        "/marketplace"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Payment Failed"
      );

    }

  };

  /* =========================
     TOTAL CALCULATION
  ========================== */

  const totalAmount =
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            item.cartQuantity *
              (
                parseFloat(item.price) /
                parseFloat(item.quantity)
              ),
          0
        )
      : 0;

  return (

    <div style={pageStyle}>

      <h1 style={heading}>
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (

        <p style={{
          textAlign: "center"
        }}>
          Cart is empty
        </p>

      ) : (

        <>

          {/* PRODUCTS GRID */}

          <div style={gridStyle}>

            {cartItems.map(
              (item, index) => (

                <div
                  key={index}
                  style={cardStyle}
                >

                  {/* DELETE */}

                  <div
                    style={menuWrapper}
                  >

                    <span
                      onClick={() =>
                        removeItem(index)
                      }
                      style={deleteOption}
                    >
                      ⋮ Delete
                    </span>

                  </div>

                  {/* IMAGE */}

                  {item.image && (

                    <img
                      src={`${API_BASE_URL}${item.image}`}
                      alt={item.produce}
                      style={imageStyle}
                    />

                  )}

                  <h3>
                    {item.produce}
                  </h3>

                  <p>
                    <strong>
                      Farmer:
                    </strong>
                    {item.name}
                  </p>

                  <p>
                    <strong>
                      Place:
                    </strong>
                    {item.place}
                  </p>

                  <p>
                    <strong>
                      State:
                    </strong>
                    {item.state}
                  </p>

                  {/* QUANTITY */}

                  <div style={qtyBox}>

                    <button
                      onClick={() =>
                        decreaseQty(index)
                      }
                      style={qtyBtn}
                    >
                      −
                    </button>

                    <span
                      style={qtyNumber}
                    >
                      {item.cartQuantity} kg
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(index)
                      }
                      style={qtyBtn}
                    >
                      +
                    </button>

                  </div>

                  {/* PRICE */}

                  <div style={priceTag}>

                    ₹ {
                      (
                        (
                          parseFloat(item.price) /
                          parseFloat(item.quantity)
                        ) *
                        item.cartQuantity
                      ).toFixed(2)
                    }

                  </div>

                  {/* BUY NOW */}

                  <button
                    style={buyBtn}
                    onClick={() =>
                      buyNow(item)
                    }
                  >
                    Buy Now
                  </button>

                </div>

              )
            )}

          </div>

          {/* TOTAL */}

          <div style={totalBox}>

            Total: ₹ {
              totalAmount.toFixed(2)
            }

          </div>

          {/* CHECKOUT */}

          {checkoutItem && (

            <div
              id="checkout-section"
              style={checkoutStyle}
            >

              <h2>
                Order Summary
              </h2>

              <h3>
                Total Amount:
                ₹ {
                  totalAmount.toFixed(2)
                }
              </h3>

              <button
                style={nextBtn}
                onClick={() =>
                  navigate("/address")
                }
              >
                Next
              </button>

              {/* PAY NOW */}

             

            </div>

          )}

        </>

      )}

    </div>

  );

}

/* ================= STYLES ================= */

const pageStyle = {
  padding: "40px",
  minHeight: "100vh",
  background:
    "linear-gradient(to bottom, #eef5f7, #ffffff)"
};

const heading = {
  textAlign: "center",
  marginBottom: "30px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "25px"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.08)",
  position: "relative"
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "15px"
};

const qtyBox = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  margin: "15px 0"
};

const qtyBtn = {
  padding: "6px 12px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#2a9d8f",
  color: "white"
};

const qtyNumber = {
  fontWeight: "600"
};

const priceTag = {
  background: "#2ecc71",
  color: "white",
  padding: "8px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "600",
  marginBottom: "10px"
};

const buyBtn = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1d3557",
  color: "white",
  cursor: "pointer"
};

const totalBox = {
  marginTop: "30px",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "700"
};

const menuWrapper = {
  position: "absolute",
  top: "10px",
  right: "10px"
};

const deleteOption = {
  cursor: "pointer",
  color: "red",
  fontSize: "14px"
};

const checkoutStyle = {
  marginTop: "60px",
  padding: "40px",
  background: "#ffffff",
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
  textAlign: "center"
};

const nextBtn = {
  marginTop: "20px",
  padding: "12px 30px",
  borderRadius: "10px",
  border: "none",
  background: "#ff6f00",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

const payBtn = {
  marginTop: "15px",
  padding: "12px 30px",
  borderRadius: "10px",
  border: "none",
  background: "#2e7d32",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

export default Cart;