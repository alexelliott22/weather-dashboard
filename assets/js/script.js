var searchBtn = document.querySelector('#search-btn');
var existingCities = document.querySelector('#searched-cities')
var currentDayWeather = document.querySelector('#current-day');
var weatherCardsContainer = document.querySelector('#card-container');


cleanScreen = () => {
    currentDayWeather.innerHTML = '';

    weatherCards.innerHTML = '';
}

createCityWeather = () => {
    
    cleanScreen();
    
    var cityName = document.querySelector('#search-bar').value;
    
    var urlForData = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=f09c956aca2ff808cc4ce08e3330fb56'
    

    fetch(urlForData)
    .then((response) =>  {
        return response.json();
    })
    .then((response) => {
        
        console.log(response);

        // //create button of the searched city so that they can go back to it
        // var createCityBtn = document.createElement('button');
        // createCityBtn.classList = 'btn btn-secondary col-12';
        // createCityBtn.textContent = response.name;
        // existingCities.appendChild(createCityBtn);
        
        // //create elements of the current day weather
        // var showCityName = document.createElement('h2');
        // showCityName.textContent = response.name + ' ' + new Date().toLocaleDateString();
        // currentDayWeather.appendChild(showCityName);

        // var currentTemp = document.createElement('p');
        // currentTemp.textContent = 'Temp: ' + response.main.temp + ' F';
        // currentDayWeather.appendChild(currentTemp);

        // var currentWind = document.createElement('p');
        // currentWind.textContent = 'Wind: ' + response.wind.speed + ' MPH';
        // currentDayWeather.appendChild(currentWind);

        // var currentHumidity = document.createElement('p');
        // currentHumidity.textContent = 'Humidity: ' + response.main.humidity + '%';
        // currentDayWeather.appendChild(currentHumidity);

        // var uvIndex = document.createElement('p');
        // uvIndex.textContent = 'UV Index: ';
        
        var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&exclude=current,minutely,hourly,alerts&appid=f09c956aca2ff808cc4ce08e3330fb56';

        return fetch(apiUrl)
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        
        console.log(response);

        // //create current day uv index
        // var uvSpan = document.createElement('span');
        // uvSpan.textContent = response.daily[0].uvi
        
        // if(response.daily[0].uvi <= 2 ) {
        //     uvSpan.classList = 'favorable-uv';
        // }
        // else if(response.daily[0].uvi >= 7) {
        //     uvSpan.classList = 'severe-uv';
        // }
        // else {
        //     uvSpan.classList = 'moderate-uv';
        // }
        // uvIndex.appendChild(uvSpan);
        // currentDayWeather.appendChild(uvIndex);
        
    })
    .then((response) => {
        // //create h3 explaining the days forcasted
        // var daysForecast = document.createElement('h3');
        // daysForecast.textContent = '5 Day Forecast:';
        // weatherCardsContainer.appendChild(daysForecast);
        
        
        // //for loop to create weather cards
        // for(i = 1; i < 6; i++) {
        //     var weatherCard = document.createElement('div');
        //     weatherCard.classList = 'card bg-dark text-white';

        //     var cardBody = document.createElement('div');
        //     cardBody.classList = 'card-body';
            
        //     var cardTitle = document.createElement('h4');
        //     cardTitle.textContent = 
        // }
    })

}

//figure out how to increment the date by 1 day
console.log(new Date().toLocaleDateString());

//searchBtn.addEventListener('click', createCityWeather);