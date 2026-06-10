const API = "http://127.0.0.1:8000";

let allTasks = [];

window.onload = loadTasks;

async function loadTasks() {
    const res = await fetch(`${API}/tasks`);
    allTasks = await res.json();
    renderTasks(allTasks);
}

function renderTasks(tasks) {

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let total = tasks.length;
    let done = 0;
    let pending = 0;

    tasks.forEach(task => {

        if (task.completed) done++;
        else pending++;

        list.innerHTML += `
        <tr>
            <td>${task.title}</td>

            <td>
                <span class="${task.completed ? "done" : "pending"}">
                    ${task.completed ? "Done" : "Pending"}
                </span>
            </td>

            <td>
                ${
                    !task.completed
                    ? `<button onclick="markDone(${task.id})">✓</button>`
                    : ""
                }

                <button onclick="editTask(${task.id})">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("done").innerText = done;
    document.getElementById("pending").innerText = pending;

    let progress = total ? Math.round((done / total) * 100) : 0;

    document.getElementById("progress").innerText = progress + "%";
    document.getElementById("progressBar").style.width = progress + "%";
}

async function addTask() {

    const input = document.getElementById("taskInput");

    if (!input.value.trim()) return;

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.value })
    });

    input.value = "";
    loadTasks();
}

async function markDone(id) {
    await fetch(`${API}/tasks/${id}/done`, {
        method: "PUT"
    });

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

async function editTask(id) {

    const newTitle = prompt("Enter new task:");

    if (!newTitle) return;

    await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
    });

    loadTasks();
}

function searchTasks() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allTasks.filter(t =>
        t.title.toLowerCase().includes(value)
    );

    renderTasks(filtered);
}