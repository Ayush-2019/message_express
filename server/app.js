const express = require('express');
const { Server } = require('socket.io');
const {createServer} = require('http');

const {Sequelize} = require('sequelize');
const {db} = require('./cred/cred');
const User = require('./cred/cred').Schema;
const bcrypt = require('bcryptjs');
const basicAuth = require('./security/auth');
const body_parser = require('body-parser');
const router = require('./routes');
const logger = require('./logger');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(body_parser.json());
db.sequelize.sync();

app.use(router)



const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"], 
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("id: ", socket.id);


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });

    socket.on("message", ({message, to}) => {
        // console.log(data);
        io.to(to).emit("receive", message);
        
    })

    // socket.on("join-room", (room) => {
    //     socket.join(room);
    //     console.log("Joined room: ", room, " id: ", socket.id);
    // })
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`App running at ${port}`);
})