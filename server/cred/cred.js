const {Sequelize} = require('sequelize');
require('dotenv').config();
const User = require('../model/User');
const Verify = require('../model/verification');

// const connector = new Connector();
// const clientOpts = await connector.getOptions({
//     instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
//     authType: 'IAM'
// });
console.log(process.env.username);
const credentials = new Sequelize(

    process.env.db_database,
    process.env.db_username, 
    process.env.db_password,{

        host: process.env.db_host,
        dialect: 'mysql',
        logging: false
    });

const Schema = credentials.define('user',User);
const Verification = credentials.define('verify',Verify);
    
const db = {
    sequelize: credentials,
    Sequelize: Sequelize,
    Users: Schema
}


module.exports = {
    credentials,
    db,
    Schema,
    Verification
}

// djnejnej
