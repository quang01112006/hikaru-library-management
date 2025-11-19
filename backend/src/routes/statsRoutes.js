
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getHomeStats);

router.get('/chart', statsController.getChartData);

module.exports = router;