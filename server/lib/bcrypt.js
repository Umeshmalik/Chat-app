const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
        hashedPassword,
        salt
    }
}

const verifyPassword = async (password, salt, storedPassword)  =>{
    const hashedPassword = await bcrypt.hash(password, salt);
    return storedPassword === hashedPassword;
}

module.exports = {
    hashPassword,
    verifyPassword
}