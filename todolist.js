// Vérifier si l'utilisateur est connecté
const storedUser = JSON.parse(localStorage.getItem("currentUser"));
if (!storedUser) {
    window.location.href = "index.html"; // Rediriger vers la page de connexion si non connecté
}

document.getElementById("welcome-msg").innerText = `Welcome, ${storedUser.email}!`;

const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskStatus = document.getElementById("task-status");
const taskDeadline = document.getElementById("task-deadline");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");

let tasks = JSON.parse(localStorage.getItem(`tasks_${storedUser.email}`)) || [];

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "flex flex-col bg-gray-200 p-2 rounded mb-2";
        li.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <p><em>Status:</em> ${task.status}</p>
            <p><em>Deadline:</em> ${task.deadline}</p>
            <button onclick="deleteTask(${index})" class="text-red-500 font-bold mt-2">X</button>
        `;
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
    const newTask = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        status: taskStatus.value,
        deadline: taskDeadline.value.trim()
    };

    if (newTask.title && newTask.description && newTask.status && newTask.deadline) {
        tasks.push(newTask);
        localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
        taskTitle.value = "";
        taskDescription.value = "";
        taskStatus.value = "not started";
        taskDeadline.value = "";
        renderTasks();
    }
});

taskStatus.innerHTML = `
    <option value="not started">Not Started</option>
    <option value="in progress">In Progress</option>
    <option value="done">Done</option>
`;

taskStatus.value = "not started";

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
    renderTasks();
}

logoutBtn.addEventListener("click", () => {
    window.location.href = "index.html"; 
});

renderTasks();
