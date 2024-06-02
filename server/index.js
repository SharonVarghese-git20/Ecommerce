const port=4000;
const express=require('express');
const app=express();
const mongoose=require("mongoose")
const jwt= require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const UserModel=require('./models/User');
//const OrderModel=require('./models/order');
const { log } = require('console');
const { type } = require('os');
app.use(express.json());
app.use(cors());
//Database connecion with mongodb
//mongodb+srv://ecommerce:<password>@cluster0.shqpiqg.mongodb.net/

mongoose.connect("mongodb+srv://shopper:101010@cluster0.shqpiqg.mongodb.net/e-commerce")

//Api creation

app.get("/",(req,res)=>{
    res.send("Express App is running")
})

//image storage engine

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

//upload fn
const upload = multer({storage:storage})

//creating upload endpoint
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
       type:String,
       required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
       required:true,
    },
    new_price:{
        type:Number,
       required:true,
    },
    old_price:{
        type:Number,
       required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
    
    
})

app.post('/addproduct',async(req,res)=>{
    let products= await Product.find({});
    let id;
    if (products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id = last_product.id+1;
    }
    else{ id=1;}
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        stock:req.body.stock,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for deleting products
app.post('/removeproduct',async(req,res)=>{
     await Product.findOneAndDelete({id:req.body.id});
     console.log("removed");
     res.json({
        succes:true,
        name:req.body.name
     })
})
 //Creating APT for getting all products
 app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("all products fetched")
    res.send(products);
 })

 //schema for user model
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    productname:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creating endpoint for registering user
app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User found"})
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data ={
        user:{
            id:user.id,
        }
    }
    const token=jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})

//creatind endpoint for user login
app.post ('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password==user.password
        if(passCompare){
           const data={
            user:{
                id:user.id,
            }
           }
           const token=jwt.sign(data,'secret_ecom');
           res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong emailId"});
    }
    
})
app.get('/user',(req,res)=>{
    UserModel.find()
    .then(users =>res.json(users))
    .catch(err =>res.json(err))
})

//creating endpoint for newcollection
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection=products.slice(0).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log('Popular in women fetched');
    res.send(popular_in_women)
})

//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');;
    if(!token) { 
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
           try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
           }
           catch(error){
                  res.status(401).send({errors:"Please authenticate using valid token"});
           }
    }
}

//creating endpoint for adding products in cartData
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log('Added',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    console.log(req.body.itemId);
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send('Added')
    let userItem=await Users.findOne({id:req.user.id})

})

//creating endpoint for removing product from da
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log('removed',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send('removed')
    }
})

//creating endpoint to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("get cart data");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
}) 

app.post('/order',async(req,res)=>{
   
    console.log('Added',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
    res.send(userData.cartData[req.body.itemId])
    console.log(req.body.itemId);
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send('Added')
    }
    let userItem=await Users.findOne({id:req.user.id})
    
})
app.listen(port,(error)=>{
    if(!error) console.log('Server Running on PORT '+port)
        else console.log("Error: "+error)
})
