// Select elements
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.onload = function () {
  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  } catch (e) {
    localStorage.removeItem('tasks');
  }
  tasks.forEach(task => addTaskToDOM(task.text, task.completed));
};

// Add task button click
addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTaskToDOM(taskText, false);
    saveTask(taskText, false);
    input.value = '';
  }
});

// Enter key press support
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Function to add a task to the DOM
function addTaskToDOM(text, completed) {
  const li = document.createElement('li');
  li.className = 'task';
  if (completed) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = text;

  const completeBtn = document.createElement('button');
  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
  completeBtn.title = 'Mark as Done';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.title = 'Edit Task';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.title = 'Delete Task';

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Event Listeners
  completeBtn.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateStorage();
    filterTasks(getCurrentFilter());
  });

  editBtn.addEventListener('click', () => {
    const newText = prompt('Edit your task:', span.textContent);
    if (newText !== null && newText.trim() !== '') {
      span.textContent = newText.trim();
      updateStorage();
    }
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this task?')) {
      li.remove();
      updateStorage();
    }
  });
}

// Save task to localStorage
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update localStorage from current DOM
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

// Filtering logic
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      filterTasks(btn.dataset.filter);
    });
  });
});

function filterTasks(filter) {
  document.querySelectorAll('.task').forEach(task => {
    const isCompleted = task.classList.contains('completed');
    task.style.display =
      filter === 'all' ||
      (filter === 'completed' && isCompleted) ||
      (filter === 'pending' && !isCompleted)
        ? ''
        : 'none';
  });
}

function getCurrentFilter() {
  const activeBtn = document.querySelector('.filter-btn.active');
  return activeBtn ? activeBtn.dataset.filter : 'all';
}
