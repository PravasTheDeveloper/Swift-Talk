const dotenv = require("dotenv")
const express = require('express');
const app = express();
dotenv.config({ path: "./.env" })
app.use(express.json());
require("./database/connect")
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())
app.use(require("./routes/routes"))

const port = process.env.PORT || 5000
const server = app.listen(port, () => {
    console.log(`Your Server is Running on localhost:${port}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    }
})

io.on("connection", (socket) => {
    console.log("Connected to soket io")

    socket.on("setup", (userData) => {
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        // console.log("User Join Room : " + room)
    })

    socket.on("disconnect", () => {
        console.log("disconnectee");
        socket.emit("disconnectee")
    });

    socket.on("new messege", (newMessegeRecive) => {
        var chat = newMessegeRecive.chat

        if (!chat.users) return console.log("chat.users not define")

        chat.users.forEach((user) => {
            if (user === newMessegeRecive.sender._id) return;
            io.emit("messege recieved", newMessegeRecive)
        })
    })
})