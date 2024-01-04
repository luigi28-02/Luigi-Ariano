/*
Questo file è il service worker.
Dal service worker non è possibile accedere al DOM(Document Object Model)
 */
const CACHE_NAME='italian-coders-v1';
//Files conterra tutti i file che vengono scaricati tra cui anche altre api(aggiungere i relativi link)
const FILES=[
    './views/index.ejs',
    './index.js',
    './css/style.css',
    './'
]
//Il service worker si mette in ascolto per installare tutto ciò che occorre per far funzionare il sito
self.addEventListener('install',event=>{
    console.log("I m in the install");
    //Aspettiamo finché non accade una certa cosa
    event.waitUntil(
        //caches=Cache Storage API
        caches.open(CACHE_NAME).
            //Aggiungi tutti i file presenti nell'array alla cache
            then(cache=>cache.addAll(FILES))
    )
    //Aggiornamento
    caches.keys().then(
        //Se il nome della cache che utilizziamo è diverso da quello attuale eliminalo
        cachesName=>cachesName.map(name=>{
            console.log(CACHE_NAME);
            console.log(name);
            if(name!=CACHE_NAME){
                caches.delete(name);
            }
        })
    )
})


self.addEventListener('fetch',event=>{
    console.log(event.request)
    //Questo metodo impedisce la gestione automatica delle richieste e consente di assegnare un Response a ogni request
    //Fatta al sito
    event.respondWith(
        caches.match(event.request).then(
            //Se trovi la request che chiede l utente rispondi con una risposta associata alla request
            Response=>Response ? Response : fetch(event.request)
        )
    )
})