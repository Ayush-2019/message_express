const express = require('express');
const router = express.Router();
const {db} = require('../cred/cred');
const basicAuth = require('../security/auth');
const { getUser, createUser, updateUser, allUsers } = require('../controllers/user.controller');
const User = require('../cred/cred').Schema;

router.get('/v10/user/self',basicAuth, getUser);

router.post('/v10/user/self', createUser);

router.put('/v10/user/self', basicAuth, updateUser);

router.get('/v10/user/all', allUsers);

module.exports = router;