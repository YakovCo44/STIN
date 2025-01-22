document.addEventListener('DOMContentLoaded', function () {
    const todoInput = document.getElementById('todo-input')
    const addTaskBtn = document.getElementById('add-task-btn')
    const todoTasks = document.getElementById('todo-tasks')

    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('todoTasks')) || []
    }

    function storeTasks(tasks) {
        localStorage.setItem('todoTasks', JSON.stringify(tasks))
    }

    function saveTasks() {
        const tasks = []
        document.querySelectorAll('#todo-tasks li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed'),
            })
        })
        storeTasks(tasks)
    }

    function createTaskElement(taskText, completed = false) {
        const li = document.createElement('li')
        li.classList.toggle('completed', completed)

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = completed
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked)
            saveTasks()
        })

        const taskSpan = document.createElement('span')
        taskSpan.textContent = taskText

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '✕'
        deleteBtn.addEventListener('click', () => {
            li.remove()
            saveTasks()
        })

        li.appendChild(checkbox)
        li.appendChild(taskSpan)
        li.appendChild(deleteBtn)
        return li
    }

    function addTask() {
        const taskText = todoInput.value.trim()
        console.log('Task Text:', taskText)
        if (taskText === '') {
            alert('Please enter a task.')
            return
        }

        const taskElement = createTaskElement(taskText)
        todoTasks.appendChild(taskElement)

        todoInput.value = ''
        saveTasks()
    }

    function loadTasks() {
        const savedTasks = getStoredTasks()
        todoTasks.innerHTML = ''
        savedTasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.completed)
            todoTasks.appendChild(taskElement)
        })
    }

    addTaskBtn.addEventListener('click', () => {
        console.log('Add Task button clicked') 
        addTask()
    })

    todoInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed') 
            addTask()
        }
    })

    loadTasks()
})

