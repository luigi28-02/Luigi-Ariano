const fs = require('fs').promises;
const {collection,collectionactivity}=require('../../config');
const bcrypt = require("bcrypt");


//User Login Middelware
let isUserAuthenticated =  false;
let isActivityAuthenticated=false;
let user;
let flagpassworderror=false;

 async function isAuthenticated(req, res, next){

    // Check if the user is authenticated
     if(!isUserAuthenticated && !isActivityAuthenticated){

         try{
             const check=await collection.findOne({email: req.body.email});
             const checkactivity=await collectionactivity.findOne({email:req.body.email})
             if(!check && !checkactivity){
                 isUserAuthenticated=false;
                 isActivityAuthenticated=false;
             }
             //Compare the hash password  from the database with the plain text
             if(check){
                 const isPasswordMatch= await bcrypt.compare(req.body.password,check.password);
                 if(isPasswordMatch){
                     isUserAuthenticated=true;
                     console.log(check.name);
                     user = check;
                     flagpassworderror=false;
                 }else {
                     flagpassworderror=true
                     isUserAuthenticated=false;
                     res.render('index',{flagpassworderror});
                 }
             }else{
                 const isPasswordMatch= await bcrypt.compare(req.body.password,checkactivity.password);
                 if(isPasswordMatch){
                     isActivityAuthenticated=true;
                     console.log(checkactivity.name);
                     flagpassworderror=false;
                     user=checkactivity
                 }else {
                     isActivityAuthenticated=false;
                     console.log("wrong password activity");
                     flagpassworderror=true;
                     res.render('index',{flagpassworderror});
                 }
             }

         }catch{

         }
         if (isUserAuthenticated || isActivityAuthenticated) {
             //If the user is authenticated, continue to the next middleware function
             req.user=user;
             req.isUserAuthenticated=isUserAuthenticated;
             req.isActivityAuthenticated=isActivityAuthenticated;
             next();
         } else {
             //If the user is not authenticated, redirect to a login page or return an error
             res.render('index');
         }
     }else{
         req.user=user;
         req.isUserAuthenticated=isUserAuthenticated;
         req.isActivityAuthenticated=isActivityAuthenticated;
         next();
     }

}


function getCoordinatesFromAddress(address, callback) {
    var api_key = '9bb4052e04084f13a97c3335b7160395';
    var query = encodeURIComponent(address);
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';
    var request_url = api_url + '?' + 'key=' + api_key + '&q=' + query + '&pretty=1' + '&no_annotations=1';

    fetch(request_url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var coordinates = {
                latitude: data.results[0].geometry.lat,
                longitude: data.results[0].geometry.lng
            };
            callback(null, coordinates);
        })
        .catch(error => {
            callback('Error during fetch: ' + error.message);
        });
}


module.exports={
    isAuthenticated,
    getCoordinatesFromAddress
};

