const { Schema, model } = require("mongoose");
const paginate = require('mongoose-paginate');

const Message = new Schema({
    message: {
        type: String,
        null: false
    },
    to: {
        type: String,
        null: false
    },
    from: {
        type: String,
        null: false
    }
},{
    timestamps: true
})

Message.index({ email: 1, name: 1, password: 1, salt: 1 });

Message.plugin(paginate);

module.exports = model("Message", Message);