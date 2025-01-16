import { getWeatherDescription } from './service.js'

const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest'
const cityInput = document.getElementById('city')
const citySuggestions = document.getElementById('citySuggestions')
const weatherResult = document.getElementById('weatherResult')

const fetchWeather = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch weather data')

        const data = await response.json()
        const description = getWeatherDescription(data.current_weather.weathercode)

        const result = `
            <p>Temperature: ${data.current_weather.temperature}°C</p>
            <p>Weather: ${description}</p>
            <p>Windspeed: ${data.current_weather.windspeed} km/h</p>
        `
        document.getElementById('weatherResult').innerHTML = result
    } catch (error) {
        console.error('Error fetching weather data:', error)
        document.getElementById('weatherResult').innerHTML = '<p>Error fetching weather data</p>'
    }
}

document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('city').value.trim()
    if (!city) {
        alert('Please enter a city name')
        return
    }

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        if (!response.ok) throw new Error('City not found')

        const data = await response.json()

        if (data.results && data.results.length > 0) {
            const { latitude, longitude } = data.results[0]
            fetchWeather(latitude, longitude) 
        } else {
            document.getElementById('weatherResult').innerHTML = '<p>City not found</p>'
        }
    } catch (error) {
        console.error('Error fetching city coordinates:', error)
        document.getElementById('weatherResult').innerHTML = '<p>Error fetching city coordinates</p>'
    }
})

const displayWeather = data => {
    if (data.cod === 200) {
        const result = `
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `
        weatherResult.innerHTML = result
    } else {
        weatherResult.innerHTML = '<p>City not found</p>'
    }
}

const handleError = (message, error) => {
    console.error(message, error)
    weatherResult.innerHTML = `<p>${message}</p>`
}

const fetchCitySuggestions = query => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`)
        .then(response => response.json())
        .then(data => populateCitySuggestions(data))
        .catch(error => handleError('Error fetching city suggestions', error))
}

const populateCitySuggestions = data => {
    if (!Array.isArray(data.results)) {
        handleError('City suggestions format is incorrect', null)
        return
    }
    citySuggestions.innerHTML = ''
    data.results.forEach(location => {
        const option = document.createElement('option')
        option.value = `${location.name}, ${location.country}`
        citySuggestions.appendChild(option)
    })
}

cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim()
    if (query.length < 3) {
        citySuggestions.innerHTML = ''
        return
    }
    fetchCitySuggestions(query)
})

cityInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim()
        if (!city) {
            alert('Please enter a city name')
            return
        }
        fetchWeather(city)
    }
})

const fetchCurrencies = async () => {
    try {
        const response = await fetch(CURRENCY_API_URL)
        const data = await response.json()
        populateCurrencyDropdowns(data.rates)
    } catch (error) {
        console.error('Error fetching currencies:', error)
    }
}

const populateCurrencyDropdowns = rates => {
    const fromCurrency = document.getElementById('from-currency')
    const toCurrency = document.getElementById('to-currency')
    Object.keys(rates).forEach(currency => {
        const optionFrom = document.createElement('option')
        const optionTo = document.createElement('option')
        optionFrom.value = currency
        optionTo.value = currency
        optionFrom.textContent = currency
        optionTo.textContent = currency
        fromCurrency.appendChild(optionFrom)
        toCurrency.appendChild(optionTo)
    })
    fromCurrency.value = 'USD'
    toCurrency.value = 'EUR'
}

const convertCurrency = async () => {
    const amount = document.getElementById('amount').value
    const fromCurrency = document.getElementById('from-currency').value
    const toCurrency = document.getElementById('to-currency').value
    if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount')
        return
    }
    try {
        const response = await fetch(`${CURRENCY_API_URL}/${fromCurrency}`)
        const data = await response.json()
        const conversionRate = data.rates[toCurrency]
        if (conversionRate) {
            const result = (amount * conversionRate).toFixed(2)
            document.getElementById('conversion-result').textContent = 
                `${amount} ${fromCurrency} = ${result} ${toCurrency}`
        } else {
            document.getElementById('conversion-result').textContent = 
                'Conversion rate not available'
        }
    } catch (error) {
        console.error('Error converting currency:', error)
    }
}

document.getElementById('convert').addEventListener('click', convertCurrency)

fetchCurrencies()
