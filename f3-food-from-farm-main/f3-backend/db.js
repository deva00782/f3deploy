const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "local_db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if local_db doesn't exist
const DEFAULT_DATA = {
  seeded: true,
  users: [],
  marketplace: [
    {
      id: 1,
      name: "Ramesh Kumar",
      place: "Nashik",
      produce: "Fresh Organic Tomatoes",
      quantity: "50",
      price: "35",
      state: "Maharashtra",
      image: "/uploads/1775908325197-tomato.png"
    },
    {
      id: 2,
      name: "Suresh Patel",
      place: "Anand",
      produce: "Farm Fresh Potatoes",
      quantity: "100",
      price: "25",
      state: "Gujarat",
      image: "/uploads/1772473079719-potatoes.jpg.jpg"
    },
    {
      id: 3,
      name: "Anitha Reddy",
      place: "Guntur",
      produce: "Crunchy Carrots",
      quantity: "40",
      price: "45",
      state: "Andhra Pradesh",
      image: "/uploads/1775908344945-carrots.jpg"
    },
    {
      id: 4,
      name: "Vikram Singh",
      place: "Pune",
      produce: "Green Capsicum",
      quantity: "25",
      price: "60",
      state: "Maharashtra",
      image: "/uploads/1775912376835-capsicum.png"
    }
  ],
  transactions: [],
  notifications: [
    {
      id: 1,
      message: "Welcome to F3 Food From Farm Platform!"
    }
  ]
};

function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const data = JSON.parse(raw);
    // One-time: if an old/stale data file has an empty marketplace, load the sample products
    if (!data.seeded) {
      if (!Array.isArray(data.marketplace) || data.marketplace.length === 0) {
        data.marketplace = JSON.parse(JSON.stringify(DEFAULT_DATA.marketplace));
      }
      data.seeded = true;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
    return data;
  } catch (err) {
    console.error("[LocalDB] Error reading local_db.json, using defaults:", err);
    return DEFAULT_DATA;
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[LocalDB] Error saving to local_db.json:", err);
  }
}

let isMySQLConnected = false;
let pool = null;

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "f3_database",
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000,
  enableKeepAlive: true,
};

// Cloud MySQL (TiDB Cloud, Aiven, PlanetScale...) needs SSL: set DB_SSL=true
if (String(process.env.DB_SSL).toLowerCase() === "true") {
  dbConfig.ssl = { minVersion: "TLSv1.2", rejectUnauthorized: true };
}

try {
  pool = mysql.createPool(dbConfig);
  pool.query("SELECT 1", (err) => {
    if (err) {
      console.log("[DB] MySQL Connection Error:", err.message || err.code);
      console.log("[DB] Falling back to Local File Database (data/local_db.json).");
      isMySQLConnected = false;
    } else {
      console.log("[DB] Connected to MySQL successfully.");
      isMySQLConnected = true;
      initMySQLTables();
    }
  });
} catch (e) {
  console.log("[DB] MySQL initialization error:", e.message);
  isMySQLConnected = false;
}

function initMySQLTables() {
  if (!isMySQLConnected || !pool) return;
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS marketplace (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      place VARCHAR(255),
      produce VARCHAR(255),
      quantity VARCHAR(100),
      price VARCHAR(100),
      state VARCHAR(100),
      image VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255),
      produce VARCHAR(255),
      quantity VARCHAR(100),
      total_price VARCHAR(100),
      payment_method VARCHAR(100),
      status VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT
    )`,
  ];
  let remaining = queries.length;
  queries.forEach((q) => {
    pool.query(q, (err) => {
      if (err) console.log("[DB] Error creating table in MySQL:", err.message);
      if (--remaining === 0) seedMySQLMarketplace();
    });
  });
}

// Put the sample products in an empty marketplace table so the site isn't blank
function seedMySQLMarketplace() {
  pool.query("SELECT COUNT(*) AS c FROM marketplace", (err, rows) => {
    if (err || !rows || rows[0].c > 0) return;
    DEFAULT_DATA.marketplace.forEach((m) => {
      pool.query(
        "INSERT INTO marketplace (name, place, produce, quantity, price, state, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [m.name, m.place, m.produce, m.quantity, m.price, m.state, m.image],
        (e) => e && console.log("[DB] Seed error:", e.message)
      );
    });
    console.log("[DB] Seeded sample products into MySQL.");
  });
}

function query(sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }
  if (!callback) {
    callback = () => {};
  }

  if (isMySQLConnected && pool) {
    return pool.query(sql, params, (err, results, fields) => {
      if (err) {
        console.warn("[DB] MySQL query failed, attempting local fallback:", err.message);
        handleLocalQuery(sql, params, callback);
      } else {
        callback(null, results, fields);
      }
    });
  }

  return handleLocalQuery(sql, params, callback);
}

function handleLocalQuery(sql, params, callback) {
  const normSql = sql.replace(/\s+/g, " ").trim().toUpperCase();
  const dbData = readLocalDb();

  try {
    // 1. SELECT * FROM users WHERE email = ?
    if (normSql.includes("SELECT * FROM USERS WHERE EMAIL =")) {
      const email = params[0]?.toLowerCase().trim();
      const matches = (dbData.users || []).filter(
        (u) => u.email.toLowerCase().trim() === email
      );
      return callback(null, matches);
    }

    // 2. INSERT INTO users (email, password, role) VALUES (?, ?, ?)
    if (normSql.startsWith("INSERT INTO USERS")) {
      const [email, password, role] = params;
      const newUser = {
        id: (dbData.users?.length ? Math.max(...dbData.users.map((u) => u.id || 0)) : 0) + 1,
        email,
        password,
        role,
      };
      if (!dbData.users) dbData.users = [];
      dbData.users.push(newUser);
      writeLocalDb(dbData);
      return callback(null, { insertId: newUser.id, affectedRows: 1 });
    }

    // 3. SELECT * FROM marketplace ORDER BY id DESC
    if (normSql.includes("SELECT * FROM MARKETPLACE")) {
      const items = [...(dbData.marketplace || [])].reverse();
      return callback(null, items);
    }

    // 4. INSERT INTO marketplace
    if (normSql.startsWith("INSERT INTO MARKETPLACE")) {
      const [name, place, produce, quantity, price, state, image] = params;
      const newItem = {
        id: (dbData.marketplace?.length ? Math.max(...dbData.marketplace.map((m) => m.id || 0)) : 0) + 1,
        name,
        place,
        produce,
        quantity,
        price,
        state,
        image,
      };
      if (!dbData.marketplace) dbData.marketplace = [];
      dbData.marketplace.push(newItem);
      writeLocalDb(dbData);
      return callback(null, { insertId: newItem.id, affectedRows: 1 });
    }

    // 5. DELETE FROM marketplace WHERE id = ?
    if (normSql.startsWith("DELETE FROM MARKETPLACE WHERE ID =")) {
      const id = Number(params[0]);
      dbData.marketplace = (dbData.marketplace || []).filter((m) => m.id !== id);
      writeLocalDb(dbData);
      return callback(null, { affectedRows: 1 });
    }

    // 6. INSERT INTO transactions
    if (normSql.startsWith("INSERT INTO TRANSACTIONS")) {
      const [customer_name, produce, quantity, total_price, payment_method, status] = params;
      const newTx = {
        id: (dbData.transactions?.length ? Math.max(...dbData.transactions.map((t) => t.id || 0)) : 0) + 1,
        customer_name,
        produce,
        quantity,
        total_price,
        payment_method,
        status: status || "Success",
        created_at: new Date().toISOString(),
      };
      if (!dbData.transactions) dbData.transactions = [];
      dbData.transactions.push(newTx);
      writeLocalDb(dbData);
      return callback(null, { insertId: newTx.id, affectedRows: 1 });
    }

    // 7. INSERT INTO notifications
    if (normSql.startsWith("INSERT INTO NOTIFICATIONS")) {
      const message = params[0];
      const newNotif = {
        id: (dbData.notifications?.length ? Math.max(...dbData.notifications.map((n) => n.id || 0)) : 0) + 1,
        message,
        created_at: new Date().toISOString(),
      };
      if (!dbData.notifications) dbData.notifications = [];
      dbData.notifications.push(newNotif);
      writeLocalDb(dbData);
      return callback(null, { insertId: newNotif.id, affectedRows: 1 });
    }

    // 8. SELECT * FROM notifications ORDER BY id DESC
    if (normSql.includes("SELECT * FROM NOTIFICATIONS")) {
      const items = [...(dbData.notifications || [])].reverse();
      return callback(null, items);
    }

    console.warn("[LocalDB] Unhandled query, returning empty array:", sql);
    return callback(null, []);
  } catch (err) {
    console.error("[LocalDB] Query error:", err);
    return callback(err);
  }
}

module.exports = {
  query,
  isMySQLConnected: () => isMySQLConnected,
  readLocalDb,
  writeLocalDb,
};
