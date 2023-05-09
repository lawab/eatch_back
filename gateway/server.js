const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json());


//Microservices proxy redirection
app.use('/users', proxy('http://localhost:4001'));
app.use('/restaurants', proxy('http://localhost:4002'));
app.use('/categories', proxy('http://localhost:4006'));