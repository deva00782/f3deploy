import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AgMarket.css";
import { API_BASE_URL } from "../config";

function AgMarket() {



const navigate = useNavigate();

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

  // REDIRECT TO CART
  navigate("/cart");

};

 const state =
  localStorage.getItem("selectedState");

const validState =
  state && state.trim() !== ""
    ? state
    : "Telangana";

  const vegetables = [
    "Tomato",
    "BeetRoot",
    "Potato",
    "Carrot",
    "Cabbage",
    "Brinjal",
    "Beans",
    "Cauliflower",
    "spinach",
    "Green chilli"
  ];

  const [prices, setPrices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  /* FETCH PRICES */

const fetchPrices = async () => {

  try {

    let results = [];

    for (let veg of vegetables) {

      try {

        const res = await axios.get(
          `${API_BASE_URL}/agmarket-prices`,
          {
            params: {
              commodity: veg,
              state: state
            }
          }
        );

        results.push(res.data);

      } catch (err) {

        console.log("Error:", veg, err.message);

        results.push({
          commodity: veg,
          mandi: "Unavailable",
          price_per_kg: "0.00"
        });

      }

      // IMPORTANT: Delay to avoid 429 error
      await new Promise(
        resolve =>
          setTimeout(resolve, 500)
      );

    }

    setPrices(results);

  } catch (error) {

    console.log(error);

  }

};




  useEffect(() => {

    fetchPrices();

  }, []);

  /* SEARCH FILTER */

  const filtered =
    prices.filter((item) =>
      item.commodity
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* REDIRECT TO UPLOAD PAGE */

  const handleUpload = (veg) => {

    localStorage.setItem(
      "selectedCrop",
      veg
    );

    navigate("/upload");

  };

  return (

    <div className="agmarket-container">

      <h1 className="agmarket-title">
        📊 Crop Price Analysis
        (AGMARKNET Verified)
      </h1>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search vegetable..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="search-box"
      />

      {/* CARDS */}

      <div className="card-grid">

        {filtered.map(
          (item, index) => (

            <div
              key={index}
              className="price-card"
            >

              {/* Vegetable */}

              <h2>
                {item.commodity}
              </h2>

              {/* NEW: MANDI NAME */}

              <p className="mandi">
                {item.mandi}
              </p>

              {/* Price */}

              <p className="price">

                ₹ {item.price_per_kg} / kg

              </p>

              {/* Upload Button */}

              <button
                className="upload-btn"
                onClick={() =>
                  handleUpload(
                    item.commodity
                  )
                }
              >
                Upload Produce
              </button>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default AgMarket;