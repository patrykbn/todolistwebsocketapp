const socket = io();

const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');

let tasks = [];

const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task');
        li.textContent = task.name;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('btn', 'btn--red');
        
        removeBtn.onclick = () => {
            socket.emit('removeTask', task.id);
        };

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
};

socket.on('updateData', (serverTasks) => {
    tasks = serverTasks;
    renderTasks();
});

socket.on('addTask', (task) => {
    tasks.push(task);
    renderTasks();
});

socket.on('removeTask', (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
});

const submitTask = (event) => {
    event.preventDefault();

    const newTask = { id: Date.now(), name: taskInput.value.trim() };

    if (!newTask.name) {
        alert('Task cannot be empty...');
        return;
    };

    socket.emit('addTask', newTask);
    taskInput.value = '';
};

taskForm.addEventListener('submit', submitTask);
