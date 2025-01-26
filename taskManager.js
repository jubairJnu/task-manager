const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//? form sumbtion

document
  .getElementById("taskForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const priority = document.getElementById("taskPriority").value;
    const dueDate = document.getElementById("taskdueDate").value;

    const newTask = {
      id: Date.now().toString(),
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate,
      status: "incomplete",
    };

    addTask(newTask);

    this.reset();
  });

// save task

async function saveTask(task) {
  localStorage.setItem("tasks", JSON.stringify(task));
}

// add task

async function addTask(task) {
  if (!task.title || !task.priority) {
    alert("Please fill in all fields");
    return;
  }

  if (tasks.some((t) => t.title === task.title)) {
    alert("Task already exists");
    return;
  }
  tasks.push(task);
  await saveTask(tasks);
  await displayTasks();
}

// delete task

async function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  await saveTask(tasks);
  await displayTasks();
}

// display task
function displayTasks(filteredTasks = tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");
    taskDiv.setAttribute("data-task-id", task.id);

    taskDiv.innerHTML = `
      <div class="task-content">
        <span>${task.title}</span>
       
      
      </div>

<div>
 <span>${task.description}</span>
</div>
<div>
   <span>${task.priority}</span>
</div>
<div>
   <span>${task.dueDate}</span>
</div>

      <div class="task-actions">
        <button class="complete-btn" onclick="toggleCompletion('${task.id}')">
          ${task.completed ? "Incomplete" : "Complete"}
        </button>
        <button class="delete-btn"  onclick="deleteTask('${
          task.id
        }')">Delete</button>
        <button onclick="toggleEdit('${task.id}')">Edit</button>
      </div>
    `;

    taskList.appendChild(taskDiv);
  });
}

// Filter tasks
function filterTasks() {
  const filterValue = document.getElementById("filterDropdown").value;
  const sortValue = document.getElementById("sortDropdown").value;
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();

  let filteredTasks = [...tasks];

  // Filter
  if (filterValue === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filterValue === "pending") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Sort tasks
  if (sortValue === "priority") {
    const priorityOrder = { low: 1, medium: 2, high: 3 };
    filteredTasks.sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  } else if (sortValue === "dueDate") {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  // Search tasks
  if (searchValue) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue)
    );
  }

  displayTasks(filteredTasks);
}

document
  .getElementById("filterDropdown")
  .addEventListener("change", filterTasks);
document.getElementById("sortDropdown").addEventListener("change", filterTasks);
document.getElementById("searchInput").addEventListener("input", filterTasks);

// Initial display
displayTasks();

// toggle completion

function toggleCompletion(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex > -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTask(tasks);
    displayTasks();
  }
}

// edit task

function toggleEdit(taskId) {
  console.log(taskId, "toggleEdit: taskId");

  const task = tasks.find((t) => t.id === taskId.toString());

  if (!task) {
    console.error("Task not found in the TaskManager.");
    return;
  }

  console.log(task, "Task data found for editing");

  // Find the task element in the DOM
  const taskElement = document.querySelector(
    `.task-item[data-task-id="${taskId}"]`
  );

  if (!taskElement) {
    console.error("Task element not found .");
    return;
  }

  taskElement.innerHTML = `
    <div class="task-edit-form">
      <input type="text" id="editTitle" value="${task.title}" />
      <textarea id="editDescription">${task.description}</textarea>
      <select id="editPriority">
        <option value="low" ${
          task.priority === "low" ? "selected" : ""
        }>Low</option>
        <option value="medium" ${
          task.priority === "medium" ? "selected" : ""
        }>Medium</option>
        <option value="high" ${
          task.priority === "high" ? "selected" : ""
        }>High</option>
      </select>
      <div class="task-actions">
        <button onclick="saveEdit('${taskId}')">Save</button>
        <button onclick="cancelEdit('${taskId}')">Cancel</button>
      </div>
    </div>
  `;
}

function saveEdit(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    console.error("Task not found for editing");
    return;
  }

  tasks[index].title = document.getElementById("editTitle").value;
  tasks[index].description = document.getElementById("editDescription").value;
  tasks[index].priority = document.getElementById("editPriority").value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function cancelEdit(taskId) {
  const taskElement = document.querySelector(
    `.task-item[data-task-id="${taskId}"]`
  );

  if (taskElement && taskElement.dataset.originalContent) {
    taskElement.innerHTML = taskElement.dataset.originalContent;
  } else {
    displayTasks();
  }
}
