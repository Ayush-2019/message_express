const express = require('express');
const router = express.Router();
const {db, Verify} = require('../cred/cred');
const basicAuth = require('../security/auth');
const User = require('../cred/cred').Schema;
const Verification = require('../cred/cred').Verification;
const bcrypt = require('bcryptjs');
const logger = require('../logger');
// const {PubSub} = require('@google-cloud/pubsub');

const verifyUser = async (req, res) => {

    const userid = req.query.token; 

    const currentDate = new Date();

    const existing = await User.findOne({ where: { id : userid } });

    if(!existing){
        logger.error('User not found')
        res.status(400).json({ error: "User not found" });
        return;
    }

    const email_track = await Verification.findOne({where: {email: existing.email}});

    const timestamp = email_track.send_time;

    const seconds = (currentDate-timestamp)/1000;

    if(seconds>120){
        logger.error('Verification link expired')
        res.status(400).json({ error: "Verification link expired" });
        return;
    }

    const newuser = {
        email: existing.email,
        password: existing.password,
        firstName: existing.firstName,
        lastName: existing.lastName,
        created_at: existing.created_at,
        updated_at: new Date(),
        email_verified: true
    }


    const user = await User.update(newuser, {where: {email: existing.email}});
    
    logger.info('User verified successfully');
    res.status(200).json({ 
        message: "User verified successfully"
     });

}

module.exports = {
    verifyUser
}