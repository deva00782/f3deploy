app.get("/transactions", (req, res) => {

  const sql =
    "SELECT * FROM transactions ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error fetching transactions"
      });

    }

    res.json(result);

  });

});