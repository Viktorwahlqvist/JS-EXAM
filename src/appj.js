// Variables for all elements
const planetSearch = document.getElementById('planetSearch');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const headerContainer = document.getElementById('headerContainer');
const searchView = document.getElementById('searchView');
const resultView = document.getElementById('resultView');
const moon = document.getElementById('moon');
const desc = document.getElementById('desc');
const circumference = document.getElementById('circumference');
const distance = document.getElementById('distance');
// API code
const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let apiKey;

const fetchApiKey = async () => {
    try {
        const response = await fetch(`${url}/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        apiKey = data.key
        console.log(apiKey);
        fetchDataWithKey();

    } catch (error) {
        console.log('Fetch error:', error);
    }
}

fetchApiKey();

const fetchDataWithKey = async () => {
    if (!apiKey) {
        console.log('error no api key.');
        
    }
    try {
        const response = await fetch(`${url}/bodies`, {
            headers: { 'x-zocom': `${apiKey}`,
                        'Content-Type': 'application/json'
        }

        })
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        searchBtn.addEventListener('click', (event) => {
            event.preventDefault()
            const userSearch = planetSearch.value.trim();
            if(userSearch){
                errorMsg.textContent = ""
                const searchedData = data.bodies.filter(item  => item.name.includes(userSearch));
                console.log(searchedData);
                headerContainer.classList.toggle('hide');
                searchView.classList.toggle('hide');
                resultView.classList.toggle('hide');
                moon.classList.toggle('hide');
                
                const displayData = searchedData[0];
                //Change html
                desc.textContent = displayData.desc;
                //creating new parapragh element to hold circumference.
                const newcircumference = document.createElement('p');
                //Formating and giving variable the value of displaydata.circumference
                newcircumference.textContent = ` ${displayData.circumference.toLocaleString('sv-SE')} km`;
                // Adding newcircumference as childelement.
                circumference.appendChild(newcircumference);

                //creating new parapragh element to hold distance.
                const newDistance = document.createElement('p');
                newDistance.textContent = `${displayData.distance.toLocaleString('sv-SE')} km`;
                distance.appendChild(newDistance);


                
                
            } else {
                errorMsg.textContent = "Couldn't find any results."
            }
        })
        
    }
    catch (error){
        console.log('Fetch error:', error);
    }

}
