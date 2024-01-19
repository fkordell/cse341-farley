const express = require('express')

const router = express.Router();

const myController = require('../controllers/contacts')

router.use('/contacts', require('./contacts'));

module.exports = router;