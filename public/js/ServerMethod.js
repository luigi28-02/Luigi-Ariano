const fs = require('fs').promises;
const {collection,collectionactivity}=require('../../config');
const bcrypt = require("bcrypt");
//Database
async function addImageToDatabase(imagePath) {
    try {
        // Verifica l'esistenza del file
        const isFileExists = await fs.access(imagePath).then(() => true).catch(() => false);

        if (!isFileExists) {
            throw new Error(`File not found: ${imagePath}`);
        }
        // Leggi l'immagine come buffer di byte
        const imageBuffer = await fs.readFile(imagePath);
        return imageBuffer;
        // Crea un'istanza del modello con l'immagine
        //const imageInstance = new collectionactivity({ image: imageBuffer });

        // Salva l'istanza nel database
        //const result = await imageInstance.save();
       // console.log('Image added to the database:', result._id);
    } catch (error) {
        console.error('Error adding image to the database:', error);
    }
}
async function viewImageByDatabase(youremail){
    const image=await collectionactivity.findOne({email:youremail});
    if(image){
        console.log(image);
        return image;
    }else{
        console.log('error',image);
        return null;
    }

    //res.contentType('image/jpg'); // Imposta il tipo di contenuto in base al tipo di immagine
    //res.send(image.image);

}

//Methods for search.ejs
async function viewActivities() {
    try {
        // Utilizza il metodo find con await
        const result = await collectionactivity.find({});

        // Accedi al campo 'nome' di ogni documento
        const nomiAttivita = result.map(attivita =>({
          name: attivita.name,
          category: attivita.category,
          address: attivita.address,
          description:attivita.description,
          image:attivita.image

        }));
        console.log(nomiAttivita);
        return Promise.resolve(nomiAttivita);

    } catch (err) {
        console.error('Errore durante la ricerca delle tuple:', err);
        return Promise.reject(err);
    }
}
//User Login Middelware
let isUserAuthenticated =  false;
let isActivityAuthenticated=false;
let user;
 async function isAuthenticated(req, res, next){

    // Check if the user is authenticated
     if(!isUserAuthenticated && !isActivityAuthenticated){

         try{
             const check=await collection.findOne({email: req.body.email});
             const checkactivity=await collectionactivity.findOne({email:req.body.email})
             if(!check && !checkactivity){
                 isUserAuthenticated=false;
                 isActivityAuthenticated=false;
                 console.log(req.body.email);
             }
             //Compare the hash password  from the database with the plain text
             if(check){
                 const isPasswordMatch= await bcrypt.compare(req.body.password,check.password);
                 if(isPasswordMatch){
                     isUserAuthenticated=true;
                     console.log(check.name);
                     user = check;
                 }else {
                     isUserAuthenticated=false;
                     console.log("Wrong Password");
                 }
             }else{
                 const isPasswordMatch= await bcrypt.compare(req.body.password,checkactivity.password);
                 if(isPasswordMatch){
                     isActivityAuthenticated=true;
                     console.log(checkactivity.name);
                     user=checkactivity
                 }else {
                     isActivityAuthenticated=false;
                     console.log("wrong password activity");
                 }
             }

         }catch{

         }
         if (isUserAuthenticated || isActivityAuthenticated) {
             // Se l'utente è autenticato, prosegui alla prossima funzione di middleware
             req.user=user;
             req.isUserAuthenticated=isUserAuthenticated;
             req.isActivityAuthenticated=isActivityAuthenticated;
             next();
         } else {
             // Se l'utente non è autenticato, reindirizza a una pagina di accesso o restituisci un errore
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
    addImageToDatabase,
    viewImageByDatabase,
    viewActivities,
    isAuthenticated,
    getCoordinatesFromAddress
};

