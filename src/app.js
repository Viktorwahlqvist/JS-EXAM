// Variables for all elements first page
const planetSearch = document.getElementById('planetSearch');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
// Variables for alla elements second page
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

// API code
const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let apiKey;

    

const fetchApiKey = async () => {
    try {
        const response = await fetch(`${url}/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        apiKey = data.key;
        localStorage.setItem('apiKey', apiKey);
        console.log('stored ', apiKey);
        

        if (apiKey) {
            fetchDataWithKey();
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
const fetchDataWithKey = async () => {
    if (!apiKey) {
        console.error('No key.');
        return;
    }

    try {
        const response = await fetch(`${url}/bodies`, {
            headers: {
                'x-zocom': apiKey,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.bodies && searchBtn) {
            searchBtn.addEventListener('click', (event) => {
                event.preventDefault();

                const userSearch = planetSearch.value.trim();
                if (!userSearch) {
                    errorMsg.textContent = "Please enter a search term.";
                }

                const searchedData = data.bodies.filter(item =>
                    item.name.toLowerCase().includes(userSearch.toLowerCase())
                );

                if (searchedData.length > 0) {
                    
                    localStorage.setItem('SearchedData', JSON.stringify(searchedData));
                    window.location.href = '/results.html';
                } else {
                    errorMsg.textContent = "Couldn't find any results.";
                }
            });
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};




function loadLocalStorage ()  {
    const storedData = localStorage.getItem('SearchedData');
    if(window.location.pathname === '/results.html'){
        if (storedData) {
            const display = JSON.parse(storedData)[0];
            if (display) {
                console.log(display);
                planetName.textContent = display.name.toUpperCase();
                latinName.textContent = display.latinName.toUpperCase();
                desc.textContent = display.desc;
                
    
                const newCircumference = document.createElement('p');
                newCircumference.textContent = `${display.circumference.toLocaleString('sv-SE')} km`;
                circumference.appendChild(newCircumference);
    
                const newDistance = document.createElement('p');
                newDistance.textContent = `${display.distance.toLocaleString('sv-SE')} km`;
                distance.appendChild(newDistance);

                const newDayTemp = document.createElement('p');
                newDayTemp.textContent = `${display.temp.day} °C`;
                dayTemp.appendChild(newDayTemp);

                const newNightTemp = document.createElement('p');
                newNightTemp.textContent = `${display.temp.night} °C`;
                nightTemp.appendChild(newNightTemp);

                const newPlanetType = document.createElement('p');
                newPlanetType.textContent = `${display.type.charAt(0).toUpperCase()}${display.type.slice(1)}`;
                planetType.appendChild(newPlanetType);


                const newMoonInfo = document.createElement('p');
                if(display.moons.length > 0){
                    newMoonInfo.textContent = display.moons;
                    moonInfo.appendChild(newMoonInfo);
                } else {
                    newMoonInfo.textContent = 'Den här planeten har inga månar.'
                    moonInfo.appendChild(newMoonInfo);
                }
                


            }
        } else {
            console.error('No data found in localStorage.');
        }
    
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadLocalStorage();
    
    apiKey = localStorage.getItem('apiKey');
    console.log('Loaded API Key:', apiKey);

    // Om ingen nyckel finns eller om den är tom, hämta en ny
    if (!apiKey || apiKey.trim() === "") {
        fetchApiKey();
    } else {
        fetchDataWithKey();  // Använd den lagrade nyckeln om den finns
    }

    if(backButton){
        backButton.addEventListener('click', () => {
            window.location.href = '/index.html';
            localStorage.clear();
                localStorage.removeItem('SearchedData');
                localStorage.removeItem('apiKey');
        });
    }
});

