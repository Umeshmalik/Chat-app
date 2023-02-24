const { Schema, model } = require("mongoose");
const paginate = require('mongoose-paginate');

const Data = new Schema({
    draftOrderId: {
        type: String
    },
    paymentDetails: {
        type: Object,
    },
    finalPrice: {
        type: Number,
    }
},{
    timestamps: true
})

Data.index({ draftOrderId: 1, name: 1, paymentDetails: 1, finalPrice: 1 });

Data.plugin(paginate);

module.exports = model("Data", Data);