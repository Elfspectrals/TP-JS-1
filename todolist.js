// Vérifier si l'utilisateur est connecté
const storedUser = JSON.parse(localStorage.getItem("currentUser"));
if (!storedUser) {
  window.location.href = "index.html"; // Rediriger vers la page de connexion si non connecté
}

document.getElementById("welcome-msg").innerText = `Welcome, ${storedUser.email}!`;
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskDeadline = document.getElementById("task-deadline");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");
const searchBar = document.getElementById("search-bar");
const faceIcon = document.getElementById("face-icon");

let tasks = JSON.parse(localStorage.getItem(`tasks_${storedUser.email}`)) || [];

// Display tasks and use filter to search for tasks
function renderTasks(filter = "") {
  taskList.innerHTML = "";
  taskList.className = "max-h-80 overflow-y-auto p-2";

  tasks
    .filter((task) => task.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `flex flex-col p-2 rounded mb-2 ${getTaskBgColor(task.status)}`;
      li.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <p><em>Status:</em> 
            <select onchange="updateTaskStatus(${index}, this.value)">
                <option value="not started" ${
                  task.status === "not started" ? "selected" : ""
                }>Not Started</option>
                <option value="in progress" ${
                  task.status === "in progress" ? "selected" : ""
                }>In Progress</option>
                <option value="done" ${
                  task.status === "done" ? "selected" : ""
                }>Done</option>
            </select>
        </p>
        <p><em>Deadline:</em> ${task.deadline}</p>
        <button onclick="deleteTask(${index})" class="text-black-500 font-bold mt-2 text-4xl">X</button>
      `;
      taskList.appendChild(li);
    });

  updateFaceIcon();
}

// Switch the bg of task based on status
function getTaskBgColor(status) {
  switch (status) {
    case "done":
      return "bg-green-700";
    case "in progress":
      return "bg-yellow-600";
    case "not started":
      return "bg-red-600";
    default:
      return "bg-red-600";
  }
}


function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus;
    localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
    renderTasks(searchBar.value);
    // Play audio according to the status 
    let audio;
    if (newStatus === "done") {
      audio = new Audio("done.mp3");
    } else if (newStatus === "in progress") {
      audio = new Audio("inProgress.mp3");
    } else {
      return;
    }
    audio.volume = 0.4;
    audio.play();
  }

// SVG of visage icon
function updateFaceIcon() {
    if (tasks.length === 0) {
      faceIcon.src = "neutralFace.svg";
      faceIcon.className = "w-16 h-16 bg-slate-300";
      return;
    }
    const doneCount = tasks.filter(function(t){return t.status === "done";}).length;
    const notStartedCount = tasks.filter(function(t){return t.status === "not started";}).length;
    const inProgressCount = tasks.filter(function(t){return t.status === "in progress";}).length;
    if (doneCount > notStartedCount && doneCount > inProgressCount) {
      faceIcon.src = "happyFace.svg";
      faceIcon.className = "w-16 h-16 bg-green-300";
    } else if (notStartedCount > doneCount && notStartedCount > inProgressCount) {
      faceIcon.src = "angryFace.svg";
      faceIcon.className = "w-16 h-16 bg-red-300";
    } else if (inProgressCount > doneCount && inProgressCount > notStartedCount) {
      faceIcon.src = "neutralFace.svg";
      faceIcon.className = "w-16 h-16 bg-yellow-300";
    } else {
      faceIcon.src = "neutralFace.svg";
      faceIcon.className = "w-16 h-16 bg-slate-300";
    }
  }

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
  renderTasks(searchBar.value);
}

// Ajouter une nouvelle tâche au clic sur le bouton "Add"
addTaskBtn.addEventListener("click", () => {
  const newTask = {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    status: "not started",
    deadline: taskDeadline.value.trim(),
  };

  if (newTask.title && newTask.description && newTask.deadline) {
    tasks.push(newTask);
    localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
    taskTitle.value = "";
    taskDescription.value = "";
    taskDeadline.value = "";
    renderTasks();
  } else {
    alert("Please fill in all fields!");
  }
});

searchBar.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

logoutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

renderTasks();
