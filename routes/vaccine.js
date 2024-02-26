const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');

router.get('/vaccine', vaccineController.getVaccineData);

module.exports = router;
