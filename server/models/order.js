const mongoose=require('mongoose')

const OrderSchema=new mongoose.Schema({
    product_id:String,
    name:String,
    email:String,
})


const UserModel =mongoose.model('users',OrderSchema)
module.exports = UserModel;