async function getWeatherDescription(code) {
    try {
        const response = await fetch('./json/weather.json')
        if (!response.ok) throw new Error('Failed to fetch weather descriptions.')

        const weatherDescriptions = await response.json()
        return weatherDescriptions[code] || 'Unknown weather condition'
    } catch (error) {
        console.error('Error fetching weather descriptions:', error)
        return 'Unknown weather condition'
    }
}

async function fetchWeather(latitude, longitude) {
    const weatherResult = document.getElementById('weatherResult')
    weatherResult.innerHTML = '<div class="loading-spinner"></div>'

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch weather data.')

        const data = await response.json()
        const weatherCode = data.current_weather.weathercode
        const description = await getWeatherDescription(weatherCode)

        const result = `
            <p>Temperature: ${data.current_weather.temperature}°C</p>
            <p>Weather: ${description}</p>
            <p>Windspeed: ${data.current_weather.windspeed} km/h</p>`

        weatherResult.innerHTML = result
    } catch (error) {
        console.error('Error fetching weather data:', error)
        weatherResult.innerHTML = '<p>Error fetching weather data.</p>'
    }
}

async function fetchCitySuggestions(query) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch city suggestions.')

        const data = await response.json()
        populateCitySuggestions(data)
    } catch (error) {
        console.error('Error fetching city suggestions:', error)
        displayError('Error fetching city suggestions.')
    }
}

function populateCitySuggestions(data) {
    const citySuggestions = document.getElementById('citySuggestions')
    citySuggestions.innerHTML = ''

    if (!Array.isArray(data.results) || data.results.length === 0) {
        citySuggestions.innerHTML = '<option value="">No suggestions found</option>'
        return
    }

    data.results.forEach(location => {
        const option = document.createElement('option')
        option.value = `${location.name}, ${location.country}`
        citySuggestions.appendChild(option)
    })
}

function validateCityInput(city) {
    if (!city.trim()) {
        alert('Please enter a city name.')
        return false
    }
    return true
}

async function handleCitySearch(city) {
    if (!validateCityInput(city)) return

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        const response = await fetch(url)
        if (!response.ok) throw new Error('City not found.')

        const data = await response.json()
        if (data.results && data.results.length > 0) {
            const { latitude, longitude } = data.results[0]
            fetchWeather(latitude, longitude)
        } else {
            document.getElementById('weatherResult').innerHTML = '<p>City not found.</p>'
        }
    } catch (error) {
        console.error('Error fetching city coordinates:', error)
        document.getElementById('weatherResult').innerHTML = '<p>Error fetching city coordinates.</p>'
    }
}

function setupWeatherEventListeners() {
    const cityInput = document.getElementById('city')
    const getWeatherBtn = document.getElementById('getWeather')

    cityInput.addEventListener('input', () => {
        const query = cityInput.value.trim()
        if (query.length >= 3) {
            fetchCitySuggestions(query)
        } else {
            document.getElementById('citySuggestions').innerHTML = ''
        }
    })

    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value.trim()
        handleCitySearch(city)
    })

    cityInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            const city = cityInput.value.trim()
            handleCitySearch(city)
        }
    })
}

function initializeWeather() {
    setupWeatherEventListeners()
}

document.addEventListener('DOMContentLoaded', initializeWeather)
