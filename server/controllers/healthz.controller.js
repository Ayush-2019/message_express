const {credentials} = require('../cred/cred');
const logger = require('../logger');
const healthzController = async(req, res) => {

    res.setHeader('Cache-Control', 'no-cache');

    if(req.method !== 'GET'){
        logger.error('Invalid method');
        res.status(405).json();
        return;
    }

if(req.headers['content-length']){
    if (parseInt(req.headers['content-length']) > 0){
        logger.error('Invalid content length');
        res.status(400).json();
        return;
    }
}

    if(Object.keys(req.query).length != 0){
        logger.error('Invalid query parameters');
        res.status(400).json();
        return;
    }

    try{
        await credentials.authenticate();
        logger.info('Health check succesfully completed');
        res.status(200).json();
    }
    catch(e){
        logger.error('Database connection error');
        res.status(503).json();
    }
}

module.exports = healthzController;