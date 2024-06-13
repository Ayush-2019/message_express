const express = require('express');
const router = express.Router();
const {db} = require('../cred/cred');
const basicAuth = require('../security/auth');
const User = require('../cred/cred').Schema;
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const { socket_id, messages } = require('../model/User');
// const {PubSub} = require('@google-cloud/pubsub');

const getUser = async (req, res) => {

    try{
        const email = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')[0];

    const user = await User.findOne({ where: { email } });

    if(!user){
        logger.warn('No User of this email found')
        res.status(404).json({ error: "No User of this email found" });
    }

    // if(process.env.test !== 'ci_testing' && !user.email_verified){
    //     logger.warn('Email not verified')
    //     res.status(403).json({ error: "Email not verified" });
    //     return;
    // }

    const obj = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        created_at: user.account_created,
        updated_at: user.account_updated,
        socket_id: user.socket_id,
        messages: user.messages
    }

    logger.info('User details fetched successfully')
    res.status(200).json(obj);
    }
    catch(e){
        logger.trace(e);
    }


}

const createUser = async (req, res) => {

    try{

        if(!req.body.email || req.body.email == "") {
            logger.warn('Email is required')
            res.status(400).json({ error: "Email is required" });
            return;
        }
    
            const existing = await User.findOne({ where: { email: req.body.email } });
    
            if(existing){
                logger.fatal('Email already taken')
                res.status(400).json({ error: "Email already taken" });
                return;
            }
    
            if(!req.body.password || req.body.password == ""){
                logger.error("Password field shouldn't be empty")
                res.status(400).json({ error: "Password field shouldn't be empty" });
                return;
            }
    
            if(!req.body.firstName || req.body.firstName == "") {
                logger.warn('FirstName is required')
                res.status(400).json({ error: "FirstName is required" });
                return;
            }
    
            if(!req.body.lastName || req.body.lastName == "") {
                logger.warn('Lastname is required')
                res.status(400).json({ error: "LastName is required" });
                return;
            }
    
            if(req.body.created_at || req.body.updated_at || req.body.id){
                logger.fatal("Auto generated fields must not be manipulated")
                res.status(400).json({ error: "Auto generated fields must not be manipulated" });
                return;
            }
    
    
    
            const hashedPassword = await bcrypt.hash(req.body.password, 8);
    
            const newuser = {
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                socket_id: req.body.socket_id,
                messages: req.body.messages,
                created_at: new Date(),
                updated_at: new Date()
            }
        
        
            const user = await User.create(newuser);
    
    
            const obj = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                created_at: user.account_created,
                updated_at: user.account_updated,
                email_verified: false,
                socket_id: user.socket_id,
                messages: user.messages
            }
            logger.info('User registered successfully')

            var topicName = 'verify_email';
            var subname = 'cloud-sub';
            var projectId = 'dev-assignment4'

            const payload = {
                email: user.email,
                id: user.id
            }

            const data = JSON.stringify(payload)
            
            // if(!process.env.test){
            //     const pubsub = new PubSub({projectId});
            //     pubsub.topic(topicName).publishMessage({data: Buffer.from(data)});
            // }
            res.status(201).json(obj); 
            

            

    }
    catch(e){
        logger.trace(e);
    }

}

const updateUser = async (req, res) => {
    
    try{
        // console.log(req.body);

        const emailid = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')[0];

        const existing = await User.findOne({ where: { email: emailid } });

        if(!existing){
            logger.debug('User not found')
            res.status(400).json({ error: "User not found" });
            return;
        }
        if(req.body.password == ""){
            logger.debug("Password field shouldn't be empty")
            res.status(400).json({ error: "Password field shouldn't be empty" });
            return;
        }
        var hashedPassword;
        if(req.body.password){hashedPassword = await bcrypt.hash(req.body.password, 8);}

        if(req.body.email) {
            logger.fatal('Email not required')
            res.status(400).json({ error: "Email not required" });
            return;
        }

        if(req.body.created_at || req.body.updated_at || req.body.id){
            logger.fatal("Auto generated fields must not be manipulated")
            res.status(400).json({ error: "Auto generated fields must not be manipulated" });
            return;
        }

        // if(process.env.test !== 'ci_testing' && !existing.email_verified){
        //     logger.warn('Email not verified')
        //     res.status(403).json({ error: "Email not verified" });
        //     return;
        // }

        const newuser = {
            email: existing.email,
            password: req.body.password ? hashedPassword: existing.password,
            firstName: req.body.firstName ? req.body.firstName: existing.firstName,
            lastName: req.body.lastName ? req.body.lastName: existing.lastName,
            created_at: existing.created_at,
            updated_at: new Date(),
            email_verified: true,
            socket_id: req.body.socket_id ? req.body.socket_id: existing.socket_id,
            messages: req.body.messages ? req.body.messages: existing.messages
        }
    
    
        const user = await User.update(newuser, {where: {email: emailid}});
        // console.log(user);
        const updated = await User.findOne({ where: { email: emailid } });

        const obj = {
            id: updated.id,
            email: updated.email,
            firstName: updated.firstName,
            lastName: updated.lastName,
            created_at: updated.account_created,
            updated_at: updated.account_updated,
            socket_id: req.body.socket_id,
            messages: req.body.messages
        }
        logger.info('User updated successfully')
        res.status(200).json(obj);
    }
    catch(e){
        logger.trace(e);
    }

}

const allUsers = async(req, res) => {

    const users = await User.findAll();

    var names = [];

    users.forEach(user => {
        names.push({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        });
    });

    res.status(200).json(names);

}

module.exports = {
    getUser,
    createUser,
    updateUser,
    allUsers
}