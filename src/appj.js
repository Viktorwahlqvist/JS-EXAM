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
        const allData = data.bodies;
        allData.forEach(element => {
            console.log(element);
            
        });
        
    }
    catch (error){
        console.log('Fetch error:', error);
    }

}
