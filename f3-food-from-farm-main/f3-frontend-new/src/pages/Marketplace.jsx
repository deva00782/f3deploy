import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";
import { API_BASE_URL } from "../config";

function Marketplace() {

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {

    axios
      .get(`${API_BASE_URL}/products`)
      .then((res) => {

        console.log("Products:", res.data);

        setProducts(res.data);

      })
      .catch((err) => {
        console.log("Fetch error:", err);
      });

  };

  /* =========================
     ADD TO CART FUNCTION
  ========================== */

  const handleAddToCart = (product) => {

    let cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    cart.push({
      ...product,
      cartQuantity: 1
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert("Added to cart");

    navigate("/cart");

  };
  const handleDelete = async (id) => {

  try {

    await axios.delete(
      `${API_BASE_URL}/delete-produce/${id}`
    );

    alert("Produce deleted");

    fetchProducts();

  } catch (error) {

    console.log(error);

    alert("Delete failed");

  }

};

  return (

    <div className="marketplace-container">

      <h1>🛒 Marketplace</h1>

      {products.length === 0 ? (
        <p>No produce available.</p>
      ) : (

        <div className="product-grid">

          {products.map((item) => (

            <div className="product-card" key={item.id}>

  {/* DELETE BUTTON */}

  <span
    className="delete-btn"
    onClick={() =>
      handleDelete(item.id)
    }
  >
    🗑 Delete
  </span>

              <img
                src={`${API_BASE_URL}${item.image}`}
                alt={item.produce}
                className="product-image"
              />

              <h2>{item.produce}</h2>

              <p>
                Quantity: {item.quantity} kg
              </p>

              <p>
                Price: ₹ {item.price}
              </p>

              <p>
                Farmer: {item.name}
              </p>

              {/* ADD TO CART BUTTON */}

              <button
                className="add-cart-btn"
                onClick={() =>
                  handleAddToCart(item)
                }
              >
                Add to Cart
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Marketplace;