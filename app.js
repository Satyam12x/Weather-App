const apiKey = "0a692fbe0badf9cea966c1248fcbdae7"; 

document.addEventListener('DOMContentLoaded', function () {

    const cityInput = document.getElementById("city-input");
    const searchBtn = document.getElementById("search-btn");
    const errorMessage = document.getElementById("error-message");
    const weatherInfo = document.getElementById("weather-info");
    const weatherDetails = document.getElementById("weather-details");
    const viewMoreBtn = document.getElementById("view-more-btn");

    const cityNameElement = document.getElementById("city-name");
    const tempElement = document.getElementById("temp");
    const weatherIcon = document.getElementById("weather-icon-img");

    const feelsLikeElement = document.getElementById("feels-like");
    const humidityElement = document.getElementById("humidity");
    const windSpeedElement = document.getElementById("wind-speed");
    const pressureElement = document.getElementById("pressure");
    const cloudinessElement = document.getElementById("cloudiness");
    const visibilityElement = document.getElementById("visibility");
    const sunriseElement = document.getElementById("sunrise");
    const sunsetElement = document.getElementById("sunset");
    const timezoneElement = document.getElementById("timezone");
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");
    const weatherDescriptionElement = document.getElementById("weather-description");
    const countryElement = document.getElementById("country-name"); // Added country element

    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            const cityName = cityInput.value.trim();
            if (cityName === "") {
                displayError("Please enter a city name.");
                shakeInput();
            } else {
                getWeatherData(cityName);
            }
        });
    }

    async function getCountryData(code) {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        return {
            name: data[0]?.name.common || code,
            flag: data[0]?.flags?.svg || ""
        };
    }

    if (cityInput) {
        cityInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                const cityName = cityInput.value.trim();
                if (cityName === "") {
                    displayError("Please enter a city name.");
                    shakeInput();
                } else {
                    getWeatherData(cityName);
                }
            }
        });
    }

    // Make this function async so we can use await for getCountryData
    async function getWeatherData(city) {
        try {
            clearWeatherData();

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);

            if (!response.ok) {
                throw new Error("City not found! Please enter a valid city");
            }

            const data = await response.json();
            await displayWeatherData(data); // await the display function as it calls async getCountryData

        } catch (error) {
            displayError(error.message);
        }
    }

    function displayError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
        if (weatherInfo) {
            weatherInfo.style.display = "none";
        }
    }

    function clearWeatherData() {
        if (errorMessage) errorMessage.style.display = "none";
        if (weatherInfo) weatherInfo.style.display = "none";

        cityNameElement.textContent = "";
        tempElement.textContent = "";
        if (weatherIcon) weatherIcon.src = "";
        weatherDescriptionElement.textContent = "";
        feelsLikeElement.textContent = "";
        humidityElement.textContent = "";
        windSpeedElement.textContent = "";
        pressureElement.textContent = "";
        cloudinessElement.textContent = "";
        visibilityElement.textContent = "";
        sunriseElement.textContent = "";
        sunsetElement.textContent = "";
        timezoneElement.textContent = "";
        latitudeElement.textContent = "";
        longitudeElement.textContent = "";
    }

    // Now this function is async and awaits getCountryData
    async function displayWeatherData(data) {
        const main = data.main;
        const weather = data.weather[0];
        const wind = data.wind;
        const sys = data.sys;

        const countryCode = data.sys.country;
        const countryData = await getCountryData(countryCode); // Correctly await the async function

        // Set country name and flag if available
        if (countryElement) {
            countryElement.textContent = `${countryData.name}`;
            // If you wish to display the flag, you can do this:
            // document.querySelector(".flag").innerHTML = `<img src="${countryData.flag}" alt="Flag of ${countryData.name}">`;
        }

        cityNameElement.textContent = `${data.name}`;
        tempElement.textContent = `${Math.floor(main.temp)}`;

        if (weatherIcon) weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}.png`;

        const description = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
        weatherDescriptionElement.textContent = `${description}`;

        feelsLikeElement.textContent = `${Math.floor(main.feels_like)}°C`;
        humidityElement.textContent = `${main.humidity} %`;
        windSpeedElement.textContent = `${wind.speed} m/s`;
        pressureElement.textContent = `${main.pressure} hPa`;
        cloudinessElement.textContent = `${data.clouds.all}%`;
        visibilityElement.textContent = `${data.visibility / 1000} km`;
        sunriseElement.textContent = new Date(sys.sunrise * 1000).toLocaleTimeString();
        sunsetElement.textContent = new Date(sys.sunset * 1000).toLocaleTimeString();
        timezoneElement.textContent = `UTC${data.timezone / 3600}`;
        latitudeElement.textContent = `${data.coord.lat}°`;
        longitudeElement.textContent = `${data.coord.lon}°`;

        if (weatherInfo) weatherInfo.style.display = "block";
    }

    viewMoreBtn.addEventListener('click', function () {
        if (weatherDetails.classList.contains('expand')) {
            weatherDetails.classList.remove('expand');
            viewMoreBtn.textContent = 'View More';
        } else {
            weatherDetails.classList.add('expand');
            viewMoreBtn.textContent = 'View Less';
        }
    });

    function shakeInput() {
        if (cityInput) {
            cityInput.classList.add("shake");
            setTimeout(() => {
                cityInput.classList.remove("shake");
            }, 600);
        }
    }

});
