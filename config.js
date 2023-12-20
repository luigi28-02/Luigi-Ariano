/*
In this file we'll create a database connection with mongoose
 */
const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/User");


//check database connection or not
connect.then(()=>{
    console.log("Database connected Successfully");
})
.catch(()=>{
    console.log("Database cannot be connetted");
});


//Create a schema for user
const loginSchema=new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    password: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required:true
    },
    surname: {
        type:String,
        required:true
    }
});
//Create a schema for the activity
const loginactivityschema=new mongoose.Schema({
    name:{
        type:String,
        //required:true,
    },
    category:{
        type:String,
        //required:true
    },
    address:{
        type:String,
        //required:true
    },
    description: {
        type: String,
        //required:true
    },
    email: {
        type: String,
        //required:true
    },
    password: {
        type:String,
        //required: true
    },
    imagePath:{
        type:String
    },


    reviews: [
        {
            nickname: {
                type: String,
                //required: true
            },
            rating: {
                type: Number,
                //required: true
            },
            comment: {
                type: String,
            },
            date:
                {
                    day: {
                        type:String
                    },
                    month:{
                        type:String
                    },
                    year:{
                        type:String
                    },
                    hour:{
                        type:String
                    },
                    minute:{
                        type:String
                    }


                }

        }
    ],
    finalrating:{
        type: Number
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    }
})


//Collection Part
const collection=new mongoose.model("login",loginSchema);
const collectionactivity=new mongoose.model("loginactivity",loginactivityschema);
//module.exports=collection;
//module.exports=collectionactivity;
module.exports = {
    collection: collection,
    collectionactivity: collectionactivity
};

