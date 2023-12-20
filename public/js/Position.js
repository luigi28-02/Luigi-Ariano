
document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {

        const userLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
};
    console.log("User location front"+userLocation.longitude)

    // Esegui la richiesta POST automaticamente al caricamento della pagina
    fetch('/login/search', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
    body: JSON.stringify(userLocation)
})
    .then(response => response.json())
    .then(data => {
    // Fai qualcosa con i dati ricevuti dal server
    console.log(data + "CIAo");
})
    .catch(error => {
    console.error('Errore durante la richiesta al server:', error);
});
},
    (error) => {
    console.error('Errore durante il recupero della posizione:', error);
}
    );
} else {
    console.error('La geolocalizzazione non è supportata dal tuo browser.');
}
});

