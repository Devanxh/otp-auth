const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone: {
        type: Number,
        required: true
    },
    otp : {
        type: Number,
        // required: true
    }
})

module.exports = mongoose.model('User', userSchema);