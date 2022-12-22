const jwt = require("jsonwebtoken");

const decryptToken = (token) => {
    if (token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    throw new Error("No authorization token found.")
}

module.exports = {
    decryptToken
}