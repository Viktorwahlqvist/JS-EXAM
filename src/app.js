// Variables for all elements on the first page
const planetSearch = document.getElementById('planetSearch');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');

// Variables for all elements on the second page
const desc = document.getElementById('desc');
const circumference = document.getElementById('circumference');
const distance = document.getElementById('distance');
const planetName = document.getElementById('planetName');
const latinName = document.getElementById('latinName');
const dayTemp = document.getElementById('dayTemp');
const planetType = document.getElementById('planetType');
const nightTemp = document.getElementById('nightTemp');
const moonInfo = document.getElementById('moonInfo');
const backButton = document.getElementById('backButton');

// API URL
const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
// API key variable to hold the API key
let apiKey;

// Function to fetch API key asynchronously
const fetchApiKey = async () => {
    try {
        // Await method to wait for the fetch request to complete
        const response = await fetch(`${url}/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // If response isn't OK, throw an error
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // When response is converted to JSON, it will be assigned to data
        const data = await response.json();
        // Assign the API key to the variable
        apiKey = data.key;
        // Save the API key in localStorage
        localStorage.setItem('apiKey', apiKey);
        // Console log to make sure the API key was saved
        console.log('stored ', apiKey);
        
        // If the API key is stored in the variable, run the fetchDataWithKey function
        if (apiKey) {
            fetchDataWithKey();
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// Function to fetch data using the API key asynchronously
const fetchDataWithKey = async () => {
    // If there is no API key, send an error message
    if (!apiKey) {
        console.error('No key.');
        return;
    }

    try {
        // Fetch data from the URL with the API key and assign the response to the variable
        const response = await fetch(`${url}/bodies`, {
            headers: {
                'x-zocom': apiKey,
                'Content-Type': 'application/json',
            },
        });

        // If response is not ok, throw an error
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // When response is converted to JSON, it will be assigned to data
        const data = await response.json();

        // Check if data has a .bodies object and if searchBtn exists
        if (data.bodies && searchBtn) {
            // Add an event listener to the search button with a click event
            searchBtn.addEventListener('click', (event) => {
                // Prevent form from submitting and reloading the page
                event.preventDefault();
                // Trim the planet search input and assign it to userSearch
                const userSearch = planetSearch.value.trim();

                // If userSearch has no value, update the error message
                if (!userSearch) {
                    errorMsg.textContent = "Sök på en Planet.";
                    return;
                }

                // Use the filter method to find planets that match the user's search
                const searchedData = data.bodies.filter(item =>
                    // Using toLowerCase so that upper or lower case doesn't matter
                    item.name.toLowerCase() == (userSearch.toLowerCase())
                );

                // If the search data is not empty, store it in localStorage and navigate to results page
                if (searchedData.length > 0) {
                    localStorage.setItem('SearchedData', JSON.stringify(searchedData));
                    window.location.href = '/JS-EXAM/results.html';
;
                } else {
                    // Update the error message if no planets match the search
                    errorMsg.textContent = "Kunde inte hitta något resultat.";
                }
            });
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// Function to load data from localStorage
function loadLocalStorage() {
    // Get the saved data from localStorage
     const storedData = localStorage.getItem('SearchedData');

    // Check if the user is on the results page
    if (window.location.pathname === '/JS-EXAM/results.html') {
            // If there is stored data, parse the first index of the array to display
            if (storedData) {
                const display = JSON.parse(storedData)[0];
                if (display) {
                    // Log to check the key and values for displaying
                    console.log(display);
                    // changing the html to planetName, latinName and desc.
                    planetName.textContent = display.name.toUpperCase();
                    latinName.textContent = display.latinName.toUpperCase();
                    desc.textContent = display.desc;
                                    
                    // creating new element
                    const newCircumference = document.createElement('p');
                    // assigning circumference to the new created element, with formatted numbers.
                    newCircumference.textContent = `${display.circumference.toLocaleString('sv-SE')} km`;
                    // appending the new child to the parent.
                    circumference.appendChild(newCircumference);
                                    
                    // creating new element
                    const newDistance = document.createElement('p');
                    // assigning distance to the new created element, with formatted numbers.
                    newDistance.textContent = `${display.distance.toLocaleString('sv-SE')} km`;
                    // appending the new child to the parent.
                    distance.appendChild(newDistance);

                    // creating new element
                    const newDayTemp = document.createElement('p');
                    // assigning temp day to the new created element, in Celsius.
                    newDayTemp.textContent = `${display.temp.day} °C`;
                    // appending the new child to the parent.
                    dayTemp.appendChild(newDayTemp);

                    // creating new element
                    const newNightTemp = document.createElement('p');
                    // assigning temp night to the new created element, in Celsius.
                    newNightTemp.textContent = `${display.temp.night} °C`;
                    // appending the new child to the parent.
                    nightTemp.appendChild(newNightTemp);

                    // creating new element
                    const newPlanetType = document.createElement('p');
                    /* assigning type to the new created element, charAt and toUpperCase
                    to make the first letter uppercase and then concatenate it with the rest of the word
                    starting at index 1 */
                    newPlanetType.textContent = `${display.type.charAt(0).toUpperCase()}${display.type.slice(1)}`;
                    // appending the new child to the parent.
                    planetType.appendChild(newPlanetType);

                    // creating new element
                    const newMoonInfo = document.createElement('p');
                    // Checks if the planet has a moon
                    if(display.moons.length > 0){
                        // assigning the moons to the new created element.
                        newMoonInfo.textContent = display.moons;
                        // appending the new child to the parent.
                        moonInfo.appendChild(newMoonInfo);
                    } else {
                        // if the planet doesn't have any moons, it will display this message.
                        newMoonInfo.textContent = 'Den här planeten har inga månar.';
                        // appending the new child to the parent.
                        moonInfo.appendChild(newMoonInfo);
}

            }
        } else {
            // If no data was found in localStorage, log an error
            console.error('No data found in localStorage.');
        }
    }
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Run the loadLocalStorage function when the page is loaded
    loadLocalStorage();
    // Assign the stored API key to the variable
    apiKey = localStorage.getItem('apiKey');
    // Log the API key to check if it exists
    console.log('Loaded API Key:', apiKey);

    // If there is no API key, fetch a new one
    if (!apiKey || apiKey.trim() === "") {
        fetchApiKey();
    } else {
        // Otherwise, fetch data using the stored API key
        fetchDataWithKey(); // Use the stored API key if it exists
    }

    // Check if the back button exists
    if (backButton) {
        // Add an event listener to the back button with a click event
        backButton.addEventListener('click', () => {
            // When the back button is clicked, navigate to the index page
            window.location.href = '/JS-EXAM/index.html';
            // Remove the stored data from localStorage when going back
            localStorage.removeItem('SearchedData');
            localStorage.removeItem('apiKey');
        });
    }
});
