async function fetchCurrencies() {
    try {
        const response = await fetch(CURRENCY_API_URL)
        if (!response.ok) throw new Error('Failed to fetch currency data.')
        const data = await response.json()
        console.log('Currency Rates:', data.rates)
        populateCurrencyDropdowns(data.rates)
    } catch (error) {
        console.error('Error fetching currencies:', error)
        const resultContainer = document.getElementById('conversion-result')
        displayError(resultContainer, 'Error fetching currency data. Please try again later.')
    }
}

function populateCurrencyDropdowns(rates) {
    console.log('Rates received:', rates)
    const fromCurrency = document.getElementById('from-currency')
    const toCurrency = document.getElementById('to-currency')

    const options = Object.keys(rates)
        .map(currency => `<option value="${currency}">${currency}</option>`)
        .join('')

    fromCurrency.innerHTML = `<option value="" disabled selected>Select currency</option>${options}`
    toCurrency.innerHTML = `<option value="" disabled selected>Select currency</option>${options}`

    fromCurrency.value = 'USD'
    toCurrency.value = 'EUR'
}

function displayError(container, message) {
    container.innerHTML = `<p class="error">${message}</p>`
}

function validateInputs(amount, fromCurrency, toCurrency) {
    if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount.')
        return false
    }
    if (!fromCurrency || !toCurrency) {
        alert('Please select valid currencies.')
        return false
    }
    return true
}

async function convertCurrency() {
    const amount = document.getElementById('amount').value.trim()
    const fromCurrency = document.getElementById('from-currency').value
    const toCurrency = document.getElementById('to-currency').value
    const resultContainer = document.getElementById('conversion-result')
    resultContainer.innerHTML = '<div class="loading-spinner"></div>'

    try {
        const response = await fetch(CURRENCY_API_URL)
        if (!response.ok) throw new Error('Failed to fetch currency data.')
    
        const data = await response.json()
        const fromRate = data.rates[fromCurrency]
        const toRate = data.rates[toCurrency]
    
        if (fromRate && toRate) {
            const conversionRate = toRate / fromRate
            const result = (amount * conversionRate).toFixed(2)
            resultContainer.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}` 
        } else {
            resultContainer.innerHTML = 'Conversion rate not available'
        }
    } catch (error) {
        console.error('Error converting currency:', error)
        resultContainer.innerHTML = '<p>Error fetching conversion rate.</p>'
    }
}

function setupCurrencyEventListeners() {
    document.getElementById('convert').addEventListener('click', convertCurrency)

    document.getElementById('from-currency').addEventListener('change', event => {
        console.log('From Currency Selected:', event.target.value)
    })

    document.getElementById('to-currency').addEventListener('change', event => {
        console.log('To Currency Selected:', event.target.value)
    })
}

fetchCurrencies()
setupCurrencyEventListeners()
