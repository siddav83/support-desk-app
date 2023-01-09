import http from "http";
import path from "path";
import { Server } from "socket.io";
import express from "express";

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
console.log();
//get all routes and return the index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

const httpServer = http.Server(app);

// create socket io server
const io = new Server(httpServer, { cors: { origin: "*" } });
const users = [];

// handle connection with socket.io
io.on("connection", (socket) => {
    socket.on("disconnect", () => {}); // when you close web browser this function will run
    socket.on("onLogin", (user) => {
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id, //coming from the socket object, connectino action
            message: [], // no conversation between admin so set confirmation to empty array
        };
        const existUser = users.find((x) => x.name === updatedUser.name);
        if (existUser) {
            existUser.socketId = socket.id;
        }
    }); // when a user in the client side emits "onLogin" action, th ecall back function will pass the user param to the function "onLogin"
    socket.on("onUserSelected", (user) => {}); //when admin in the admin dashboard, click on a user, we emit the "onUserSelected" action
    socket.on("onMessage", (message) => {}); //user send message to admin or admin send message to user
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
