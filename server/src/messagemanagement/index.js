const Router = require("express").Router

const controller = require("./controller");
const checkAuth = require("../../lib/checkAuth");

module.exports = () => {
    const router = Router({mergeParams: true});
    router.use(checkAuth);

    router.route("/").get(controller.message);
    // router.route("/").get(controller.getUser);

    return router;
}