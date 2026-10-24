import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function CropPrice() {

  const [goods, setGoods] = useState([]);

  useEffect(() => {

    console.log("Calling API with state Maharashtra");

    fetch(`${API_BASE_URL}/agmarket-all-goods?state=Maharashtra`)
      .then(res => res.json())
      .then(data => {
        console.log("Goods:", data);
        setGoods(data);
      })
      .catch(err => console.log(err));

  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h1>📊 Crop Price Analysis (AGMARKNET Verified)</h1>

      {goods.length === 0 ? (
        <p>No goods available</p>
      ) : (
        goods.map((item, index) => (
          <div key={index} style={cardStyle}>
            {item}
          </div>
        ))
      )}

    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "15px",
  margin: "10px",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
};

export default CropPrice;