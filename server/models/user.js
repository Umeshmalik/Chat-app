const { Schema, model } = require("mongoose");
const paginate = require('mongoose-paginate');

const User = new Schema({
    name: {
        type: String,
        null: false
    },
    email: {
        type: String,
        null: false
    },
    password: {
        type: String,
        null: false
    },
    salt: {
        type: String,
        null: false
    }
},{
    timestamps: true
})

User.index({ email: 1, name: 1, password: 1, salt: 1 });

User.plugin(paginate);

module.exports = model("User", User);