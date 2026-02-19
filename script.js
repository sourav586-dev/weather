// Weather App JavaScript - Beginner Friendly!

// API configuration - Using OpenWeatherMap API (free tier)
const API_KEY = '29f46799f975b8460599b66491afb4c2'; // This is a demo key - you can get your own free key from openweathermap.org
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const tempValue = document.getElementById('tempValue');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Weather animation elements
const sun = document.getElementById('sun');
const clouds = document.getElementById('clouds');
const rain = document.getElementById('rain');
const snow = document.getElementById('snow');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather App loaded! 🌤️');
    
    // Add event listeners
    searchBtn.addEventListener('click', searchWeather);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    // Try to get user's location automatically
    getUserLocation();
});

// Get user's location using browser's geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            function(error) {
                console.log('Location access denied, using default city');
                fetchWeatherByCity('London'); // Default city
            }
        );
    } else {
        console.log('Geolocation not supported, using default city');
        fetchWeatherByCity('London'); // Default city
    }
}

// Search weather by city name or PIN code
function searchWeather() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        alert('Please enter a city name or PIN code');
        return;
    }
    
    // Check if input looks like a PIN code (numbers only, 5-6 digits)
    if (/^\d{5,6}$/.test(searchTerm)) {
        // For PIN codes, we'll treat it as a city name for simplicity
        // In a real app, you'd convert PIN to coordinates
        fetchWeatherByCity(searchTerm);
    } else {
        // Treat as city name
        fetchWeatherByCity(searchTerm);
    }
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert('City not found. Please try again with a valid city name.');
        console.error('Error fetching weather:', error);
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather by coords:', error);
        fetchWeatherByCity('London'); // Fallback to default city
    }
}

// Display weather data
function displayWeather(data) {
    console.log('Weather data received:', data);
    
    // Update city name
    cityName.textContent = data.name + ', ' + data.sys.country;
    
    // Update temperature
    tempValue.textContent = Math.round(data.main.temp);
    
    // Update weather icon and description
    const weatherMain = data.weather[0].main;
    const weatherDesc = data.weather[0].description;
    weatherDescription.textContent = weatherDesc;
    
    // Set weather icon based on weather condition
    setWeatherIcon(weatherMain);
    
    // Update weather details
    visibility.textContent = (data.visibility / 1000).toFixed(1) + ' km';
    humidity.textContent = data.main.humidity + '%';
    windSpeed.textContent = data.wind.speed + ' m/s';
    
    // Update background animation based on weather
    updateWeatherAnimation(weatherMain);
}

// Set weather icon based on weather condition
function setWeatherIcon(weatherMain) {
    const iconElement = weatherIcon.querySelector('i');
    
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            iconElement.className = 'fas fa-sun';
            break;
        case 'clouds':
            iconElement.className = 'fas fa-cloud';
            break;
        case 'rain':
        case 'drizzle':
            iconElement.className = 'fas fa-cloud-rain';
            break;
        case 'thunderstorm':
            iconElement.className = 'fas fa-bolt';
            break;
        case 'snow':
            iconElement.className = 'fas fa-snowflake';
            break;
        case 'mist':
        case 'fog':
            iconElement.className = 'fas fa-smog';
            break;
        default:
            iconElement.className = 'fas fa-question';
    }
}

// Update weather animation based on weather condition
function updateWeatherAnimation(weatherMain) {
    // Hide all animations first
    sun.classList.remove('active');
    clouds.classList.remove('active');
    rain.classList.remove('active');
    snow.classList.remove('active');
    
    // Show appropriate animation based on weather
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            sun.classList.add('active');
            break;
        case 'clouds':
            clouds.classList.add('active');
            break;
        case 'rain':
        case 'drizzle':
            clouds.classList.add('active');
            rain.classList.add('active');
            break;
        case 'thunderstorm':
            clouds.classList.add('active');
            rain.classList.add('active');
            break;
        case 'snow':
            snow.classList.add('active');
            break;
        case 'mist':
        case 'fog':
            clouds.classList.add('active');
            break;
        default:
            sun.classList.add('active'); // Default to clear weather
    }
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add pulse effect to search button
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    searchBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Add floating animation to weather card
    const weatherCard = document.querySelector('.weather-card');
    weatherCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    weatherCard.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Error handling for API failures
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    if (e.message.includes('fetch')) {
        alert('Network error. Please check your internet connection.');
    }
});

// Make it work offline with cached data
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}