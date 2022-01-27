/** PACKAGES */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

/** ERROR HANDLINGS */
require('express-async-errors');

/** CONFIGURATIONS */
require('./config/authentication/passport-local')(passport);
require('./config/authentication/passport-jwt')(passport);

/** ROUTE IMPORTS */
const index = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const productRoute = require('./routes/product.routes');

/** INITIALIZE */
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/** ROUTES */
app.use(index);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoute);

module.exports = app;