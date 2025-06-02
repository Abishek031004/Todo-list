// Select elements
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.onload = function () {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToDOM(task.text, task.completed));
};

// Add button click
addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTaskToDOM(taskText, false);
    saveTask(taskText, false);
    input.value = '';
  }
});

// Add task to the DOM
function addTaskToDOM(text, completed) {
  const li = document.createElement('li');
  li.className = 'task' + (completed ? ' completed' : '');

  const span = document.createElement('span');
  span.textContent = text;

  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✔';
  completeBtn.title = 'Mark as Done';

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏';
  editBtn.title = 'Edit Task';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.title = 'Delete Task';

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Complete task
  completeBtn.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateStorage();
  });

  // Edit task
  editBtn.addEventListener('click', () => {
    const newText = prompt('Edit your task:', span.textContent);
    if (newText !== null && newText.trim() !== '') {
      span.textContent = newText.trim();
      updateStorage();
    }
  });

  // Delete task
  deleteBtn.addEventListener('click', () => {
    li.remove();
    updateStorage();
  });
}

// Save task to localStorage
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update localStorage based on current DOM
function updateStorage() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(taskEl => {
    tasks.push({
      text: taskEl.querySelector('span').textContent,
      completed: taskEl.classList.contains('completed'),
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
