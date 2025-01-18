const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest'
const cityInput = document.getElementById('city')
const citySuggestions = document.getElementById('citySuggestions')
const weatherResult = document.getElementById('weatherResult')

const getWeatherDescription = code => {
    const weatherDescriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snowfall',
        73: 'Moderate snowfall',
        75: 'Heavy snowfall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Slight thunderstorm',
        96: 'Moderate thunderstorm',
        99: 'Severe thunderstorm'
    }
    return weatherDescriptions[code] || 'Unknown weather condition'
}

const fetchWeather = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch weather data')

        const data = await response.json()
        const weatherCode = data.current_weather.weathercode
        console.log('Weather Code:', weatherCode) 
        const description = getWeatherDescription(weatherCode)
        const result = `
            <p>Temperature: ${data.current_weather.temperature}°C</p>
            <p>Weather: ${description}</p>
            <p>Windspeed: ${data.current_weather.windspeed} km/h</p>`
        document.getElementById('weatherResult').innerHTML = result
    } catch (error) {
        console.error('Error fetching weather data:', error)
        if (!document.getElementById('weatherResult').innerHTML.includes('Error')) {
    document.getElementById('weatherResult').innerHTML = '<p>Error fetching weather data</p>'
}

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

cityInput.addEventListener('keydown', async event => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim()
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
                weatherResult.innerHTML = '<p>City not found</p>'
            }
        } catch (error) {
            console.error('Error fetching city coordinates:', error)
            weatherResult.innerHTML = '<p>Error fetching city coordinates</p>'
        }
    }
})

const fetchCurrencies = async () => {
    try {
        const response = await fetch(CURRENCY_API_URL)
        const data = await response.json()

        console.log('Currency Rates:', data.rates) 

        populateCurrencyDropdowns(data.rates)
    } catch (error) {
        console.error('Error fetching currencies:', error)
    }
}

const populateCurrencyDropdowns = rates => {
    console.log('Rates received:', rates)
    const fromCurrency = document.getElementById('from-currency')
    const toCurrency = document.getElementById('to-currency')
    fromCurrency.innerHTML = '<option value="" disabled selected>Select currency</option>'
toCurrency.innerHTML = '<option value="" disabled selected>Select currency</option>'


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
    const resultContainer = document.getElementById('conversion-result')

    if (!resultContainer) {
        console.error('Conversion result container not found')
        return
    }

    if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount')
        return
    }

    try {
        const response = await fetch(CURRENCY_API_URL)
        const data = await response.json()

        const fromRate = data.rates[fromCurrency]
        const toRate = data.rates[toCurrency]

        if (fromRate && toRate) {
            const conversionRate = toRate / fromRate
            const result = (amount * conversionRate).toFixed(2)
            resultContainer.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}` 
        } else {
            resultContainer.textContent = 'Conversion rate not available'
        }
    } catch (error) {
        console.error('Error converting currency:', error)
        resultContainer.textContent = 'Error fetching conversion rate'
    }
}

document.getElementById('convert').addEventListener('click', convertCurrency)

document.getElementById('from-currency').addEventListener('change', event => {
    console.log('From Currency Selected:', event.target.value) 
})

document.getElementById('to-currency').addEventListener('change', event => {
    console.log('To Currency Selected:', event.target.value) 
})

fetchCurrencies()

const populateLanguages = async () => {
    try {
        const response = await fetch('languages.json') 
        if (!response.ok) throw new Error('Failed to fetch languages')

        const languages = await response.json()
        const sourceLangDropdown = document.getElementById('source-lang')
        const targetLangDropdown = document.getElementById('target-lang')

        sourceLangDropdown.innerHTML = ''
        targetLangDropdown.innerHTML = ''

        languages.forEach(language => {
            const sourceOption = document.createElement('option')
            sourceOption.value = language.code
            sourceOption.textContent = language.name

            const targetOption = sourceOption.cloneNode(true) // Clone for the target dropdown

            sourceLangDropdown.appendChild(sourceOption)
            targetLangDropdown.appendChild(targetOption)
        })

        sourceLangDropdown.value = 'en' // Default to English
        targetLangDropdown.value = 'es' // Default to Spanish
    } catch (error) {
        console.error('Error fetching languages:', error)
        alert('Failed to fetch language list. Please try again later.')
    }
}

document.addEventListener('DOMContentLoaded', populateLanguages)


const translateText = async () => {
    const text = document.getElementById('text-to-translate').value.trim()
    const sourceLang = document.getElementById('source-lang').value
    const targetLang = document.getElementById('target-lang').value
    const resultContainer = document.getElementById('translation-result')

    if (!text) {
        alert('Please enter text to translate')
        return
    }

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
        )
        const data = await response.json()

        if (data.responseData && data.responseData.translatedText) {
            resultContainer.textContent = data.responseData.translatedText
        } else {
            resultContainer.textContent = 'Translation failed'
        }
    } catch (error) {
        console.error('Error translating text:', error)
        resultContainer.textContent = 'Error translating text'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateLanguages() 
})

document.getElementById('translate-btn').addEventListener('click', translateText)

const calculator = {
    displayValue: '0', 
    firstOperand: null,
    waitingForSecondOperand: false, 
    operator: null 
}

const updateDisplay = () => {
    const display = document.getElementById('calc-input')
    display.value = calculator.displayValue
}

const inputDigit = digit => {
    const { displayValue, waitingForSecondOperand } = calculator

    if (waitingForSecondOperand) {
        calculator.displayValue = digit
        calculator.waitingForSecondOperand = false
    } else {
        calculator.displayValue =
            displayValue === '0' ? digit : displayValue + digit
    }
}

const inputDecimal = dot => {
    if (calculator.waitingForSecondOperand) return

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot
    }
}

const handleOperator = nextOperator => {
    const { firstOperand, displayValue, operator, waitingForSecondOperand } =
        calculator
    const inputValue = parseFloat(displayValue)

    if (operator && waitingForSecondOperand) {
        calculator.operator = nextOperator
        return
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator)

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`
        calculator.firstOperand = result
    }

    calculator.waitingForSecondOperand = true
    calculator.operator = nextOperator
}

const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand
        case '-':
            return firstOperand - secondOperand
        case '*':
            return firstOperand * secondOperand
        case '/':
            return firstOperand / secondOperand
        default:
            return secondOperand
    }
}

const resetCalculator = () => {
    calculator.displayValue = '0'
    calculator.firstOperand = null
    calculator.waitingForSecondOperand = false
    calculator.operator = null
}

document.getElementById('calc-buttons').addEventListener('click', event => {
    const { target } = event
    const { value } = target.dataset

    if (!target.classList.contains('calc-btn')) return

    if (target.id === 'calc-clear') {
        resetCalculator()
        updateDisplay()
        return
    }

    if (target.id === 'calc-equals') {
        handleOperator(null)
        updateDisplay()
        return
    }

    if (target.classList.contains('operator')) {
        handleOperator(value)
        updateDisplay()
        return
    }

    if (value === '.') {
        inputDecimal(value)
    } else {
        inputDigit(value)
    }

    updateDisplay()
})

updateDisplay()





