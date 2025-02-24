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

/**
 * Renders the tasks to the DOM.
 * @param {string} filter - The text to filter tasks by title.
 */
function renderTasks(filter = "") {
  taskList.innerHTML = "";
  taskList.className = "max-h-80 overflow-y-auto p-2";
  
  // Safely handle potential undefined titles
  tasks
    .filter((task) => {
      // Convert task.title to a string if it's valid; otherwise, use an empty string
      const safeTitle = typeof task.title === "string" ? task.title.toLowerCase() : "";
      return safeTitle.includes(filter.toLowerCase());
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `flex flex-col p-2 rounded mb-2 ${getTaskBgColor(task.status)}`;
      li.innerHTML = `
        <strong>${task.title || "(No title)"}</strong>
        <p>${task.description || ""}</p>
        <p><em>Status:</em> 
            <select onchange="updateTaskStatus(${index}, this.value)">
                <option value="not started" ${task.status === "not started" ? "selected" : ""}>Not Started</option>
                <option value="in progress" ${task.status === "in progress" ? "selected" : ""}>In Progress</option>
                <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
            </select>
        </p>
        <p><em>Deadline:</em> ${task.deadline || ""}</p>
        <button onclick="deleteTask(${index})" class="text-black-500 font-bold mt-2 text-4xl">X</button>
      `;
      taskList.appendChild(li);
    });
  
  updateFaceIcon();
}

/**
 * Returns the background color class based on the task's status.
 * @param {string} status - The status of the task.
 * @returns {string} - TailwindCSS background class.
 */
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

/**
 * Updates the status of a specific task.
 * @param {number} index - The index of the task in the `tasks` array.
 * @param {string} newStatus - The new status ("not started", "in progress", or "done").
 */
function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
  renderTasks(searchBar.value);
  
  // Play audio according to the status
  let audio;
  if (newStatus === "done") {
    audio = new Audio("./assets/done.mp3");
  } else if (newStatus === "in progress") {
    audio = new Audio("./assets/inProgress.mp3");
  } else {
    return;
  }
  audio.volume = 0.4;
  audio.play();
}

/**
 * Updates the face icon based on the ratio of statuses:
 * - More done tasks => happy face
 * - More not-started tasks => angry face
 * - More in-progress tasks => neutral face
 * - Otherwise => neutral face
 */
function updateFaceIcon() {
  if (tasks.length === 0) {
    faceIcon.src = "./assets/neutralFace.svg";
    faceIcon.className = "w-16 h-16 bg-slate-300";
    return;
  }
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const notStartedCount = tasks.filter((t) => t.status === "not started").length;
  const inProgressCount = tasks.filter((t) => t.status === "in progress").length;
  
  if (doneCount > notStartedCount && doneCount > inProgressCount) {
    faceIcon.src = "./assets/happyface.svg";
    faceIcon.className = "w-16 h-16 bg-green-300";
  } else if (notStartedCount > doneCount && notStartedCount > inProgressCount) {
    faceIcon.src = "./assets/angryFace.svg";
    faceIcon.className = "w-16 h-16 bg-red-300";
  } else if (inProgressCount > doneCount && inProgressCount > notStartedCount) {
    faceIcon.src = "./assets/neutralFace.svg";
    faceIcon.className = "w-16 h-16 bg-yellow-300";
  } else {
    faceIcon.src = "./assets/neutralFace.svg";
    faceIcon.className = "w-16 h-16 bg-slate-300";
  }
}

/**
 * Deletes a task from the list and re-renders.
 * @param {number} index - The index of the task to delete.
 */
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
  renderTasks(searchBar.value);
}

// Add a new task on button click
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

// Search bar event
searchBar.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

// Logout button
logoutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Initial render
renderTasks();
