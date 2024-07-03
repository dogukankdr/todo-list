// Elements
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const filter = document.getElementById("filter");
const clearButton = document.getElementById("clear-todos");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];

eventListeners();

// All event listeners
function eventListeners() {
  form.addEventListener("submit", addTodo); // Add a new todo
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI); // Load todos from storage
  secondCardBody.addEventListener("click", deleteTodo); // Delete a todo
  filter.addEventListener("keyup", filterTodos); // Filter todos
  clearButton.addEventListener("click", clearAllTodos); // Clear all todos
}

function clearAllTodos(e) {
  if (confirm("Are you sure you want to delete all?")) {
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild); // Remove all todos from UI
    }
    localStorage.removeItem("todos"); // Clear todos from storage
  }
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      listItem.setAttribute("style", "display: none !important"); // Hide non-matching todos
    } else {
      listItem.setAttribute("style", "display: block"); // Show matching todos
    }
  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove(); // Remove from UI
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); // Remove from storage
    showAlert("success", "Todo deleted."); // Show success message
  }
}

function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); // Remove the todo from the array
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos)); // Update storage
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo); // Add each todo to the UI
  });
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();

  // Check if the newTodo already exists in the list
  if (isTodoDuplicate(newTodo)) {
    showAlert("warning", "This todo already exists!"); // Show warning message
  } else {
    if (newTodo == "") {
      showAlert("danger", "Please enter a Todo..."); // Show error message
    } else {
      addTodoToUI(newTodo); // Add todo to UI
      addTodoToStorage(newTodo); // Add todo to storage
      showAlert("success", "Todo successfully added!"); // Show success message
    }
  }

  e.preventDefault(); // Prevent form submission
}

// Function to check if a todo already exists in the list
function isTodoDuplicate(newTodo) {
  let todos = getTodosFromStorage();
  return todos.includes(newTodo);
}


function getTodosFromStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = []; // If no todos, return empty array
  } else {
    todos = JSON.parse(localStorage.getItem("todos")); // Get todos from storage
  }

  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo); // Add new todo to array
  localStorage.setItem("todos", JSON.stringify(todos)); // Update storage
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`; // Set alert type
  alert.textContent = message; // Set alert message
  firstCardBody.appendChild(alert); // Add alert to UI

  setTimeout(function () {
    alert.remove(); // Remove alert after 2 seconds
  }, 2000);
}

function addTodoToUI(newTodo) {
  const listItem = document.createElement("li"); // Create List Item
  const link = document.createElement("a"); // Create Link
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";

  listItem.appendChild(document.createTextNode(newTodo)); // Add Text Node
  listItem.appendChild(link); // Add Link to List Item

  todoList.appendChild(listItem); // Add List Item to Todo List

  todoInput.value = ""; // Clear Input
}
