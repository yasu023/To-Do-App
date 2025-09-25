// ---------------- UserManager Class ----------------
class UserManager {
  constructor() {
    this.currentUser = null;
    this.loginForm = document.getElementById("login-form");
    this.signupForm = document.getElementById("signup-form");
    this.taskContainer = document.getElementById("task-container");
  }

  signup(name, email, password) {
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    const user = { name, email, password, tasks: [] };
    localStorage.setItem(email, JSON.stringify(user));
    alert("Signup successful! You can now log in.");
    this.showLoginForm();
  }

  login(email, password) {
    if (email === "" || password === "") {
      alert("Please fill in both email and password.");
      return false;
    }

    const user = JSON.parse(localStorage.getItem(email));
    if (user && user.password === password) {
      this.currentUser = user;
      localStorage.setItem("currentUserEmail", email);
      this.showTaskContainer();
      return true;
    }
    alert("Invalid credentials or user not found.");
    return false;
  }

  logout() {
    localStorage.removeItem("currentUserEmail");
    this.currentUser = null;
    alert("Logged out successfully.");
    this.showLoginForm();
  }

  loadUser(email) {
    const user = JSON.parse(localStorage.getItem(email));
    if (user) {
      this.currentUser = user;
      this.showTaskContainer();
    } else {
      alert("User data not found.");
    }
  }

  showLoginForm() {
    this.loginForm.style.display = "block";
    this.signupForm.style.display = "none";
    this.taskContainer.style.display = "none";
  }

  showSignupForm() {
    this.loginForm.style.display = "none";
    this.signupForm.style.display = "block";
  }

  showTaskContainer() {
    this.loginForm.style.display = "none";
    this.signupForm.style.display = "none";
    this.taskContainer.style.display = "block";
  }
}

// ---------------- Variables ----------------
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");
const goToSignup = document.getElementById("go-to-signup");
const goToLogin = document.getElementById("go-to-login");

const taskContainer = document.getElementById("task-container");
const inputtdl = document.querySelector('.textarea');
const buttontdl = document.querySelector('.buttoninput');
const listtdl = document.querySelector('.todolist');
const logOutButton = document.getElementById("log-out");

const userManager = new UserManager();

// ---------------- Page Load ----------------
document.addEventListener("DOMContentLoaded", () => {
  const storedUserEmail = localStorage.getItem("currentUserEmail");
  if (storedUserEmail) {
    userManager.loadUser(storedUserEmail);
    loadTasks();
  }
});

// ---------------- Navigation ----------------
goToSignup.addEventListener("click", () => {
  userManager.showSignupForm();
});

goToLogin.addEventListener("click", () => {
  userManager.showLoginForm();
});

// ---------------- Handle Sign Up ----------------
signupSubmit.addEventListener("click", () => {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  userManager.signup(name, email, password);
});

// ---------------- Handle Login ----------------
loginSubmit.addEventListener("click", () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (userManager.login(email, password)) {
    loadTasks();
  }
});

// ---------------- Handle Logout ----------------
logOutButton.addEventListener("click", () => {
  userManager.logout();
  listtdl.innerHTML = '';
});

// ---------------- Tasks Logic (نفس القديم) ----------------
buttontdl.addEventListener('click', clickButton);
listtdl.addEventListener('click', okdel);

function clickButton(e) {
    e.preventDefault();
    addTodo();
}

function addTodo() {
    if (inputtdl.value === '') return;

    const todo = {
        text: inputtdl.value,
        id: Date.now(),
        done: false
    };

    createTodoElement(todo);
    saveTodoList(todo);
    inputtdl.value = '';
}

function createTodoElement(todo) {
    const itemall = document.createElement('div');
    itemall.classList.add('itemall');
    itemall.setAttribute('data-id', todo.id);

    const item = document.createElement('p');
    item.classList.add('item');
    item.innerText = todo.text;
    if (todo.done) {
        item.classList.add('checklist');
    }
    itemall.appendChild(item);

    const checkbutton = document.createElement("button");
    checkbutton.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkbutton.classList.add("check-button");
    itemall.appendChild(checkbutton);

    const trashbutton = document.createElement("button");
    trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashbutton.classList.add("trash-button");
    itemall.appendChild(trashbutton);

    listtdl.appendChild(itemall);
}

function saveTodoList(todo) {
    const todos = getTodosFromStorage();
    todos.push(todo);
    updateUserTodos(todos);
}

function loadTasks() {
    const todos = getTodosFromStorage();
    listtdl.innerHTML = '';
    todos.forEach(todo => {
        createTodoElement(todo);
    });
}

function getTodosFromStorage() {
    const storedUserEmail = localStorage.getItem("currentUserEmail");
    const user = JSON.parse(localStorage.getItem(storedUserEmail));
    return user ? user.tasks : [];
}

function updateUserTodos(todos) {
    const storedUserEmail = localStorage.getItem("currentUserEmail");
    const user = JSON.parse(localStorage.getItem(storedUserEmail));
    if (user) {
        user.tasks = todos;
        localStorage.setItem(storedUserEmail, JSON.stringify(user));
    }
}

function okdel(e) {
    const item = e.target;

    if (item.classList[0] === 'check-button') {
        const todolist = item.parentElement;
        todolist.classList.toggle('checklist');

        const todoId = todolist.getAttribute('data-id');
        const todos = getTodosFromStorage();
        const updatedTodos = todos.map(todo => {
            if (todo.id == todoId) {
                todo.done = !todo.done;
            }
            return todo;
        });
        updateUserTodos(updatedTodos);
    }

    if (item.classList[0] === 'trash-button') {
        const todolist = item.parentElement;
        const todoId = todolist.getAttribute('data-id');
        todolist.remove();
        removeTodoFromStorage(todoId);
    }
}

function removeTodoFromStorage(todoId) {
    const todos = getTodosFromStorage();
    const updatedTodos = todos.filter(todo => todo.id != todoId);
    updateUserTodos(updatedTodos);
}

// ---------------- Language (زي ما هو) ----------------
const langToggleButton = document.getElementById("lang-toggle");
langToggleButton.addEventListener("click", toggleLanguage);

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    setLanguage(savedLanguage);
  } else {
    setLanguage("en");
  }
});

function toggleLanguage() {
  const currentLang = localStorage.getItem("language") || "en";
  const newLang = currentLang === "en" ? "ar" : "en";
  setLanguage(newLang);
}

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  if (lang === "ar") {
    document.body.style.direction = "rtl";
    langToggleButton.innerText = "EN";
    document.querySelectorAll("[data-en]").forEach(el => {
      el.innerText = el.getAttribute("data-ar");
    });
  } else {
    document.body.style.direction = "ltr";
    langToggleButton.innerText = "AR";
    document.querySelectorAll("[data-ar]").forEach(el => {
      el.innerText = el.getAttribute("data-en");
    });
  }
}
