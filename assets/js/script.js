var searchBtn = document.querySelector('#search-btn');
var existingCities = document.querySelector('#searched-cities')
var currentDayWeather = document.querySelector('#current-day');
var weatherCardsContainer = document.querySelector('#card-container');
var allBtns = document.querySelectorAll('.btn');


cleanScreen = () => {
    currentDayWeather.innerHTML = '';

    weatherCardsContainer.innerHTML = '';
}

getCurrentDayWeather = (response) => {    
    
    //create elements of the current day weather
    var showCityName = document.createElement('h2');
    showCityName.textContent = response.name + ' ' + new Date().toLocaleDateString();
    currentDayWeather.appendChild(showCityName);

    var weatherIcon = document.createElement('img');
    var iconCode = response.weather[0].icon;
    var iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
    weatherIcon.setAttribute('src', iconUrl);
    currentDayWeather.appendChild(weatherIcon);

    var currentTemp = document.createElement('p');
    currentTemp.textContent = 'Temp: ' + response.main.temp + ' ' + '\xB0' + 'F';
    currentDayWeather.appendChild(currentTemp);

    var currentWind = document.createElement('p');
    currentWind.textContent = 'Wind: ' + response.wind.speed + ' MPH';
    currentDayWeather.appendChild(currentWind);

    var currentHumidity = document.createElement('p');
    currentHumidity.textContent = 'Humidity: ' + response.main.humidity + '%';
    currentDayWeather.appendChild(currentHumidity);
}

createCityWeather = (e) => {
    
    //check and see if the item clicked was a button
    if(e.target.nodeName.toLowerCase() !== 'button') {
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
        return response.json();
    })
    .then((response) => {

        if(e.target.id == 'search-btn') {
            //create button of the searched city so that they can go back to it
            var createCityBtn = document.createElement('button');
            createCityBtn.classList = 'btn btn-secondary col-lg-12 col-md-6 col-sm-3';
            createCityBtn.textContent = response.name;
            existingCities.appendChild(createCityBtn);

            saveCityToLocalStorage(response);
        }

        getCurrentDayWeather(response);

        uvIndex = document.createElement('p');
        uvIndex.textContent = 'UV Index: ';
        
        var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&exclude=current,minutely,hourly,alerts&appid=f09c956aca2ff808cc4ce08e3330fb56';

        return fetch(apiUrl);
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {

        createUvSpan(response, uvIndex);

        return response;
    })
    .then((response) => {
        createWeatherCards(response);
    })

}

createUvSpan = (response, uvIndex) => {
    //create current day uv index
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

createWeatherCards = (response) => {

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

saveCityToLocalStorage = (response) => {
    var cityStorage = JSON.parse(localStorage.getItem('cities')) || [];

    cityStorage.push(response.name);
    
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