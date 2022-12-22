const router = require("express").Router();

const userRoutes = require("./src/usermanagement");
const messageRoutes = require("./src/messagemanagement");

module.exports = () =>
    router.get("/health-check", (req, res)=> {
        res.send("Server is Healthy.")
    })
    .use("/user", userRoutes())
    .use("/message", messageRoutes())