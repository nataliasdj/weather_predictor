
//example
my_lon = 51.507351
my_lat = -0.127758
let storedLat = null;
let storedLon = null;
let storedCountry = null;

// const apiUrl = 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=civil&output=json'
//honestly civillight is easy, it takes all the info you want already

const apiUrlImg = 'http://www.7timer.info/bin/astro.php?lon=113.17&lat=23.09&ac=0&lang=en&unit=metric&output=internal&tzshift=0'

//WARNING, its LON then LAT

async function handleCityCallback(city) { //gets the city user has chosen
    console.log('Selected city:', city);
    const { lon, lat, selectedCountry } = await getDataLatLong(city); //destructuring an object
    if (lat === null || lon === null) {
        console.error('Failed to get valid coordinates');
        return;
    }
    storedLat = lat
    storedLon = lon
    storedCountry = selectedCountry
    console.log(lat,selectedCountry,storedCountry,city,storedLon)
    console.log("city: " + city + " my_lat: " + storedLat + " my_lon: " + storedLon)
    
    const chosenCountry = document.getElementById("chosen_country")
    // Clear any existing content in the container
    chosenCountry.innerHTML = '';
    const country = document.createElement('p');
    country.innerHTML = `You chose this city: ${city}<br>We are assuming what is meant is: ${storedCountry}`;
    country.className = 'country-info'; //if for css
    chosenCountry.appendChild(country);

    document.getElementById('get_forecast_button').onclick = () => {
        if (storedLat && storedLon) {
            // Fetch data and render
            renderData(storedLon, storedLat)
        } else {
            console.error('Latitude and Longitude are not set.');
        }
    };
    return city;
}

// document.getElementById('get_forecast_button').onclick = renderData;


function formatDate(date_input) {
    // Extract year, month, and day from the input string
    const year = date_input.substring(0, 4);
    const month = (date_input.substring(4, 6))-1;
    const day = date_input.substring(6, 8);
    let initDate = new Date(year, month, day);
    console.log("day: " + day + "initdate: " + initDate + "month: " + month);
    return initDate;
}

var search_terms = [
    "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",  // USA
    "Shanghai", "Beijing", "Hong Kong", "Shenzhen", "Guangzhou", "Chengdu", "Xi'an", "Hangzhou", "Nanjing", "Wuhan",  // China
    "Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Hiroshima", "Sendai",  // Japan
    "London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Leeds", "Edinburgh", "Sheffield", "Bristol", "Cardiff",  // UK
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille",  // France
    "Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Dusseldorf", "Dortmund", "Essen", "Leipzig",  // Germany
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Hobart", "Gold Coast", "Newcastle", "Wollongong",  // Australia
    "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Halifax", "Quebec City", "Victoria",  // Canada
    "São Paulo", "Rio de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia",  // Brazil
    "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Mérida", "Chihuahua", "Juárez", "León", "San Luis Potosí",  // Mexico
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Jaipur", "Surat",  // India
    "Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri",  // Turkey
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras al-Khaimah", "Fujairah", "Umm al-Quwain", "Al Ain", "Dubai Marina", "Jumeirah",  // UAE
    "Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod", "Kazan", "Chelyabinsk", "Omsk", "Rostov-on-Don", "Ufa",  // Russia
    "Cairo", "Alexandria", "Giza", "Port Said", "Suez", "Luxor", "Aswan", "Sharm El Sheikh", "Tanta", "Ismailia",  // Egypt
    "Bangkok", "Nonthaburi", "Nakhon Ratchasima", "Chiang Mai", "Phuket", "Hatyai", "Khon Kaen", "Udon Thani", "Ayutthaya", "Rayong",  // Thailand
    "Singapore", "Jakarta", "Kuala Lumpur", "Manila", "Ho Chi Minh City", "Hanoi", "Yangon", "Brunei", "Vientiane", "Phnom Penh",  // Southeast Asia
    "Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Kalamata", "Chania", "Rhodes", "Corfu"  // Greece
];
var input_city = ""


function autocomplete(input, list, onSelect) { //educative io
    //Add an event listener to compare the input value with all countries
    input.addEventListener('input', function () {
        //Close the existing list if it is open
        closeList();

        //If the input is empty, exit the function
        if (!this.value)
            return;

        //Create a suggestions <div> and add it to the element containing the input field
        suggestions = document.createElement('div');
        suggestions.setAttribute('id', 'suggestions');
        this.parentNode.appendChild(suggestions);

        //Iterate through all entries in the list and find matches
        for (let i=0; i<list.length; i++) {
            if (list[i].toUpperCase().includes(this.value.toUpperCase())) {
                //If a match is foundm create a suggestion <div> and add it to the suggestions <div>
                suggestion = document.createElement('div');
                suggestion.innerHTML = list[i];

                suggestion.addEventListener('click', function () {
                    input.value = this.innerHTML;
                    input_city = input.value
                    closeList();
                    if (onSelect) onSelect(input_city); //cant return input_city
                });
                suggestion.style.cursor = 'pointer';

                suggestions.appendChild(suggestion);
            }
        }
    });
    function closeList() {
        let suggestions = document.getElementById('suggestions');
        if (suggestions)
            suggestions.parentNode.removeChild(suggestions);
    }
}

autocomplete(document.getElementById('city'), search_terms,handleCityCallback);

async function getDataLatLong(input) {
    const url_lat_lon = "https://nominatim.openstreetmap.org/search?q={" + input + "}&format=json";
    try {
        const response = await fetch(url_lat_lon);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        if (json.length > 0) {
            if (json.length > 1){
                console.log('more than 1 country that city');
            }
            const my_country = json[0].display_name;
            const my_lat = json[0].lat;
            const my_lon = json[0].lon;
            console.log(my_country)
            console.log('Coordinates stored successfully');
            return { lon: my_lon, lat: my_lat, selectedCountry:my_country}; // Return an object with latitude and longitude and country
        }
        else {
            throw new Error('No results found');
        }
    } catch (error) {
            console.error(error.message);
    }
}


async function fetchData(my_lon,my_lat){
    try {
        console.log("hello in the fetch data func")
        // console.log("city: " + city + " my_lat: " + my_lat + " my_lon: " + my_lon)
        apiUrllatlon = 'http://www.7timer.info/bin/api.pl?lon=' + my_lon + '&lat=' + my_lat + '&product=civil&output=json'
        const response = await fetch(apiUrllatlon)
        if (!response.ok){
            throw new Error("Could not fetch")
        }
        const data = await response.text()
        const jsondata = JSON.parse(data)
        return jsondata

    } catch (error) {
        console.error(error)
    }
}


// Function to render data in cards
async function renderData(lon,lat) {
    console.log("hello in the render data func")
    const stateChange = document.getElementById("state_change")
    // Clear any existing content in the container
    stateChange.innerHTML = "<br>Wait I have not updated";
    const stateChangeText = document.createElement('p');
    stateChange.appendChild(stateChangeText);
    
    const data = await fetchData(lon,lat);
    //console.log(data.dataseries);
    console.log(data)

    if (!data) {
        console.log("helo data crash foreach")
        return;
    }
    else{
        //start
        var prev_data = document.querySelector('.container_forecast');
        if (prev_data) {
            while (prev_data.firstChild) {
                prev_data.removeChild(prev_data.firstChild);
            }
        } else {
            console.error('Element with ID "container_forecast" not found.');
        }
        const init_date = formatDate(data.init)
        const get_curr_hour = new Date();

        const curr_hour = (get_curr_hour.getHours())
        console.log("currHour:", curr_hour)
        let starting_increment = curr_hour + (3-(curr_hour%3));
        console.log("start of increment:", starting_increment)
        let counter = 0
        const container_forecast = document.querySelector('.container_forecast');
        data.dataseries.forEach(item => {
            // console.log(item)
            const timepoint = item.timepoint;
            const temp = item.temp2m;
            let expected_timepoint = starting_increment + (counter*22)
            expected_timepoint = expected_timepoint + (3-(expected_timepoint%3));
            
            init_date.setHours(init_date.getHours() + 3);
            if (timepoint === expected_timepoint && counter <8){ 
                counter += 1;
                // console.log("temp:",temp,"timepoint:", timepoint,"init_date:",init_date);
                const card = document.createElement('div');
                card.classList.add('card');
                console.log(init_date)

                const title = document.createElement('p');
                title.textContent = init_date.toDateString();

                const body = document.createElement('h3');
                body.textContent = temp + String.fromCharCode(176) + "C";

                card.appendChild(title);
                card.appendChild(body);
                container_forecast.appendChild(card);
            }                        
        });
        const stateChange = document.getElementById("state_change")
        // Clear any existing content in the container
        stateChange.innerHTML = "<br>I have updated myself";
        const stateChangeText = document.createElement('p');
        stateChange.appendChild(stateChangeText);

    }
    
}
