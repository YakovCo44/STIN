const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
}

function updateDisplay() {
    const display = document.getElementById('calc-input')
    display.value = calculator.displayValue
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator

    if (waitingForSecondOperand) {
        calculator.displayValue = digit
        calculator.waitingForSecondOperand = false
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, waitingForSecondOperand } = calculator
    const inputValue = parseFloat(displayValue)

    if (operator && waitingForSecondOperand) {
        calculator.operator = nextOperator
        return
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator)

        if (operator === '/' && inputValue === 0) {
            alert('Division by zero is not allowed.')
            calculator.displayValue = '0'
            calculator.firstOperand = null
            calculator.operator = null
            return
        }

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`
        calculator.firstOperand = result
    }

    calculator.waitingForSecondOperand = true
    calculator.operator = nextOperator
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand
        case '-':
            return firstOperand - secondOperand
        case '*':
            return firstOperand * secondOperand
        case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : NaN
        default:
            return secondOperand
    }
}

function resetCalculator() {
    calculator.displayValue = '0'
    calculator.firstOperand = null
    calculator.waitingForSecondOperand = false
    calculator.operator = null
}

function handleInput(id, value) {
    switch (id) {
        case 'calc-clear':
            resetCalculator()
            break
        case 'calc-equals':
            handleOperator(null)
            break
        case '.':
            inputDecimal(value)
            break
        default:
            if (isNaN(value)) handleOperator(value)
            else inputDigit(value)
    }
    updateDisplay()
}

const calcButtons = document.getElementById('calc-buttons')
calcButtons.addEventListener('click', event => {
    const { target } = event
    if (!target.classList.contains('calc-btn')) return

    const { value } = target.dataset
    handleInput(target.id, value)
})

updateDisplay()
