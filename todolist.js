// Vérifier si l'utilisateur est connecté
const storedUser = JSON.parse(localStorage.getItem("currentUser"));
if (!storedUser) {
  window.location.href = "index.html"; // Rediriger vers la page de connexion si non connecté
}

// Références vers les éléments du DOM
document.getElementById("welcome-msg").innerText = `Welcome, ${storedUser.email}!`;
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskDeadline = document.getElementById("task-deadline");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");
const searchBar = document.getElementById("search-bar");
const faceIcon = document.getElementById("face-icon");

// Récupération des tâches de l'utilisateur courant
let tasks = JSON.parse(localStorage.getItem(`tasks_${storedUser.email}`)) || [];

/**
 * Met à jour l'affichage des tâches (avec filtrage par titre)
 * @param {string} filter - Le texte à filtrer (barre de recherche)
 */
function renderTasks(filter = "") {
  taskList.innerHTML = "";
  taskList.className = "max-h-80 overflow-y-auto p-2";

  tasks
    .filter((task) => task.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `flex flex-col p-2 rounded mb-2 ${getTaskBgColor(
        task.status
      )}`;
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
        <button onclick="deleteTask(${index})" class="text-red-500 font-bold mt-2 text-4xl">X</button>
      `;
      taskList.appendChild(li);
    });

  // Met à jour l'icône de visage en fonction de la majorité des statuts
  updateFaceIcon();
}

/**
 * Détermine la couleur de fond d'une tâche selon son statut
 * @param {string} status - Le statut de la tâche
 * @returns {string} - Une classe Tailwind définissant la couleur de fond
 */
function getTaskBgColor(status) {
  switch (status) {
    case "done":
      return "bg-green-700";
    case "in progress":
      return "bg-yellow-600";
    case "not started":
      return "bg-slate-600";
    default:
      return "bg-slate-600";
  }
}

/**
 * Met à jour le statut d'une tâche dans le tableau et en localStorage
 * @param {number} index - L'index de la tâche dans le tableau
 * @param {string} newStatus - Le nouveau statut
 */
function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
  renderTasks(searchBar.value); // on re-filtre en fonction de la barre de recherche
}

/**
 * Met à jour l'icône affichée selon le statut majoritaire des tâches
 */
function updateFaceIcon() {
  if (tasks.length === 0) {
    // Si aucune tâche, affiche le visage neutre
    faceIcon.src = "neutralFace.svg";
    return;
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const notStartedCount = tasks.filter((t) => t.status === "not started").length;
  const inProgressCount = tasks.filter((t) => t.status === "in progress").length;

  // On cherche la majorité (le plus grand nombre de tâches)
  // doneCount > notStartedCount et doneCount > inProgressCount => "happyFace"
  // notStartedCount > doneCount et notStartedCount > inProgressCount => "angryFace"
  // sinon => "neutralFace"
  if (doneCount > notStartedCount && doneCount > inProgressCount) {
    faceIcon.src = "happyFace.svg";
  } else if (notStartedCount > doneCount && notStartedCount > inProgressCount) {
    faceIcon.src = "angryFace.svg";
  } else {
    faceIcon.src = "neutralFace.svg";
  }
}

/**
 * Supprime une tâche
 * @param {number} index - L'index de la tâche à supprimer
 */
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

// Recherche en direct dans le titre
searchBar.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

// Bouton de déconnexion
logoutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Première exécution
renderTasks();
