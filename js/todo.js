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
        } catch (error) {
            console.error('Error loading conversion data:', error)
            alert('Failed to load conversion data. Please try again later.')
        }
    }

    function updateUnits() {
        const type = conversionType.value
        if (!conversionData || !conversionData[type]) return

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

        conversionResultContainer.style.display = 'none'

        if (!validateConversionInputs(value, from, to)) return

        conversionResultContainer.innerHTML = '<div class="loading-spinner"></div>'
        conversionResultContainer.style.display = 'block'

        if (!conversionData || !conversionData[type]) {
            resultValue.textContent = 'Error: Conversion data not loaded.'
            conversionResultContainer.style.display = 'block'
            return
        }

        const multiplier = conversionData[type].conversions[from]?.[to]
        if (multiplier === undefined) {
            resultValue.textContent = 'Conversion not possible with selected units.'
            conversionResultContainer.style.display = 'block'
            return
        }

        const result = value * multiplier
        resultValue.textContent = `${result.toFixed(2)} ${to}`
        conversionResultContainer.style.display = 'block'
    }

    conversionType.addEventListener('change', updateUnits)
    document.getElementById('convert-btn').addEventListener('click', convert)

    await loadConversionData()
    updateUnits()
})
