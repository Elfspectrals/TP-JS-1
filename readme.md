# Jérôme NEUPERT TP TodoList

Welcome to the **TodoList** project! This README will guide you through the structure, setup, and usage of the application.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Customization](#customization)
- [Potential Improvements](#potential-improvements)
- [License](#license)

---

## Overview

This application is a simple yet functional **Todo List** project that comes with a login and registration system. Once users register and log in, they can add tasks, change their status, search tasks by title, and see a mood icon reflect the overall progress of their tasks. The project demonstrates the use of:

- **HTML**, **CSS** (via [Tailwind CSS](https://tailwindcss.com/)), and **JavaScript** for the front-end.
- Browser **localStorage** for handling user data and task management.
- Basic user interface with minimal styling thanks to Tailwind CSS.

---

## Features

1. **Login and Registration**  
   - Users can create an account or log in with existing credentials.
   - Validation to ensure email and password fields are filled.
   - Prevents duplicate user registration.

2. **Task Management**  
   - Add new tasks with title, description, and deadline.
   - Update task status: **Not Started**, **In Progress**, or **Done**.
   - Delete tasks individually.

3. **Search Functionality**  
   - Search tasks by title in real-time.

4. **Feedback Icons & Sound**  
   - A mood icon reflects the overall progress of tasks:
     - **Green Happy Face** if most tasks are done.
     - **Red Angry Face** if most tasks haven't started.
     - **Yellow Neutral Face** if most tasks are in progress.
     - **Neutral Face** if the distribution of tasks doesn’t favor any specific status (or if no tasks).
   - Small audio cues for changing tasks to **Done** or **In Progress**.

5. **Local Storage**  
   - User info (email and password) is stored in `localStorage` under the key `users`.
   - Each user's tasks are saved in `localStorage` under a unique key based on their email.

---

## Project Structure

