// Vérifier si l'utilisateur est connecté
const storedUser = JSON.parse(localStorage.getItem("currentUser"));
if (!storedUser) {
    window.location.href = "index.html"; // Rediriger vers la page de connexion si non connecté
}

document.getElementById("welcome-msg").innerText = `Welcome, ${storedUser.email}!`;

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");

let tasks = JSON.parse(localStorage.getItem(`tasks_${storedUser.email}`)) || [];

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-200 p-2 rounded";
        li.innerHTML = `
            <span>${task}</span>
            <button onclick="deleteTask(${index})" class="text-red-500 font-bold">X</button>
        `;
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    if (task) {
        tasks.push(task);
        localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks)); 
        taskInput.value = "";
        renderTasks();
    }
});

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
    renderTasks();
}

logoutBtn.addEventListener("click", () => {
    window.location.href = "index.html"; 
});

renderTasks();
