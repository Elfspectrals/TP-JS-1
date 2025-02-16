let isRegister = false; // Par défaut, on est sur Login

// Gestion du clic sur le bouton de basculement entre Login et Register
document.getElementById("toggle-btn").addEventListener("click", () => {
    isRegister = !isRegister; // Inverse l'état de isRegister
    // Met à jour le texte des éléments en fonction de l'état de isRegister
    document.getElementById("form-title").innerText = isRegister ? "Register" : "Login";
    document.getElementById("auth-btn").innerText = isRegister ? "Register" : "Login";
    document.getElementById("toggle-text").innerText = isRegister ? "Already have an account?" : "Don't have an account?";
    document.getElementById("toggle-btn").innerText = isRegister ? "Login" : "Register";
});

// Gestion du clic sur le bouton d'authentification (Login/Register)
document.getElementById("auth-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim(); // Récupère et nettoie la valeur de l'email
    const password = document.getElementById("password").value.trim(); // Récupère et nettoie la valeur du mot de passe

    if (email && password) { // Vérifie que les champs ne sont pas vides
        let users = JSON.parse(localStorage.getItem("users")) || []; // Récupère les utilisateurs stockés ou initialise un tableau vide

        if (isRegister) { // Si on est en mode Register
            const userExists = users.some(user => user.email === email); // Vérifie si l'utilisateur existe déjà
            if (userExists) {
                alert("User already exists! Try logging in."); // Alerte si l'utilisateur existe déjà
                return;
            }

            users.push({ email, password }); // Ajoute le nouvel utilisateur
            localStorage.setItem("users", JSON.stringify(users)); // Stocke les utilisateurs mis à jour
            alert("User registered! You can now login."); // Alerte de succès
        } else { // Si on est en mode Login
            const storedUser = users.find(user => user.email === email && user.password === password); // Cherche l'utilisateur avec les mêmes email et mot de passe
            if (storedUser) {
                localStorage.setItem("currentUser", JSON.stringify(storedUser)); // Stocke l'utilisateur connecté
                window.location.href = "todolist.html"; // Redirige vers la page todolist
            } else {
                alert("Invalid credentials!"); // Alerte si les identifiants sont invalides
            }
        }
    } else {
        alert("Please fill in all fields!"); // Alerte si les champs sont vides
    }
});