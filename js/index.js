const input = document.querySelector('.input')
const addBtn = document.querySelector('.btn__add')
const tasks = document.querySelector('.block__tasks')
const deleteBtn = document.querySelector('.btn__delete')
const checkBtn = document.querySelector('.btn__check')
let taskItem
let myTasks = []
let num = 0

input.addEventListener('change', (event) => {
    taskItem = {
        name: event.target.value,
        done: false,
        id: num
    }
    num++
    addTask()
})

addBtn.addEventListener('click', addTask)

function addTask() {
    if(taskItem) {
        myTasks.push(taskItem)
        createTaskItem(taskItem)
        input.value = ''
        taskItem = ''
    }
}

function createTaskItem(item) {
    const taskBlock = document.createElement("div");
    taskBlock.classList.add('task-block')
    taskBlock.classList.add('add-task')
    taskBlock.id = `${item.id}`

    const newTask = document.createElement("input");
    newTask.disabled = true
    newTask.spellcheck= false
    newTask.classList.add('task')
    newTask.value = `${item.name}`
    if(item.done) {
        newTask.classList.add('done')
    }

    const deleteTask = document.createElement("div");
    deleteTask.classList.add('delete')
    if (window.screen.width > 992) {
        deleteTask.classList.add('hidden')
    }

    deleteTask.innerHTML = '<i class="fas fa-trash-alt"></i>'

    const editTask = document.createElement("div");
    editTask.classList.add('edit')
    if (window.screen.width > 992) {
        editTask.classList.add('hidden')
    }

    editTask.innerHTML = '<i class="fas fa-pen"></i>'

    tasks.append(taskBlock)
    taskBlock.append(newTask)
    taskBlock.append(deleteTask)
    taskBlock.append(editTask)

    taskBlock.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' && editTask.innerHTML === '<i class="fas fa-pen"></i>') {
            newTask.classList.toggle('done')
            newTask.classList.contains('done') ? item.done = true : item.done = false

            sortTask()
        }
    })

    taskBlock.addEventListener('mouseover', (e) => {
        editTask.classList.remove('hidden')
        deleteTask.classList.remove('hidden')
    })

    taskBlock.addEventListener('mouseout', (e) => {
        editTask.classList.add('hidden')
        deleteTask.classList.add('hidden')
    })

    editTask.addEventListener('click', (e) => {
        newTask.classList.remove('done')
        item.done = false
        if (editTask.innerHTML === '<i class="fas fa-pen"></i>') {
            newTask.disabled = false
            newTask.focus()
            editTask.innerHTML = '<i class="fa-solid fa-check"></i>'
        } else {
            item.name = e.currentTarget.parentNode.firstChild.value
            newTask.disabled = true
            editTask.innerHTML = '<i class="fas fa-pen"></i>'
        }
        newTask.addEventListener('change', (event) => {
            item.name = event.target.value
            newTask.disabled = true
            editTask.innerHTML = '<i class="fas fa-pen"></i>'
        })

    })

    deleteTask.addEventListener('click', () => {
        taskBlock.classList.remove('add-task')
        taskBlock.classList.add('delete-task')
        myTasks = myTasks.filter(el => {
            return (el.id) !== (item.id)
        })
        num = myTasks.length
        taskBlock.remove()

    })

}

function sortTask() {
    myTasks.sort((a, b) => {
        return a.done - b.done
    })
    tasks.innerHTML = ''
    myTasks.forEach(item => {
        createTaskItem(item)
    })
}

function setLocalStorage () {
        myTasks = JSON.stringify(myTasks)
        localStorage.setItem('myTasks', myTasks)
}

window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage () {
    if (localStorage.getItem('myTasks')) {
        myTasks = JSON.parse(localStorage.getItem('myTasks'))

        myTasks.forEach((item,index) => {
            setTimeout(() => {
                createTaskItem(item)
            }, 100*index)
        })
        num = myTasks.length
    } else {
        myTasks = []
    }


}

window.addEventListener('load', getLocalStorage)

deleteBtn.addEventListener('click', () => {
    myTasks = []
    sortTask()
})

checkBtn.addEventListener('click', () => {
    if (myTasks[0].done) {
    myTasks.forEach(item => {
        item.done = false
    })
    } else {
        myTasks.forEach(item => {
            item.done = true
        })
    }
    sortTask()
})

