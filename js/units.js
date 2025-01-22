document.addEventListener('DOMContentLoaded', async function () {
    const conversionType = document.getElementById('conversion-type')
    const fromUnit = document.getElementById('from-unit')
    const toUnit = document.getElementById('to-unit')
    const inputValue = document.getElementById('input-value')
    const resultValue = document.getElementById('result-value')
    const conversionResultContainer = document.getElementById('unit-conversion-result')
    let conversionData = null

    async function loadConversionData() {
        try {
            const response = await fetch('./json/units.json')
            if (!response.ok) throw new Error('Failed to fetch conversion data.')
            conversionData = await response.json()
            console.log('Conversion Data Loaded:', conversionData) 
        } catch (error) {
            console.error('Error loading conversion data:', error)
            alert('Failed to load conversion data. Please try again later.')
        }
    }

    function updateUnits() {
        const type = conversionType.value
        if (!conversionData || !conversionData[type]) {
            console.error('No data for type:', type)
            return
        }

        const units = conversionData[type].units
        const options = units.map(unit => `<option value="${unit}">${unit}</option>`).join('')

        fromUnit.innerHTML = options
        toUnit.innerHTML = options
    }

    function validateConversionInputs(value, from, to) {
        if (!value || isNaN(value)) {
            alert('Please enter a valid number.')
            return false
        }
        if (!from || !to) {
            alert('Please select valid units.')
            return false
        }
        return true
    }

function convert() {
    const value = parseFloat(inputValue.value)
    const from = fromUnit.value
    const to = toUnit.value
    const type = conversionType.value

    console.log('Conversion Type:', type)
    console.log('From Unit:', from, 'To Unit:', to)
    console.log('Input Value:', value) 

    conversionResultContainer.style.display = 'none'

    if (!validateConversionInputs(value, from, to)) return

    conversionResultContainer.innerHTML = '<div class="loading-spinner"></div>'
    conversionResultContainer.style.display = 'block'

    if (!conversionData || !conversionData[type]) {
        console.error('Conversion data not loaded for type:', type) 
        conversionResultContainer.innerHTML = '<p>Error: Conversion data not loaded.</p>'
        return
    }

    const multiplier = conversionData[type].conversions[from]?.[to]
    console.log('Multiplier:', multiplier) 

    let result
    if (type === 'temperature' && typeof multiplier === 'string') {
        try {
            const formulaFunction = eval(multiplier) 
            result = formulaFunction(value)
            console.log('Evaluated Result:', result) 
        } catch (error) {
            console.error('Error evaluating temperature formula:', error)
            conversionResultContainer.innerHTML = '<p>Error calculating temperature conversion.</p>'
            return
        }
    } else if (typeof multiplier === 'number') {
        result = value * multiplier
    } else {
        conversionResultContainer.innerHTML = '<p>Conversion not possible with selected units.</p>'
        return
    }

    if (isNaN(result)) {
        console.error('Invalid result:', result) 
        conversionResultContainer.innerHTML = '<p>Error calculating conversion result.</p>'
        return
    }

    console.log('Final Result:', result) 

    conversionResultContainer.innerHTML = `<p>${value} ${from} = ${result.toFixed(2)} ${to}</p>`
    conversionResultContainer.style.display = 'block'
}

    conversionType.addEventListener('change', updateUnits)
    document.getElementById('convert-btn').addEventListener('click', convert)

    await loadConversionData()
    updateUnits()
})
