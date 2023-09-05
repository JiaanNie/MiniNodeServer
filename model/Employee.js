const mongoose = require('mongoose')
const Schema = mongoose.Schema
const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }

})
// by default when this model create, mongo will look into "employees" collection
module.exports=mongoose.model('Employee', employeeSchema)