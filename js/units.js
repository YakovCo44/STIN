document.addEventListener('DOMContentLoaded', async function () {
    const conversionType = document.getElementById('conversion-type')
    const fromUnit = document.getElementById('from-unit')
    const toUnit = document.getElementById('to-unit')
    const inputValue = document.getElementById('input-value')
    const resultValue = document.getElementById('result-value')
    let conversionData = null
  
    async function loadConversionData() {
      try {
        const response = await fetch('./json/units.json')
        if (!response.ok) throw new Error('Failed to fetch conversion data')
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
      fromUnit.innerHTML = ''
      toUnit.innerHTML = ''
  
      units.forEach(unit => {
        const option1 = document.createElement('option')
        option1.value = unit
        option1.textContent = unit
        fromUnit.appendChild(option1)
  
        const option2 = document.createElement('option')
        option2.value = unit
        option2.textContent = unit
        toUnit.appendChild(option2)
      })
    }
  
  function convert() {
    console.log('Convert button clicked')
    console.log('Conversion Type:', conversionType.value)
    console.log('Input Value:', inputValue.value)
    console.log('From Unit:', fromUnit.value)
    console.log('To Unit:', toUnit.value)
  
    const type = conversionType.value
    const value = parseFloat(inputValue.value)
    const from = fromUnit.value
    const to = toUnit.value
  
    document.getElementById('unit-conversion-result').style.display = 'none'
  
    if (!conversionData || !conversionData[type]) {
      resultValue.textContent = 'Error: Conversion data not loaded'
      document.getElementById('unit-conversion-result').style.display = 'block'
      console.log('Error: Conversion data not loaded')
      return
    }
  
    if (!value || isNaN(value)) {
      resultValue.textContent = 'Please enter a valid number'
      document.getElementById('unit-conversion-result').style.display = 'block'
      console.log('Error: Invalid input value')
      return
    }
  
    const multiplier = conversionData[type].conversions[from]?.[to]
    if (multiplier === undefined) {
      resultValue.textContent = 'Conversion not possible with selected units'
      document.getElementById('unit-conversion-result').style.display = 'block'
      console.log('Error: Invalid units selected')
      return
    }
  
    const result = value * multiplier
    resultValue.textContent = `${result.toFixed(2)} ${to}`
    document.getElementById('unit-conversion-result').style.display = 'block'
    console.log('Conversion Result:', result)
  }
  
    conversionType.addEventListener('change', updateUnits)
    document.getElementById('convert-btn').addEventListener('click', convert)
  
    await loadConversionData()
    updateUnits()
  })