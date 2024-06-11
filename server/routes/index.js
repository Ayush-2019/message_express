const express = require('express');
const router = express.Router();

const routes = [
    {
        "path": "/healthz",
        "route": require('./healthz.route')
    },
    {
        "path":"",
        "route": require('./user.route')
    },
    {
        "path":"",
        "route": require('./verify.route')
    
    }
]

routes.forEach((route)=> {
    router.use(route.path, route.route);
});

module.exports = router;