let isRegister = false; // Par défaut, on est sur Login

document.getElementById("toggle-btn").addEventListener("click", () => {
    isRegister = !isRegister;
    document.getElementById("form-title").innerText = isRegister ? "Register" : "Login";
    document.getElementById("auth-btn").innerText = isRegister ? "Register" : "Login";
    document.getElementById("toggle-text").innerText = isRegister ? "Already have an account?" : "Don't have an account?";
    document.getElementById("toggle-btn").innerText = isRegister ? "Login" : "Register";
});

document.getElementById("auth-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email && password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (isRegister) {
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                alert("User already exists! Try logging in.");
                return;
            }

            users.push({ email, password });
            localStorage.setItem("users", JSON.stringify(users));
            alert("User registered! You can now login.");
        } else {
            const storedUser = users.find(user => user.email === email && user.password === password);
            if (storedUser) {
                localStorage.setItem("currentUser", JSON.stringify(storedUser)); // Stocker l'utilisateur connecté
                window.location.href = "todolist.html";
            } else {
                alert("Invalid credentials!");
            }
        }
    } else {
        alert("Please fill in all fields!");
    }
});
