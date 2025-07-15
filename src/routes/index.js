const express = require('express')
const mainAuthRoutes = require('./auth');
const router = express.Router();

router.use('/auth', mainAuthRoutes);

module.exports =router