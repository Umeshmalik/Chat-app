require("dotenv").config();
require("colors");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        methods: ['GET', 'POST'],
    }
});
const routes = require("./routes");
const connectDB = require("./lib/db");
const { saveMessage } = require("./src/messagemanagement/controller");

const PORT = process.env.PORT || 7000;

connectDB();
app.use(express.json())
app.use(cors());
app.use("/api", routes())

io.on("connection", (socket) => {
    socket.on("online", (user)=> {
        socket.join(user._id);
    })
    socket.on("offline", (user)=> {
        console.log("User gone.")
    })
    socket.on("message in", async (msg) => {
        const res = await saveMessage(msg);
        io.in([msg.to, msg.from]).emit("message out", res);
    })
})

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});