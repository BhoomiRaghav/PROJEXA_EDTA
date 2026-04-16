const data = JSON.parse(localStorage.getItem("selectedInternship"));

if (!data) {
    document.body.innerHTML = `<h2>No Internship Found 😢</h2>`;
    throw new Error("No data");
}

// ================= SET TEXT =================
function setText(id, value, prefix = "") {
    const el = document.getElementById(id);
    if (el) el.innerText = value ? prefix + value : "Not specified";
}

setText("title", data.title);
setText("company", data.company);
setText("location", data.location, "📍 ");
setText("stipend", data.stipend, "💰 ");
setText("duration", data.duration, "⏳ ");
setText("description", data.description);
setText("startDate", data.startDate);
setText("deadline", data.deadline);

// ================= LIST =================
function renderList(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = "";

    if (!items || items.length === 0) {
        el.innerHTML = "<li>Not specified</li>";
        return;
    }

    items.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        el.appendChild(li);
    });
}

renderList("responsibilities", data.responsibilities);
renderList("requirements", data.requirements);

// ================= APPLY =================
let applications = JSON.parse(localStorage.getItem("applications")) || [];
const applyBtn = document.getElementById("applyBtn");

function isApplied(id) {
    return applications.some(app => app.id === id);
}

function updateUI() {
    if (isApplied(data.id)) {
        applyBtn.innerText = "Applied ✅";
        applyBtn.disabled = true;
    }
}

updateUI();

applyBtn.addEventListener("click", () => {

    if (isApplied(data.id)) {
        showToast("Already Applied 😎");
        return;
    }

    const newApp = {
        id: data.id,
        title: data.title,
        company: data.company,
        status: "Applied",
        appliedAt: new Date().toLocaleString()
    };

    applications.push(newApp);
    localStorage.setItem("applications", JSON.stringify(applications));

    updateUI();
    showToast("Application Submitted 🚀");
});

// ================= TOAST =================
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 3000);
}