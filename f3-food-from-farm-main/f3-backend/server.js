const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const multer = require("multer");

const app = express();


app.use(cors());
app.use(express.json());

/* ================================
   FILE UPLOAD CONFIG
================================ */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

console.log("Starting server...");

/* ================================
   DATABASE CONNECTION (Resilient MySQL + Local JSON Fallback)
================================ */

const db = require("./db");

/* ================================
   SIGNUP
================================ */

app.post("/signup", async (req, res) => {

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {

    const checkSql =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkSql,
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Server error"
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "User already exists"
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        const insertSql =
          "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";

        db.query(
          insertSql,
          [email, hashedPassword, role],
          (err) => {

            if (err) {
              return res.status(500).json({
                message: "Signup failed"
              });
            }

            res.json({
              message: "Signup successful"
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      message: "Signup failed"
    });

  }

});

/* ================================
   LOGIN
================================ */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err)
      return res.status(500).json({
        message: "Server error"
      });

    if (result.length === 0)
      return res.status(400).json({
        message: "User not found"
      });

    const user = result[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials"
      });

    res.json({
      message: "Login successful",
      role: user.role,
    });

  });

});

/* ================================
   UPLOAD PRODUCE
================================ */

app.post(
  "/upload-produce",
  upload.single("image"),
  (req, res) => {

    const {
      name,
      place,
      produce,
      quantity,
      price
    } = req.body;

    const state =
      req.body.state || "";

    const imagePath =
      req.file
        ? `/uploads/${req.file.filename}`
        : "";

    const sql = `
      INSERT INTO marketplace
      (name, place, produce, quantity, price, state, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        name,
        place,
        produce,
        quantity,
        price,
        state,
        imagePath
      ],
      (err) => {

        if (err) {
          return res
            .status(500)
            .send("DB Error");
        }

        res.send({
          message:
            "Upload success"
        });

      }
    );

  }
);

/* ================================
   GET PRODUCTS
================================ */

app.get("/products", (req, res) => {

  const sql =
    "SELECT * FROM marketplace ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      return res
        .status(500)
        .json({
          message:
            "Error fetching products"
        });
    }

    res.json(result);

  });

});

/* ================================
   DELETE PRODUCE
================================ */

app.delete("/delete-produce/:id", (req, res) => {

  const { id } = req.params;

  const sql =
    "DELETE FROM marketplace WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Delete failed"
      });
    }

    res.json({
      success: true
    });

  });

});

/* ================================
   AGMARKNET PRICES — FINAL FIX
================================ */

let cachedData = [];
let lastFetchTime = 0;

async function fetchAgmarknet() {

  const now = Date.now();

  if (now - lastFetchTime < 10 * 60 * 1000) {
    console.log("Using cached data");
    return cachedData;
  }

  console.log("Fetching Agmarknet data...");

  try {

    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
      {
        params: {
          "api-key":
            "579b464db66ec23bdd0000011018001646754d4243a0299db61f7b44",
          format: "json",
          limit: 5000
        }
      }
    );

    cachedData =
      response.data.records || [];

    lastFetchTime = now;

    console.log(
      "Records fetched:",
      cachedData.length
    );

    return cachedData;

  } catch (error) {

    console.log(
      "API ERROR:",
      error.message
    );

    return [];

  }

}

app.get("/agmarket-prices", async (req, res) => {

  try {

    const commodity =
      (req.query.commodity || "")
        .toLowerCase();

    const state =
      (req.query.state || "")
        .toLowerCase();

    const records =
      await fetchAgmarknet();

    console.log(
      "Searching for:",
      commodity,
      state
    );

    const match =
      records.find(
        r =>
          r.commodity &&
          r.state &&
          r.commodity
            .toLowerCase()
            .includes(commodity) &&
          r.state
            .toLowerCase()
            .includes(state)
      );

    if (!match) {

      console.log("No match found");

      return res.json({
        commodity,
        mandi: "Unavailable",
        state,
        price_per_kg: "0.00"
      });

    }

    const price =
      parseFloat(
        match.modal_price
      ) / 100;

    res.json({
      commodity:
        match.commodity,
      mandi:
        match.market,
      state:
        match.state,
      price_per_kg:
        price.toFixed(2)
    });

  } catch (error) {

    console.log(
      "AGMARKNET ERROR:",
      error.message
    );

    res.json({
      commodity:
        req.query.commodity,
      mandi: "Unavailable",
      state:
        req.query.state,
      price_per_kg: "0.00"
    });

  }

});

/* ================================
   SAVE TRANSACTION
================================ */

app.post("/transaction", (req, res) => {

  const {
    customer_name,
    produce,
    quantity,
    total_price,
    payment_method
  } = req.body;

  const sql = `
    INSERT INTO transactions
    (
      customer_name,
      produce,
      quantity,
      total_price,
      payment_method,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customer_name,
      produce,
      quantity,
      total_price,
      payment_method,
      "Success"
    ],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: "Transaction failed"
        });
      }

      res.json({
        success: true,
        message: "Payment Successful"
      });

    }
  );

});
app.post("/add-notification", (req, res) => {

  const {
    customerName,
    phone,
    state,
    city,
    house,
    road,
    items
  } = req.body;

  if (!items || items.length === 0) {

    return res.json({
      message: "No items received"
    });

  }

  items.forEach((item) => {

    const message = `
New Order Received

Customer: ${customerName}
Phone: ${phone}
Produce: ${item.produce}
Quantity: ${item.cartQuantity} kg
Address:
${house}, ${road},
${city}, ${state}
`;

    const sql =
      "INSERT INTO notifications (message) VALUES (?)";

    db.query(sql, [message]);

  });

  res.json({
    message: "Notification added"
  });

});
/* ================================
   GET NOTIFICATIONS
================================ */

/* ================================
   GET NOTIFICATIONS
================================ */

app.get("/notifications", (req, res) => {

  const sql =
    "SELECT * FROM notifications ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {

      console.log("Fetch notifications error:", err);

      return res.status(500).json([]);

    }

    res.json(result);

  });

});
/* ================================
   SERVE REACT BUILD (FOR RENDER)
================================ */
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});