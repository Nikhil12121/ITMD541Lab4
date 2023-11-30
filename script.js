// Search Sunrise & Sunset Code using search
function getSunriseSunset() {
    const locationInput = document.getElementById('location-input');
    const resultContainer = document.getElementById('result-container');
    const location = locationInput.value.trim();
    let countryname = null;

    if (!location) {
        alert('Please enter a valid location.');
        return;
    }

    // Use the Geocode API to get latitude and longitude for the entered location
    fetch(`https://geocode.maps.co/search?q=${location}`)
        .then(response => response.json())
        .then(data => {
            countryname = data[0];
            if (data.length > 0) {
                let nearestdata = data[0];
                const { lat, lon } = nearestdata;
                return fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&formatted=0`);
            } else {
                throw new Error('Location not found.');
            }
        })
        .then(response => response.json())
        .then(sunriseSunsetData => {
            const todayData = sunriseSunsetData.results.sunrise.split("T")[0];
            const tomorrowData = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

            console.log(countryname['display_name']);
            resultContainer.innerHTML = getHtmlCode(sunriseSunsetData, tomorrowData, countryname['display_name']);
            resultContainer.style.visibility = 'visible'; 
            })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
}

// Use Current Location to get data
function getCurrentLocation() {
    const resultContainer = document.getElementById('result-container');
    const locationInput = document.getElementById('location-input');
    locationInput.value = " ";

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0`)
                .then(response => response.json())
                .then(sunriseSunsetData => {
                    const todayData = sunriseSunsetData.results.sunrise.split("T")[0];
                    const tomorrowData = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

                    resultContainer.innerHTML = getHtmlCode(sunriseSunsetData,tomorrowData)
                    resultContainer.style.visibility = 'visible'; 
                    locationInput.value = sunriseSunsetData.results.timezone;
                })
                .catch(error => {
                    alert(`Error: ${error.message}`);
                });
        }, error => {
            alert(`Error getting current location: ${error.message}`);
        });
    } else {
        alert('Geolocation is not supported in your browser.');
    }
}

const getHtmlCode = (sunriseSunsetData, tomorrowData, countryname) => {
    

    return `
    
     <div class="big-card">
        <h2>Today</h2>
        <div class="header-content">
            <div class="additional-info">
                <h3>Additional Information</h3>
                <p>Solar Noon: ${sunriseSunsetData.results.solar_noon}</p>
                <p>Day Length: ${sunriseSunsetData.results.day_length} seconds</p>
                <p>Time Zone: ${sunriseSunsetData.results.timezone}</p>
            </div>
        </div>
        <div class="cards-container">
            <div class="card">
                <div class="icon">
                    
                </div>
                <h2>Sunrise and Sunset</h2>
                <p>Sunrise: ${sunriseSunsetData.results.sunrise}</p>
                <p>Sunset: ${sunriseSunsetData.results.sunset}</p>
            </div>
            <div class="card">
                <div class="icon">
                    
                </div>
                <h2>Dawn and Dusk</h2>
                <p>Dawn: ${sunriseSunsetData.results.dawn}</p>
                <p>Dusk: ${sunriseSunsetData.results.dusk}</p>
            </div>
        </div>
    </div>
    <div class="big-card">
        <h2>Tomorrow</h2>
        <div class="header-content">
            <div class="additional-info">
                <h3>Additional Information</h3>
                <p>Solar Noon: ${new Date(tomorrowData + ' ' + sunriseSunsetData.results.solar_noon).toLocaleTimeString()}</p>
                <p>Day Length: ${sunriseSunsetData.results.day_length} seconds</p>
                <p>Time Zone: ${sunriseSunsetData.results.timezone}</p>
            </div>
        </div>
        <div class="cards-container">
            <div class="card">
                <div class="icon">
                    
                </div>
                <h2>Sunrise and Sunset</h2>
                <p>Sunrise: ${new Date(tomorrowData + ' ' + sunriseSunsetData.results.sunrise).toLocaleTimeString()}</p>
                <p>Sunset: ${new Date(tomorrowData + ' ' + sunriseSunsetData.results.sunset).toLocaleTimeString()}</p>
            </div>
            <div class="card">
                <div class="icon">
                    
                </div>
                <h2>Dawn and Dusk</h2>
                <p>Dawn: ${sunriseSunsetData.results.dawn}</p>
                <p>Dusk: ${sunriseSunsetData.results.dusk}</p>
            </div>
        </div>
    </div>
`
}