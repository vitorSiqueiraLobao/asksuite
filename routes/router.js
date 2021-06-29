const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController')

const BrowserService = require('../services/BrowserService')
router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

//TODO implement endpoint here
router.post('/search', searchController.getData);

module.exports = router;
