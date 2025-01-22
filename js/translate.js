async function populateLanguages() {
    try {
        const response = await fetch('./json/languages.json')
        if (!response.ok) throw new Error('Failed to fetch languages')

        const languages = await response.json()
        const sourceLangDropdown = document.getElementById('source-lang')
        const targetLangDropdown = document.getElementById('target-lang')

        const options = languages
            .map(language => `<option value="${language.code}">${language.name}</option>`)
            .join('')

        sourceLangDropdown.innerHTML = options
        targetLangDropdown.innerHTML = options

        sourceLangDropdown.value = 'en' // Default: English
        targetLangDropdown.value = 'es' // Default: Spanish
    } catch (error) {
        console.error('Error fetching languages:', error)
        alert('Failed to fetch language list. Please try again later.')
    }
}

function validateTranslationInputs(text, sourceLang, targetLang) {
    if (!text) {
        alert('Please enter text to translate.')
        return false
    }
    if (!sourceLang || !targetLang) {
        alert('Please select both source and target languages.')
        return false
    }
    return true
}

async function translateText() {
    const text = document.getElementById('text-to-translate').value.trim()
    const sourceLang = document.getElementById('source-lang').value
    const targetLang = document.getElementById('target-lang').value
    const resultContainer = document.getElementById('translation-result')

    if (!validateTranslationInputs(text, sourceLang, targetLang)) return

    // Show the loading spinner
    resultContainer.innerHTML = '<div class="loading-spinner"></div>'

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
        )
        if (!response.ok) throw new Error('Failed to fetch translation.')

        const data = await response.json()

        if (data.responseData && data.responseData.translatedText) {
            resultContainer.textContent = data.responseData.translatedText
        } else {
            resultContainer.textContent = 'Translation failed.'
        }
    } catch (error) {
        console.error('Error translating text:', error)
        resultContainer.innerHTML = '<p>Error fetching translation. Please try again later.</p>'
    }
}

function setupTranslationEventListeners() {
    document.getElementById('translate-btn').addEventListener('click', translateText)
}

// Initialize translator
function initializeTranslator() {
    populateLanguages()
    setupTranslationEventListeners()
}

document.addEventListener('DOMContentLoaded', initializeTranslator)


