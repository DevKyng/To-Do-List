const taskInput = document.getElementById("task-input");
const listContainer = document.getElementById("list-container");
const addButton = document.querySelector(".row button");
const storageKey = "todoTasks";
let tasks = [];

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

listContainer.addEventListener("click", function (event) {
    const taskItem = event.target.closest("li");

    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.id;

    if (event.target.classList.contains("delete-task")) {
        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });
    } else {
        tasks = tasks.map(function (task) {
            return task.id === taskId
                ? { ...task, completed: !task.completed }
                : task;
        });
    }

    saveTasks();
    renderTasks();
});

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: taskText,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

function renderTasks() {
    listContainer.innerHTML = "";

    tasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.dataset.id = task.id;
        listItem.classList.toggle("checked", task.completed);
        listItem.appendChild(document.createTextNode(task.text));

        const deleteButton = document.createElement("span");
        deleteButton.className = "delete-task";
        deleteButton.textContent = "\u00D7";
        deleteButton.setAttribute("role", "button");
        deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

        listItem.appendChild(deleteButton);
        listContainer.appendChild(listItem);
    });
}

function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem(storageKey);

    if (!savedTasks) {
        renderTasks();
        return;
    }

    try {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks.filter(function (task) {
                return task
                    && typeof task.id === "string"
                    && typeof task.text === "string"
                    && typeof task.completed === "boolean";
            });
        }
    } catch (error) {
        localStorage.removeItem(storageKey);
        tasks = [];
    }

    renderTasks();
}

loadTasks();
