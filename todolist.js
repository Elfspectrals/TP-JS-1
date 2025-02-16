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

let tasks = JSON.parse(localStorage.getItem(`tasks_${storedUser.email}`)) || [];

function renderTasks(filter = "") {
    taskList.innerHTML = "";
    taskList.className = "max-h-80 overflow-y-auto p-2";
    tasks.filter(task => task.title.toLowerCase().includes(filter.toLowerCase())).forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `flex flex-col p-2 rounded mb-2 ${getTaskBgColor(task.status)}`;
        li.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <p><em>Status:</em> 
                <select onchange="updateTaskStatus(${index}, this.value)">
                    <option value="not started" ${task.status === "not started" ? "selected" : ""}>Not Started</option>
                    <option value="in progress" ${task.status === "in progress" ? "selected" : ""}>In Progress</option>
                    <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                </select>
            </p>
            <p><em>Deadline:</em> ${task.deadline}</p>
            <button onclick="deleteTask(${index})" class="text-red-500 font-bold mt-2 text-4xl">X</button>
        `;
        taskList.appendChild(li);
    });
}

function getTaskBgColor(status) {
    switch (status) {
        case "done": return "bg-green-700";
        case "in progress": return "bg-yellow-600";
        case "not started": return "bg-slate-600";
        default: return "bg-slate-600";
    }
}

function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus;
    localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
    renderTasks();
}

searchBar.addEventListener("input", (e) => {
    renderTasks(e.target.value);
});

addTaskBtn.addEventListener("click", () => {
    const newTask = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        status: "not started", // Default status since dropdown is removed
        deadline: taskDeadline.value.trim()
    };

    if (newTask.title && newTask.description && newTask.deadline) {
        tasks.push(newTask);
        localStorage.setItem(`tasks_${storedUser.email}`, JSON.stringify(tasks));
        taskTitle.value = "" ;
        taskDescription.value = "";
        taskDeadline.value = "";
        renderTasks();
    }
    else {
        alert("Please fill in all fields!");
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