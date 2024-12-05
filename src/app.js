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

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', async ()  => {
    // Run the loadLocalStorage function when the page is loaded
    loadLocalStorage();
    // Retrieve data from localStorage.
    const searchedData = localStorage.getItem('searchedData');
    // Check if searchedData has a value.
    if (searchedData){
        // If data exists, parse it from JSON to an object.
        const setTitle = JSON.parse(searchedData)[0];
        // Check if setTitle has a value and if it has a name property.
        if (setTitle && setTitle.name){
            // If a name exists, update the document's title with the planet's name.
            document.title = `Resultat för planeten ${setTitle.name}`
        }
    } 
    else {
        // If searchedData doesn't exist, set the title to prompt the user to search.
        document.title = 'Sök på en planet.'
    }

    // Assign the stored API key to the variable
    apiKey = localStorage.getItem('apiKey');
    // Log the API key if it is not undefined or null.
    if (apiKey != null){
        console.log('Loaded API Key:', apiKey);
    }
    // If there is no API key, fetch a new one
    if (!apiKey || apiKey.trim() === "") {
        // await so fetchDataWithKey wait for fetchapikey to be done.
       await fetchApiKey(url);
       fetchDataWithKey(apiKey, url);
    } else {
        // Otherwise, fetch data using the stored API key
        fetchDataWithKey(apiKey, url);
    }

    // Check if the back button exists
    if (backButton) {
        // Add an event listener to the back button with a click event
        backButton.addEventListener('click', () => {
        // When the back button is clicked, navigate to the index page
        window.location.href = '/JS-EXAM/index.html';
        // Remove the stored data from localStorage when going back
        localStorage.removeItem('searchedData');
        localStorage.removeItem('apiKey');
        });
    }
});

// Function to fetch API key asynchronously
async function fetchApiKey(url) {
    try {
        // Await method to wait for the fetch request to complete
        const response = await fetch(`${url}/keys`, {
            method: 'POST'
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
        
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// Function to fetch data using the API key asynchronously
async function fetchDataWithKey(apiKey, url){
    // If there is no API key, send an error message
    if (!apiKey) {
        console.error('No key.');
        // return so it stops executing further code
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

        // Check if data has a .bodies and if searchBtn exists
        if (data.bodies && searchBtn) {
            // Add an event listener to the search button with a click event
            searchBtn.addEventListener('click', (event) => {
            // Prevent form from submitting and reloading the page
            event.preventDefault();
            // Trim the planet search input and assign it to userSearch
            const userSearch = planetSearch.value.trim();

           // Use the filter method to find planets that match the user's search
            const searchedData = data.bodies.filter(item =>
                // Using toLowerCase so that upper or lower case doesn't matter
                item.name.toLowerCase() == (userSearch.toLowerCase())
            );

             // If userSearch has no value or if there are no matches, update the error message
             if (!userSearch || searchedData.length === 0) {
                /*  If userSearch is empty, this is true and it will assign the first option
                 otherwise it is false and will assign the second option */ 
                errorMsg.textContent = !userSearch ? "Sök på en Planet." : "Kunde inte hitta något resultat.";
                // return so it stops executing further code
                return;
            }

            // If the search data is not empty, store it in localStorage and navigate to results page
            if (searchedData.length > 0) {
                localStorage.setItem('searchedData', JSON.stringify(searchedData));
                window.location.href = '/JS-EXAM/results.html';
            }
            });
        } else {
            // return so it stops executing further code
            return;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        // return so it stops executing further code
        return;
    }
};

// Function to load data from localStorage
function loadLocalStorage(){
    // Get the saved data from localStorage
     const storedData = localStorage.getItem('searchedData');

    // Check if the user is on the results page
    if (window.location.pathname.endsWith('results.html')) {
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

                // Checks if the planet has a moon
                if(display.moons.length > 0){
                    // creating new element
                    const newMoonUl = document.createElement('ul');
                    // Set the innerHTML to "Månar" as a header for the list items.
                    newMoonUl.innerHTML = 'Månar:'
                    // Adding class list to ul for styling.
                    newMoonUl.classList.add('moonInfo');
                    // Replace the paragraph with ul so we can appen list items.
                    moonInfo.replaceWith(newMoonUl);
                    
                    // forEach method, in case of it's more than 1 moons.
                    display.moons.forEach(moon => {
                    const newMoonLi = document.createElement('li');
                    newMoonLi.textContent = moon;
                    // appending the new child to the parent.
                    newMoonUl.appendChild(newMoonLi);
                    });
                } else {
                    const newMoonInfo = document.createElement('p');
                    // if the planet doesn't have any moons, it will display this message.
                    newMoonInfo.textContent = 'Den här planeten har inga månar.';
                    // appending the new child to the parent.
                    moonInfo.appendChild(newMoonInfo);
                }

            }
        } else {
            // If no data was found in localStorage, log an error
            console.error('No data found in localStorage.');
            // return so it stops executing further code
            return;
        }
    }
};
