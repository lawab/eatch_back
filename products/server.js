require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const connection = require("./db");

//import routes
const productRouter = require("./src/routes/productRoutes");

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use all parser utilities
app.use(express.json({ limit: "10000000mb" }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "./build/web")));

//allows multiple http request anywhere
app.use(cors());

// All router app
app.use("/api/products", productRouter);

//Public files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "/upload")));

//connection to databse and create default super admin
connection()
  .then(() => {
    //App listener
    app.listen(process.env.APP_PORT, () =>
      console.log(`your server is running on port ${process.env.APP_PORT}`)
    );
  })
  .catch((err) => console.log(err.message));
