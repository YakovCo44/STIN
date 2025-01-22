const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest'
const cityInput = document.getElementById('city')
const citySuggestions = document.getElementById('citySuggestions')
const weatherResult = document.getElementById('weatherResult')

function updateClock() {
    const clockContainer = document.getElementById('clock-container')
    const now = new Date()

    const hours = String(now.getHours()).padStart(2, '0') 
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    clockContainer.textContent = `${hours}:${minutes}:${seconds}`
}

setInterval(updateClock, 1000)
updateClock()

function updateDate() {
    const dateContainer = document.getElementById('date-container')
    const now = new Date()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = now.toLocaleDateString(undefined, options)

    dateContainer.textContent = formattedDate
}

updateDate()

