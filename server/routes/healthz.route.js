const express = require('express');
const router = express.Router();
const healthzController = require('../controllers/healthz.controller');

router.use('', healthzController)

module.exports = router;