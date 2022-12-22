const User = require("../models/user");
const { decryptToken } = require("./decryptToken");

const checkAuth = async (req, res, next) => {
    try{
        const userInfo = decryptToken(req.headers.authorization);
        const user = await User.findOne({email: userInfo.email}, {name: 1, email: 1, _id: -1}).lean();
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({err: err.message});
    }
}

module.exports = checkAuth;