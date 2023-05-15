const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const config = require('./configs/config');

const path = require('path');
const dotenv = require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, './build/web')));
//Public files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "/data/uploads")));

//Microservices proxy redirection
app.use('/api/users', proxy(config.url_user));
app.use('/api/restaurants', proxy(config.url_restaurant));
app.use('/api/categories', proxy(config.url_category));
app.use('/api/materials', proxy(config.url_material));
app.use('/api/recettes', proxy(config.url_recette));
app.use('/api/promotions', proxy(config.url_promotion));
app.use('/api/products', proxy(config.url_product));
app.use('/api/orders', proxy(config.url_order));
app.use('/api/menus', proxy(config.url_menu));
app.use('/api/logistics', proxy(config.url_logistic));
app.use('/api/invoices', proxy(config.url_invoice));
app.use('/api/historicals', proxy(config.url_historical));
app.use('/api/comments', proxy(config.url_comment));
app.use('/api/clients', proxy(config.url_client));

app.listen(process.env.APP_PORT, () => 
    console.log(`your server is listening on port ${process.env.APP_PORT}`)
    );