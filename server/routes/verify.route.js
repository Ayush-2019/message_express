const express = require('express');
const router = express.Router();
const {db} = require('../cred/cred');
const basicAuth = require('../security/auth');
const {verifyUser} = require('../controllers/verify.controller');
const User = require('../cred/cred').Schema;

router.get('/verify', verifyUser);

module.exports = router;