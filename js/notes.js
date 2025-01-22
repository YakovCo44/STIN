document.addEventListener('DOMContentLoaded', function () {
    const noteInput = document.getElementById('note-input')
    const addNoteBtn = document.getElementById('add-note-btn')
    const notesList = document.getElementById('notes-list')
    const myNotesTitle = document.getElementById('my-notes-title')

    function getStoredNotes() {
        return JSON.parse(localStorage.getItem('notes')) || []
    }

    function storeNotes(notes) {
        localStorage.setItem('notes', JSON.stringify(notes))
        myNotesTitle.style.display = notes.length > 0 ? 'block' : 'none'
    }

    function loadNotes() {
        const notes = getStoredNotes()
        notesList.innerHTML = ''
        if (notes.length > 0) myNotesTitle.style.display = 'block'
        notes.forEach((note, index) => createNoteElement(note, index))
    }

    function saveNotes() {
        const notes = []
        document.querySelectorAll('#notes-list li textarea').forEach(noteTextarea => {
            notes.push(noteTextarea.value)
        })
        storeNotes(notes)
    }

    function createButton(text, onClick) {
        const button = document.createElement('button')
        button.textContent = text
        button.addEventListener('click', onClick)
        return button
    }

    function createNoteElement(noteText) {
        const li = document.createElement('li')

        const noteTextarea = document.createElement('textarea')
        noteTextarea.value = noteText
        noteTextarea.rows = 3
        noteTextarea.addEventListener('input', saveNotes)
        li.appendChild(noteTextarea)

        const deleteBtn = createButton('✕', () => {
            li.remove()
            saveNotes()
        })
        li.appendChild(deleteBtn)

        notesList.appendChild(li)
    }

    addNoteBtn.addEventListener('click', () => {
        const noteText = noteInput.value.trim()
        if (noteText === '') {
            alert('Please enter a note.')
            return
        }

        createNoteElement(noteText)
        saveNotes()
        noteInput.value = ''
    })

    loadNotes()
})
