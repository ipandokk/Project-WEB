const form = document.getElementById("taskForm");
const taskListContainer = document.getElementById("taskListContainer");
const toggleModeBtn = document.getElementById("toggleMode");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = false;

renderTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = document.getElementById("taskInput").value.trim();
  const taskTime = document.getElementById("taskTime").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskCategory = document.getElementById("taskCategory").value;

  if (!taskText || !taskDate || !taskTime) return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    time: taskTime,
    date: taskDate,
    category: taskCategory,
    done: false,
    inProgress: false, 
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  form.reset();
  renderTasks();
});

function renderTasks() {
  taskListContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskListContainer.innerHTML = `<div class="no-task">Belum ada tugas hari ini 🌤️</div>`;
    return;
  }

  const grouped = groupByDate(tasks);

  Object.keys(grouped).forEach((date) => {
    const dateTitle = document.createElement("div");
    dateTitle.className = "date-title";
    dateTitle.textContent = formatDate(date);
    taskListContainer.appendChild(dateTitle);

    grouped[date].forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className =
        "task" +
        (task.done ? " done" : "") +
        (task.inProgress ? " progress" : "");

      taskDiv.innerHTML = `
        <div>
          <strong>${task.text}</strong>
          <small>🕒 ${task.time} | 🗂️ ${task.category}</small>
          ${task.inProgress ? '<span class="status">⏳ Sedang dikerjakan</span>' : ''}
        </div>
        <div>
          ${!task.done ? `<button onclick="toggleProgress(${task.id})">⚙️</button>` : ""}
          <button onclick="toggleDone(${task.id})">✔️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      taskListContainer.appendChild(taskDiv);
    });
  });
}

function toggleProgress(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, inProgress: !task.inProgress }
      : { ...task, inProgress: false } 
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function toggleDone(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, done: !task.done, inProgress: false } 
      : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id) {
  if (confirm("Hapus tugas ini?")) {
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

function groupByDate(arr) {
  return arr.reduce((acc, item) => {
    (acc[item.date] = acc[item.date] || []).push(item);
    return acc;
  }, {});
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkMode = !darkMode;
  toggleModeBtn.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
});
