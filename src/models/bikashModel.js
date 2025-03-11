const { model, Schema } = require('mongoose')

const paymentSchema = new Schema({
    userId: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    trxID: {
        type: String,
    },
    paymentID: {
        type: String,
    },
    date: {
        type: String,
    }
}, { timestamps: true })

const bikashModel = model('payments', paymentSchema)
module.exports =bikashModel