
let prove=null;
// Event listener for fully loading the DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("here");
    // Check if the browser supports geolocation
    if ('geolocation' in navigator) {
        console.log("log in geolocation");
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("In get current position");
                // Creating an object with the user's coordinates
                const userLocation = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude)
                };
                // // Make a POST request to the server with the user's coordinates
                fetch('/login/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userLocation)
                })
                    .then(response => response.json())
                    .then(data => {
                        prove=data;
                        const activityContainer = document.getElementById('activityContainer');
                        activityContainer.innerHTML = '';
                        if (data && data.length > 0) {
                            // Iterate over each task and display the information
                            data.forEach(attivita => {
                                const attivitas=attivita.attivita;
                                let distance=attivita.distanza;
                                distance=distance/1000;
                                const cardDiv = document.createElement('div');
                                cardDiv.className = 'card';
                                cardDiv.style.width = '25rem';
                                const link = document.createElement('a');
                                link.href = `/login/search/${attivitas._id}`;
                                const img = document.createElement('img');
                                img.src = `../${attivitas.imagePath}`;
                                img.className = 'card-img-top';
                                img.alt = '...';

                                const cardBodyDiv = document.createElement('div');
                                cardBodyDiv.className = 'card-body';

                                const nameParagraph = document.createElement('p');
                                nameParagraph.className = 'card-text';
                                nameParagraph.textContent = attivitas.name;
                                const distanceParagraph = document.createElement('p');
                                distanceParagraph.className = 'card-text';
                                distanceParagraph.textContent = distance + "km ";
                                const addressParagraph = document.createElement('p');
                                addressParagraph.className = 'card-text';
                                addressParagraph.textContent = attivitas.address;

                                const categoryParagraph = document.createElement('p');
                                categoryParagraph.className = 'card-text';
                                categoryParagraph.innerHTML = `${attivitas.category} <span>vote: <span>${attivitas.finalrating}</span></span>`;

                                const descriptionParagraph = document.createElement('p');
                                descriptionParagraph.className = 'card-text';
                                descriptionParagraph.textContent = attivitas.description;

                                link.appendChild(img);
                                cardBodyDiv.appendChild(nameParagraph);
                                cardBodyDiv.appendChild(distanceParagraph);
                                cardBodyDiv.appendChild(addressParagraph);
                                cardBodyDiv.appendChild(categoryParagraph);
                                cardBodyDiv.appendChild(descriptionParagraph);

                                cardDiv.appendChild(link);
                                cardDiv.appendChild(cardBodyDiv);

                                activityContainer.appendChild(cardDiv);
                            });
                        } else {
                            activityContainer.innerHTML = '<h1>Nessuna attività trovata</h1>';
                        }
                    })
                    .catch(error => {
                        console.error('Errore durante la richiesta POST:', error);
                    });

            },
            (error) => {
                console.log('Error getting location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by your browser.');
    }
});