var searchBtn = document.querySelector('#search-btn');
var existingCities = document.querySelector('#searched-cities')
var weatherInfoContainer = document.querySelector('#weather-info-container');
var clearHistBtn = document.querySelector('#clear-history');


deleteHistory = () => {
    localStorage.removeItem('cities');

    existingCities.innerHTML = '';
}

cleanScreen = () => {
    weatherInfoContainer.innerHTML = '';
}

getCurrentDayWeather = (response, e) => {    
    
    if(e.target.id == 'search-btn') {
        
        var cityName = document.querySelector('#search-bar').value.trim().toLowerCase();
        var cityWords = cityName.split(' ');
        for (i = 0; i < cityWords.length; i++) {
            cityWords[i] = cityWords[i][0].toUpperCase() + cityWords[i].substr(1);
        }

        var userInput = cityWords.join(' ');
        
        //create button of the searched city so that they can go back to it
        var createCityBtn = document.createElement('button');
        createCityBtn.classList = 'btn btn-secondary col-lg-12 col-md-6 col-sm-3';
        createCityBtn.textContent = userInput;
        existingCities.appendChild(createCityBtn);

        

        saveCityToLocalStorage(userInput);
    }

    else {
        var userInput = e.target.innerText;
    }

    currentDayWeather = document.createElement('div');
    currentDayWeather.classList = 'col-12 container';
    currentDayWeather.id = 'current-day';
    weatherInfoContainer.appendChild(currentDayWeather);


    //create elements of the current day weather
    var showCityName = document.createElement('h2');
    showCityName.textContent = userInput + ' ' + new Date().toLocaleDateString();
    currentDayWeather.appendChild(showCityName);

    var weatherIcon = document.createElement('img');
    var iconCode = response.daily[0].weather[0].icon;
    var iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
    weatherIcon.setAttribute('src', iconUrl);
    currentDayWeather.appendChild(weatherIcon);

    var currentTemp = document.createElement('p');
    currentTemp.textContent = 'Temp: ' + response.daily[0].temp.day + ' ' + '\xB0' + 'F';
    currentDayWeather.appendChild(currentTemp);

    var currentWind = document.createElement('p');
    currentWind.textContent = 'Wind: ' + response.daily[0].wind_speed + ' MPH';
    currentDayWeather.appendChild(currentWind);

    var currentHumidity = document.createElement('p');
    currentHumidity.textContent = 'Humidity: ' + response.daily[0].humidity + '%';
    currentDayWeather.appendChild(currentHumidity);

    //create current day uv index
    var uvIndex = document.createElement('p');
    uvIndex.textContent = 'UV Index: ';
    
    var uvSpan = document.createElement('span');
    uvSpan.textContent = response.daily[0].uvi
    
    if(response.daily[0].uvi <= 2 ) {
        uvSpan.classList = 'uv-index favorable-uv';
    }
    else if(response.daily[0].uvi >= 7) {
        uvSpan.classList = 'uv-index severe-uv';
    }
    else {
        uvSpan.classList = 'uv-index moderate-uv';
    }
    uvIndex.appendChild(uvSpan);
    currentDayWeather.appendChild(uvIndex);
}

createCityWeather = (e) => {
    console.log(e);
    //check and see if the item clicked was a button
    if(e.target.nodeName.toLowerCase() !== 'button') {
        console.log('not button');
        return;
    }

    cleanScreen();

    //change the city name variable based on what the user clicked
    if(e.target.id == 'search-btn') {
        var cityName = document.querySelector('#search-bar').value;
    }
    else {
        var cityName = e.target.innerText
    } 
    
    var urlForData = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=f09c956aca2ff808cc4ce08e3330fb56'
    

    fetch(urlForData)
    .then((response) =>  {
        //check to see if response is ok
        if(response.ok) {
            return response.json();
        }
        else {
            alert('Error: Unable to find city. Please try to search again:)')
        }
        
    })
    .then((response) => {


        
        var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&exclude=current,minutely,hourly,alerts&appid=f09c956aca2ff808cc4ce08e3330fb56';

        return fetch(apiUrl);
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {

        getCurrentDayWeather(response, e);

        return response;
    })
    .then((response) => {
        createWeatherCards(response);
    })
    .catch((error) => {
        alert("Our servers are down please try again another time :)");
    });

}

createWeatherCards = (response) => {

    var weatherCardsContainer = document.createElement('div');
    weatherCardsContainer.classList = 'row col-12';
    weatherCardsContainer.id = 'card-container';
    weatherInfoContainer.appendChild(weatherCardsContainer);


    //create h3 explaining the days forcasted
    var daysForecast = document.createElement('h3');
    daysForecast.textContent = '5 Day Forecast:';
    weatherCardsContainer.appendChild(daysForecast);
    
    //for loop to create weather cards
    for(i = 1; i < response.daily.length - 2; i++) {
        
        var weatherCard = document.createElement('div');
        weatherCard.classList = 'card bg-dark text-white col-lg-2 col-md-3 col-sm-6 m-lg-3 m-md-2 m-sm-1';

        var cardBody = document.createElement('div');
        cardBody.classList = 'card-body';
        
        var cardTitle = document.createElement('h4');
        //figure out how to increment day by 1
        var currentDate = new Date();
        var forecastDays = new Date(currentDate.getTime() + (i * 86400000));
        cardTitle.textContent = forecastDays.toLocaleDateString();
        cardBody.appendChild(cardTitle);

        var cardIcon = document.createElement('img');
        var iconCode = response.daily[i].weather[0].icon;
        var iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        cardIcon.setAttribute('src', iconUrl);
        cardBody.appendChild(cardIcon);

        var cardTemp = document.createElement('p');
        cardTemp.textContent = 'Temp: ' + response.daily[i].temp.day + ' ' + '\xB0' + 'F';
        cardTemp.classList = 'card-text';
        cardBody.appendChild(cardTemp);

        var cardHumidity = document.createElement('p');
        cardHumidity.textContent = 'Humidity: ' + response.daily[i].humidity + '%';
        cardHumidity.classList = 'card-text';
        cardBody.appendChild(cardHumidity);

        var cardWind = document.createElement('p');
        cardWind.textContent = 'Wind: ' + response.daily[i].wind_speed + ' MPH';
        cardWind.classList = 'card-text';
        cardBody.appendChild(cardWind);

        weatherCard.appendChild(cardBody);
        weatherCardsContainer.appendChild(weatherCard);
    }
}

saveCityToLocalStorage = (userInput) => {
    var cityStorage = JSON.parse(localStorage.getItem('cities')) || [];

    cityStorage.push(userInput);
    
    localStorage.setItem('cities', JSON.stringify(cityStorage));
}

loadSearchedCitiesOnPageLoad = () => {
    var cityStorage = JSON.parse(localStorage.getItem('cities')) || [];

    for(i = 0; i < cityStorage.length; i++) {
        //create button of the searched city so that they can go back to it
        var createCityBtn = document.createElement('button');
        createCityBtn.classList = 'btn btn-secondary col-12';
        createCityBtn.textContent = cityStorage[i];
        existingCities.appendChild(createCityBtn);
    }
}

loadSearchedCitiesOnPageLoad();

//add event listener to all buttons
searchBtn.addEventListener('click', createCityWeather);
existingCities.addEventListener('click', createCityWeather);
clearHistBtn.addEventListener('click', deleteHistory);