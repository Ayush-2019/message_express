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

io.on("connection", (socket) => {
    // console.log("User connected");
    // console.log("id: ", socket.id);


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });

    socket.on("message", async(parties) => {
        
        const fromUser = await User.findOne({where: {id: parties.send}});
        const toUser = await User.findOne({where: {id: parties.receive}});

        // console.log("from: ", fromUser);

        const entry = {
            from: fromUser.id,
            to: toUser.id,
            message: parties.message,
            time: parties.time
        }
        // console.log(fromUser);

        fromArray = JSON.parse(fromUser.messages).m;
        fromArray.push(entry);
        const message_obj = {"m": fromArray};
        // console.log("fromUser M PARSED: " + JSON.stringify(fromArray));
        fromUser.messages = JSON.stringify(message_obj);
        // console.log(JSON.stringify(fromUser));


        toArray = JSON.parse(toUser.messages).m;
        toArray.push(entry);
        const message_obj2 = {"m": toArray};
        // console.log("fromUser M PARSED: " + JSON.stringify(fromArray));
        toUser.messages = JSON.stringify(message_obj2);
        // console.log(fromUser.id);
        console.log(JSON.stringify(fromUser));

        const newFromUser = {
            email: fromUser.email,
            password: fromUser.password,
            firstName: fromUser.firstName,
            lastName: fromUser.lastName,
            created_at: fromUser.created_at,
            updated_at: new Date(),
            email_verified: true,
            socket_id: fromUser.socket_id,
            messages: fromUser.messages
        }
        const user = await User.update(newFromUser, {where: {email: fromUser.email}});

        const newToUser = {
            email: toUser.email,
            password: toUser.password,
            firstName: toUser.firstName,
            lastName: toUser.lastName,
            created_at: toUser.created_at,
            updated_at: new Date(),
            email_verified: true,
            socket_id: toUser.socket_id,
            messages: toUser.messages
        }
        const user2 = await User.update(newToUser, {where: {email: toUser.email}});

        const to = toUser.socket_id;
        // console.log("to: ", to);

        // console.log(entry);
        io.to(to).emit("receive", entry);
        
        
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