    //I import the modules I will need
    const express=require('express');
    const path=require('path');
    const bcrypt=require('bcrypt');
    const hbs=require("./public/node_modules/hbs");
    const multer = require("./public/node_modules/multer");
    const {collection,collectionactivity}=require('./config');
    const {Collection} = require("mongoose");
    const geolib = require('./public/node_modules/geolib');
    const {addImageToDatabase,viewImageByDatabase,viewActivities,isAuthenticated,getCoordinatesFromAddress}=require('./public/js/ServerMethod');
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/'); // Salva le immagini nella cartella 'uploads/'
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname); // Nome univoco per evitare sovrascritture
        },
    });
    const upload = multer({ storage: storage });
    let flag=false;
    //Create an express application
    const app=express();
    app.use(express.json());


    app.use(express.urlencoded({extended:true}));
    app.use('/login', isAuthenticated);

    //Set up middleware to serve static files from the public folder

    app.use('/public',express.static(path.join(__dirname,'public')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine','ejs');

    //I use app.get to provide the resources
    //For the login page
    let arraysort=null;
    app.get('/',(req,res)=>{
        res.render('index');
    });
    //For the new user
    app.get('/newuser',(req,res)=>{
        res.sendFile('newtous.html',{root: __dirname + "/public"});
    });
    //For the new activity
    app.get('/newactivity',(req,res)=>{
        res.sendFile('newtousactivity.html',{root: __dirname + "/public"});
    });
    //For the user or the activity wich forgot the wword
    app.get('/forgotpassword',(req,res)=>{
        res.sendFile('Forgot_Password.html',{root: __dirname + "/public"});
    });
    //Need of the user/activity authentication and view the page of search for the user

    app.post('/login/search', async (req, res) => {
        try {
            const activity = await collectionactivity.find();
            const userLocation = {
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude)
            };

            const activitiesWithDistance = activity.map(attivita => {
                console.log("userlocation latitude"+userLocation.latitude + "userlocation longitude"+userLocation.longitude);
                let aclatitude=parseFloat(attivita.latitude);
                let aclongitude=parseFloat(attivita.longitude) + 100;

                console.log("ACLATITUDE E AC LONGITUDE:" + aclongitude);
                const distance = geolib.getDistance(
                    {
                        latitude: userLocation.latitude,
                        longitude:userLocation.longitude
                    },
                    {
                        latitude: attivita.latitude,
                        longitude: attivita.longitude
                    }
                );
                console.log(distance/1000);
                return {
                    attivita: attivita,
                    distanza: distance
                };
            });

            const sortedActivities = activitiesWithDistance.sort((a, b) => a.distanza - b.distanza);
            sortedActivities.forEach(item => {
                console.log('Attività:', item.attivita, 'Distanza:', parseFloat(item.distanza));
            });
            arraysort=sortedActivities;
            console.log("arraysort in post"+ arraysort);
            res.json(activitiesWithDistance);
        } catch (error) {
            console.error('Errore durante il recupero del percorso dell\'immagine:', error);
            res.status(500).json({ error: 'Errore durante il recupero del percorso dell\'immagine' });
        }
    });

    app.get('/login/search',async (req,res)=>{
        try {
            console.log(arraysort);
            //const activity=await collectionactivity.find();
            res.render('search', {activity:arraysort});
        } catch (error) {
            console.error('Errore durante il recupero del percorso dell\'immagine:', error);
            res.status(500).send('Errore durante il recupero del percorso dell\'immagine');
        }
    });
    let activityone=null;
    app.get('/login/search/:id',async (req,res)=>{
      try{
          console.log(req.params.id);
          activityone= await collectionactivity.findOne({_id: req.params.id.toString()});
          console.log(activityone.vote);
          res.render('searchone',{activityone,check: req.user})
      }catch (error) {
          console.error('Errore durante il recupero del percorso dell\'immagine:', error);
          res.status(500).send('Errore durante il recupero del percorso dell\'immagine');
      }

    })
    //Need of the user/activity authentication and render the profile of the user
    app.get('/login/myprofile',async (req,res)=>{
        res.render('myprofile',{check: req.user});
    });
    app.post(('/login/myprofile'),upload.none(),async (req,res)=>{
        let check=req.user;
        check.name=req.body.name;
        console.log("username:" + req.body.surname);
        check.surname=req.body.surname;
        check.save();
        res.render('myprofile',{check: req.user});
    });
    //API
    app.get('/api/getDatabaseData', async (req, res) => {
        try {
            // Logica per ottenere dati dal database con Mongoose
            let databaseData = await collectionactivity.find().lean();
            console.log(databaseData);
            res.json(databaseData);
        } catch (error) {
            console.error('Errore durante il recupero dei dati dal database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    //Register user
    app.post("/newuser", async (req,res)=>{
        const data={
            email: req.body.email,
            password:req.body.password,
            name:req.body.name,
            surname:req.body.surname
        }
        //Check if the user already exists in the database
        const existingActivity=await collectionactivity.findOne({email:data.email})
        const existingUser=await collection.findOne({email:data.email})
        if(existingUser || existingActivity){
            flag=false;
            res.render("index",{flag});

        }else{
            //Hash the password using bcrypt
            //Number of salt round for bcrypt
            const saltRounds=10;
            const hashedPassword=await bcrypt.hash(data.password,saltRounds);
            //Replace the hash password with original password
            data.password=hashedPassword;
            //Insert the data in the database and save this instance in userdata
            const userdata= await  collection.insertMany([data]);
            console.log(userdata);
            flag=true
            res.render("index",{flag});
            console.log(userdata);
        }
    });


    //Register Activity
    app.post("/newactivity", upload.single('image'), async (req,res)=>{
        //Image path saved in the 'uploads/' folder
        const imagePath = req.file.path;
        //Save the data of the activity
        let latitude=0;
        let longitude=0;
        const data={
            email: req.body.email,
            password:req.body.password,
            name:req.body.name,
            description:req.body.description,
            address:req.body.address,
            category:req.body.category,
            imagePath:imagePath,
            latitude:latitude,
            longitude:longitude,
            finalrating:0

        }
        //Check if the activity already exists in the database
        const existingActivity=await collectionactivity.findOne({email:data.email})
        const existingUser=await collection.findOne({email:data.email})
            if(existingUser || existingActivity){
                flag=false;
                res.render("index",{flag});
            }else{
            //Hash the password using bcrypt
            //Number of salt round for bcrypt
            const saltRounds=10;
            const hashedPassword=await bcrypt.hash(data.password,saltRounds);
            //Replace the hash password with original password
            data.password=hashedPassword;
            const userdata= await  collectionactivity.insertMany([data]);
                flag=true;
                getCoordinatesFromAddress(req.body.address,  async function (error, coordinates) {latitude=coordinates.latitude;longitude=coordinates.longitude; console.log(longitude + "longitudine" + latitude + "latitudine");
                    const user=await collectionactivity.findOne({email:req.body.email});
                    user.latitude=coordinates.latitude;
                    user.longitude=coordinates.longitude;
                    user.save();
                })
                res.render("index",{flag});
            console.log(userdata);
        }
    });


    //Login User or Activity
    let flagpassworderror=false;
    app.post('/login',async (req,res)=> {
        if(req.isUserAuthenticated){
            console.log(req.user.name);
            res.render('myprofile', { check: req.user });
        }else if(req.isActivityAuthenticated){
            console.log(req.user.name);
            res.render('index', { check: req.user });
        }else{
            console.log("wrong password");
            res.render('index',{flagpassworderror:false});
        }
    })
    //Recover the password
    //First I check that the email exists
    app.post('/forgotpassword',async (req,res)=>{
        try {
           const verify= await collection.findOne({email: req.body.email})
            if(verify){
                ////I can proceed to replace the password
                const filter = { email: req.body.email };
                const saltRounds=10;
                const hashedPassword=await bcrypt.hash(req.body.password,saltRounds);
                const update = { password: hashedPassword };
                let doc = await collection.findOneAndUpdate(filter, update);
                console.log("CI SONO RIUSCITOO "+req.body);
                console.log(doc.email + " " +doc.password);
                res.render('index',{flagpassword:true});

            }else {
                res.render('index',{flagpassword:false});
            }
        }catch {
            res.send(`Wrong Details ${req.body.email} ${req.body.password}`)
        }
    });

    //Post for the review
    app.post('/login/review/:id',upload.none(),async (req, res) => {
        let Currentdate = new Date();
        let day=Currentdate.getDate();
        let month=Currentdate.getMonth()+1;
        let year=Currentdate.getFullYear();
        let hour=Currentdate.getHours();
        let minute=Currentdate.getMinutes();
        if (month < 10) {
            month = '0' + month;
        }

        // Aggiungi uno zero iniziale se il giorno è inferiore a 10
        if (day < 10) {
            day = '0' + day;
        }
        // Aggiungi uno zero iniziale se l'ora è inferiore a 10
        if (hour < 10) {
            hour = '0' + hour;
        }
        // Aggiungi uno zero iniziale se i minuti sono inferiori a 10
        if (minute < 10) {
            minute = '0' + minute;
        }

        const newReview = {
            nickname: req.user.name,
            rating: req.body.categoryone,
            comment: req.body.review,
            date:
                {
                    day:day,
                    month:month,
                    year:year,
                    hour:hour,
                    minute:minute,
                }

        }
        const result = await collectionactivity.findOneAndUpdate(
            { _id: req.params.id }, // criterio di ricerca
            { $push: { reviews: newReview} }, // utilizza $push per aggiungere la recensione
            { new: true } // opzione per restituire il documento aggiornato
        );
        let rating = 0;
        if (result.reviews && result.reviews.length > 0) {
            result.reviews.forEach((recensione) => {
                rating += recensione.rating;
            });
        }
        rating=(rating/result.reviews.length);
    console.log(rating);
        result.finalrating=rating.toFixed(2);
        await result.save();
        res.render('searchone',{activityone:result,check: req.user})
        });
    //put the server to listen and I print a message

    const port=3000;
    app.listen(port,()=>{
        console.log(`Server Running on Port: ${port}`)
    })
