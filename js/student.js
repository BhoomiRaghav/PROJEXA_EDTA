const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user || user.role !== "student") {
  window.location.href = "/Html/auth.html";
}

// ================= DATA =================
let internships = JSON.parse(localStorage.getItem("companyJobs")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

const content = document.getElementById("content");
const title = document.getElementById("page-title");
const navItems = document.querySelectorAll(".nav-item");

// ================= TOAST =================
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;

  document.getElementById("toast-container").appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ================= NAV =================
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const page = item.dataset.page;

    if (page === "dashboard") renderDashboard();
    if (page === "internships") renderInternships();
    if (page === "applications") renderApplications();
  });
});

// ================= EXPLORE =================
function goToExplore() {
  window.location.href = "/Html/explore.html";
}

// ================= DASHBOARD =================
function renderDashboard() {
  title.innerText = "Dashboard";

  content.innerHTML = `
    <div class="grid">
      <div class="card">
        <h3>📊 Applied Internships</h3>
        <p>${applications.length}</p>
      </div>

      <div class="card">
        <h3>💼 Total Internships</h3>
        <p>${internships.length}</p>
      </div>

      <div class="card">
        <h3>🚀 Quick Start</h3>
        <button onclick="goToExplore()">Explore</button>
      </div>
    </div>
  `;
}

// ================= INTERNSHIPS =================
function renderInternships() {
  title.innerText = "Internships";

  let html = `<div class="grid">`;

  internships.forEach(job => {
    const applied = applications.some(app => app.id === job.id);

    html += `
      <div class="card">
        <h3>${job.title}</h3>
        <p>${job.company}</p>

        <div class="actions">
          <button onclick="goToExplore()">Explore</button>

          <button ${applied ? "disabled" : ""} onclick="applyFromDashboard(${job.id})">
            ${applied ? "Applied ✔" : "Apply"}
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  content.innerHTML = html;
}

// ================= APPLY =================
function applyFromDashboard(id) {

  if (applications.some(app => app.id === id)) {
    showToast("Already Applied 😅");
    return;
  }

  const job = internships.find(j => j.id === id);

  const newApp = {
    id: job.id,
    title: job.title,
    company: job.company,
    status: "Applied",
    appliedAt: new Date().toLocaleString()
  };

  applications.push(newApp);
  localStorage.setItem("applications", JSON.stringify(applications));

  showToast("Application Submitted 🚀");
  renderInternships();
}

// ================= APPLICATIONS =================
function renderApplications() {
  title.innerText = "Applications";

  let html = `<div class="grid">`;

  if (applications.length === 0) {
    html += `<p>No applications 😢</p>`;
  } else {
    applications.forEach(app => {
      html += `
        <div class="card">
          <h3>${app.title}</h3>
          <p>${app.company}</p>
          <span>${app.status}</span>
          <small>${app.appliedAt}</small>
        </div>
      `;
    });
  }

  html += `</div>`;
  content.innerHTML = html;
}

// INIT
renderDashboard();

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/Html/auth.html";
}