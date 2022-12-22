const Router = require("express").Router

const controller = require("./controller");
const checkAuth = require("../../lib/checkAuth");

module.exports = () => {
    const router = Router({mergeParams: true});

    router.route("/signup").post(controller.signup);

    router.route("/signin").post(controller.signin);

    router.use(checkAuth);

    router.route("/list").get(controller.getUsers);
    router.route("/").get(controller.getUser);

    return router;
}