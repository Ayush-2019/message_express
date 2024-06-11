const Logger = require('node-json-logger');
const fs = require('fs');
require('dotenv').config();

var filePath = '/var/log/myapp.log';
var logStream;
var logger;


if(process.env.test === 'ci_testing'){
    logger = new Logger();
}

else{
    if(fs.existsSync(filePath)){
        logStream = fs.createWriteStream('/var/log/myapp.log', { flags: 'a' });
    }
    else{
        logStream = fs.createWriteStream('./myapp.log', { flags: 'a' });
    }
    
    
    logger = new Logger({ stream: logStream });
    
    process.stdout.write = logStream.write.bind(logStream);
    process.stderr.write = logStream.write.bind(logStream);
}

module.exports = logger;