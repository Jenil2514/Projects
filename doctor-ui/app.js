/**
 * AuraMed Studio - Doctor Clinical UI Application Logic
 */

// Mock Patient Database
const PATIENTS_DB = [
    {
        id: "1",
        name: "Eleanor Vance",
        mrn: "#MED-8842",
        age: 64,
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        bloodType: "O+",
        allergies: "Penicillin (Severe), Shellfish",
        risk: "High Cardiovascular Risk",
        riskLevel: "danger",
        time: "14:30 PM",
        reason: "Cardiology Follow-Up & ECG Review",
        vitals: { hr: 78, bp: "138/88", spo2: "98%", temp: "98.6°F", glucose: "110 mg/dL" },
        status: "in-room", // 'waiting', 'in-room', 'telehealth', 'completed'
        type: "In-Person",
        phone: "+1 (555) 234-8901",
        meds: [
            { name: "Lisinopril 10mg", dosage: "1 Tablet", freq: "Once Daily", status: "Active" },
            { name: "Atorvastatin 20mg", dosage: "1 Tablet", freq: "Bedtime", status: "Active" }
        ]
    },
    {
        id: "2",
        name: "Robert Chen",
        mrn: "#MED-9921",
        age: 48,
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        bloodType: "A+",
        allergies: "Sulfa Drugs",
        risk: "Acute ECG Alert",
        riskLevel: "danger",
        time: "15:00 PM",
        reason: "Chest Tightness & Palpitations",
        vitals: { hr: 104, bp: "152/94", spo2: "95%", temp: "99.1°F", glucose: "145 mg/dL" },
        status: "waiting",
        type: "In-Person",
        phone: "+1 (555) 891-3321",
        meds: [
            { name: "Aspirin 81mg", dosage: "1 Tablet", freq: "Daily", status: "Active" }
        ]
    },
    {
        id: "3",
        name: "Sophia Martinez",
        mrn: "#MED-4410",
        age: 31,
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        bloodType: "B+",
        allergies: "None Known",
        risk: "Low Risk",
        riskLevel: "success",
        time: "15:30 PM",
        reason: "Telehealth Post-Op Consultation",
        vitals: { hr: 68, bp: "118/76", spo2: "99%", temp: "98.4°F", glucose: "92 mg/dL" },
        status: "telehealth",
        type: "Telehealth",
        phone: "+1 (555) 443-0092",
        meds: [
            { name: "Amoxicillin 500mg", dosage: "1 Capsule", freq: "Every 8 Hours", status: "Active" }
        ]
    },
    {
        id: "4",
        name: "Marcus Brody",
        mrn: "#MED-3319",
        age: 57,
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        bloodType: "AB+",
        allergies: "Codeine",
        risk: "Moderate HTN",
        riskLevel: "warning",
        time: "16:00 PM",
        reason: "Hypertension Routine Screening",
        vitals: { hr: 82, bp: "142/90", spo2: "97%", temp: "98.7°F", glucose: "105 mg/dL" },
        status: "waiting",
        type: "In-Person",
        phone: "+1 (555) 671-8843",
        meds: [
            { name: "Amlodipine 5mg", dosage: "1 Tablet", freq: "Morning", status: "Active" }
        ]
    },
    {
        id: "5",
        name: "Hannah Taylor",
        mrn: "#MED-7712",
        age: 29,
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bloodType: "O-",
        allergies: "Latex",
        risk: "Routine Follow-up",
        riskLevel: "success",
        time: "16:30 PM",
        reason: "Virtual Asthma Review",
        vitals: { hr: 72, bp: "120/78", spo2: "98%", temp: "98.2°F", glucose: "88 mg/dL" },
        status: "telehealth",
        type: "Telehealth",
        phone: "+1 (555) 902-1144",
        meds: [
            { name: "Albuterol Inhaler", dosage: "2 Puffs", freq: "PRN", status: "Active" }
        ]
    },
    {
        id: "6",
        name: "David Miller",
        mrn: "#MED-1102",
        age: 71,
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        bloodType: "A-",
        allergies: "NSAIDs",
        risk: "Post-CABG Monitor",
        riskLevel: "warning",
        time: "17:00 PM",
        reason: "Post-Surgical Heart Rhythm Check",
        vitals: { hr: 76, bp: "130/82", spo2: "96%", temp: "98.5°F", glucose: "115 mg/dL" },
        status: "waiting",
        type: "In-Person",
        phone: "+1 (555) 334-9910",
        meds: [
            { name: "Metoprolol 50mg", dosage: "1 Tablet", freq: "Twice Daily", status: "Active" }
        ]
    }
];

let selectedPatient = PATIENTS_DB[0];
let vitalsChartInstance = null;
let analyticsChartInstance = null;
let currentDicomZoom = 1;
let currentDicomInvert = false;

// DOM Ready Initializer
document.addEventListener("DOMContentLoaded", () => {
    initLiveClock();
    initNavigation();
    renderQueueTable("all");
    updateSpotlightCard(selectedPatient);
    initEhrTabs();
    initDicomTools();
    initPrescriptionEvents();
    initModals();
    initCharts();
});

// Live Clock Generator
function initLiveClock() {
    const clockEl = document.getElementById("live-time");
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Sidebar View Switcher
function initNavigation() {
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    const views = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const viewTarget = item.getAttribute("data-view");

            if (!viewTarget) return;

            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            views.forEach(view => {
                view.classList.remove("active");
                if (view.id === `view-${viewTarget}`) {
                    view.classList.add("active");
                }
            });
        });
    });
}

// Render Patient Queue Table
function renderQueueTable(filter) {
    const tableBody = document.getElementById("queue-table-body");
    tableBody.innerHTML = "";

    const filteredPatients = PATIENTS_DB.filter(p => {
        if (filter === "all") return true;
        if (filter === "waiting") return p.status === "waiting";
        if (filter === "in-room") return p.status === "in-room";
        if (filter === "telehealth") return p.status === "telehealth";
        return true;
    });

    filteredPatients.forEach(patient => {
        const tr = document.createElement("tr");
        if (selectedPatient.id === patient.id) {
            tr.classList.add("active-row");
        }

        let statusBadge = "";
        if (patient.status === "in-room") {
            statusBadge = `<span class="badge badge-success"><i class="fa-solid fa-door-open"></i> In Room 2</span>`;
        } else if (patient.status === "waiting") {
            statusBadge = `<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Waiting (14m)</span>`;
        } else if (patient.status === "telehealth") {
            statusBadge = `<span class="badge badge-info"><i class="fa-solid fa-video"></i> Telehealth</span>`;
        } else {
            statusBadge = `<span class="badge badge-light">Completed</span>`;
        }

        let consultTypeBadge = patient.type === "Telehealth" ?
            `<span class="badge badge-info"><i class="fa-solid fa-headset"></i> Virtual</span>` :
            `<span class="badge badge-light"><i class="fa-solid fa-building"></i> Clinic</span>`;

        tr.innerHTML = `
            <td class="font-mono font-semibold">${patient.time}</td>
            <td>
                <div class="patient-cell">
                    <img src="${patient.avatar}" class="patient-avatar-sm" alt="${patient.name}">
                    <div>
                        <span class="patient-meta-name">${patient.name}</span>
                        <span class="patient-meta-sub">${patient.age} yrs • ${patient.gender} • ${patient.mrn}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-xs font-semibold text-slate-800">BP: ${patient.vitals.bp} | HR: ${patient.vitals.hr} bpm</div>
                <div class="text-xs text-muted">${patient.reason}</div>
            </td>
            <td>${consultTypeBadge}</td>
            <td>${statusBadge}</td>
            <td class="text-right">
                <button class="btn btn-xs btn-primary select-patient-btn" data-id="${patient.id}">
                    <i class="fa-solid fa-folder-open"></i> Chart
                </button>
            </td>
        `;

        tr.addEventListener("click", () => {
            selectedPatient = patient;
            renderQueueTable(filter);
            updateSpotlightCard(patient);
        });

        tableBody.appendChild(tr);
    });

    // Update filter tab buttons active state
    const filterTabs = document.querySelectorAll("#queue-filter-tabs .tab-btn");
    filterTabs.forEach(tab => {
        tab.classList.remove("active");
        if (tab.getAttribute("data-filter") === filter) {
            tab.classList.add("active");
        }

        tab.onclick = () => renderQueueTable(tab.getAttribute("data-filter"));
    });
}

// Update Spotlight Card on Dashboard
function updateSpotlightCard(patient) {
    const spotlightContent = document.getElementById("spotlight-content");
    const statusBadge = document.getElementById("spotlight-status-badge");

    if (patient.status === "in-room") {
        statusBadge.className = "badge badge-success";
        statusBadge.innerHTML = `<i class="fa-solid fa-door-open"></i> Exam Room 2`;
    } else {
        statusBadge.className = "badge badge-warning";
        statusBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Waiting Room`;
    }

    spotlightContent.innerHTML = `
        <div class="flex-between mb-3">
            <div class="patient-cell">
                <img src="${patient.avatar}" class="ehr-avatar" style="width:52px;height:52px;" alt="${patient.name}">
                <div>
                    <h3 class="m-0" style="font-size:18px;">${patient.name}</h3>
                    <div class="text-xs text-muted">${patient.age} yrs, ${patient.gender} • ${patient.mrn}</div>
                </div>
            </div>
            <span class="blood-badge" style="position:static;display:inline-block;">${patient.bloodType}</span>
        </div>

        <div class="badge badge-${patient.riskLevel} mb-3" style="width:100%;justify-content:center;">
            <i class="fa-solid fa-shield-halved"></i> ${patient.risk}
        </div>

        <div class="vitals-mini-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#F8FAFC;padding:12px;border-radius:10px;border:1px solid #E2E8F0;">
            <div>
                <span class="text-xs text-muted block">Blood Pressure</span>
                <strong class="text-sm font-mono text-slate-800">${patient.vitals.bp} mmHg</strong>
            </div>
            <div>
                <span class="text-xs text-muted block">Heart Rate</span>
                <strong class="text-sm font-mono text-slate-800">${patient.vitals.hr} BPM</strong>
            </div>
            <div>
                <span class="text-xs text-muted block">SpO2 Oxygen</span>
                <strong class="text-sm font-mono text-slate-800">${patient.vitals.spo2}</strong>
            </div>
            <div>
                <span class="text-xs text-muted block">Blood Glucose</span>
                <strong class="text-sm font-mono text-slate-800">${patient.vitals.glucose}</strong>
            </div>
        </div>

        <div class="mt-3">
            <span class="text-xs font-semibold text-slate-700 block mb-1"><i class="fa-solid fa-notes-medical text-primary"></i> Reason for Visit:</span>
            <p class="text-xs text-slate-600">${patient.reason}</p>
        </div>

        <div class="mt-2">
            <span class="text-xs font-semibold text-danger block mb-1"><i class="fa-solid fa-triangle-exclamation"></i> Known Allergies:</span>
            <p class="text-xs text-danger font-semibold">${patient.allergies}</p>
        </div>
    `;

    // Hook up launch button
    document.getElementById("open-full-ehr-btn").onclick = () => openEhrWorkspace(patient);
    document.getElementById("spotlight-rx-btn").onclick = () => openRxForPatient(patient);
}

// Open EHR Workspace View
function openEhrWorkspace(patient) {
    selectedPatient = patient;

    // Switch View Nav
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(n => n.classList.remove("active"));
    document.getElementById("nav-patients").classList.add("active");

    document.querySelectorAll(".view-section").forEach(v => v.classList.remove("active"));
    document.getElementById("view-patients").classList.add("active");

    // Populate EHR Header
    document.getElementById("ehr-patient-avatar").src = patient.avatar;
    document.getElementById("ehr-patient-name").textContent = patient.name;
    document.getElementById("ehr-patient-mrn").textContent = `MRN: ${patient.mrn}`;
    document.getElementById("ehr-patient-blood").textContent = patient.bloodType;
    document.getElementById("ehr-patient-demo").textContent = `${patient.age} yrs, ${patient.gender}`;
    document.getElementById("ehr-patient-phone").textContent = patient.phone;
    document.getElementById("ehr-patient-allergies").textContent = patient.allergies;

    const riskBadge = document.getElementById("ehr-patient-risk");
    riskBadge.className = `badge badge-${patient.riskLevel}`;
    riskBadge.textContent = patient.risk;

    // Vitals values
    document.getElementById("vital-hr-val").textContent = patient.vitals.hr;
    document.getElementById("vital-bp-val").textContent = patient.vitals.bp;
    document.getElementById("vital-spo2-val").textContent = patient.vitals.spo2;
    document.getElementById("vital-temp-val").textContent = patient.vitals.temp;

    // Active meds table update
    renderActiveMedsTable(patient);
}

function renderActiveMedsTable(patient) {
    const tableBody = document.getElementById("active-meds-table");
    tableBody.innerHTML = "";
    patient.meds.forEach(med => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${med.name}</strong></td>
            <td>${med.dosage}</td>
            <td>${med.freq}</td>
            <td>Aug 01, 2026</td>
            <td><span class="badge badge-success">${med.status}</span></td>
            <td><button class="btn btn-xs btn-outline-danger">Discontinue</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

// EHR Tab Swapping
function initEhrTabs() {
    const tabs = document.querySelectorAll(".ehr-tab");
    const contents = document.querySelectorAll(".ehr-tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-ehr-tab");
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(`ehr-tab-${target}`).classList.add("active");
        });
    });

    document.getElementById("ehr-back-btn").onclick = () => {
        document.getElementById("nav-dashboard").click();
    };

    document.getElementById("ehr-prescribe-btn").onclick = () => {
        openRxForPatient(selectedPatient);
    };
}

// Helper to open EHR tab directly
window.openEhrWithTab = function(tabName) {
    openEhrWorkspace(selectedPatient);
    const targetTab = document.querySelector(`.ehr-tab[data-ehr-tab="${tabName}"]`);
    if (targetTab) targetTab.click();
};

// DICOM Tools (Pan/Zoom/Invert)
function initDicomTools() {
    const img = document.getElementById("dicom-image");

    document.getElementById("tool-zoom-in").onclick = () => {
        currentDicomZoom += 0.25;
        applyDicomTransforms();
    };

    document.getElementById("tool-zoom-out").onclick = () => {
        if (currentDicomZoom > 0.5) {
            currentDicomZoom -= 0.25;
            applyDicomTransforms();
        }
    };

    document.getElementById("tool-invert").onclick = () => {
        currentDicomInvert = !currentDicomInvert;
        applyDicomTransforms();
    };

    document.getElementById("tool-reset").onclick = () => {
        currentDicomZoom = 1;
        currentDicomInvert = false;
        applyDicomTransforms();
    };
}

function applyDicomTransforms() {
    const img = document.getElementById("dicom-image");
    let filterStr = currentDicomInvert ? "invert(100%)" : "none";
    img.style.transform = `scale(${currentDicomZoom})`;
    img.style.filter = filterStr;
}

// SOAP Templates Quick Inserter
window.insertSoapTemplate = function(type) {
    if (type === 'hypertension') {
        document.getElementById("soap-subjective").value = "Patient reports mild morning headaches and intermittent dizziness over past 5 days. Adherent to daily Lisinopril 10mg.";
        document.getElementById("soap-objective").value = "Vitals: BP 138/88 mmHg, HR 78 bpm. Lungs clear, no peripheral edema.";
        document.getElementById("soap-assessment").value = "Essential Stage 1 Hypertension with inadequate systolic response.";
        document.getElementById("soap-plan").value = "1. Increase Lisinopril to 20mg daily.\n2. Recheck BP in 14 days.";
    } else if (type === 'cardiac') {
        document.getElementById("soap-subjective").value = "Patient presents with chest tightness radiating to left shoulder during exertion. Denies diaphoresis or syncope.";
        document.getElementById("soap-objective").value = "ECG shows sinus rhythm with minor ST flattening. BP 145/92 mmHg, HR 92 bpm.";
        document.getElementById("soap-assessment").value = "Rule out Acute Coronary Syndrome / Exertional Angina.";
        document.getElementById("soap-plan").value = "1. Stat Cardiac Enzymes (Troponin T/I).\n2. Order Stress Echocardiogram.";
    } else if (type === 'routine') {
        document.getElementById("soap-subjective").value = "Routine annual physical exam. Patient reports feeling well with good exercise tolerance.";
        document.getElementById("soap-objective").value = "Vitals stable: BP 118/76 mmHg, HR 68 bpm. All systems normal.";
        document.getElementById("soap-assessment").value = "Healthy adult female, routine preventive health maintenance.";
        document.getElementById("soap-plan").value = "1. Fasting Lipid Panel & Screening Labs.\n2. Return in 1 year.";
    }
};

// Prescription Studio Logic
function initPrescriptionEvents() {
    document.getElementById("quick-rx-btn").onclick = () => {
        document.getElementById("nav-prescriptions").click();
    };

    const addLineBtn = document.getElementById("rx-add-line-btn");
    const tbody = document.getElementById("rx-items-body");

    addLineBtn.onclick = () => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="text" class="form-control" placeholder="Drug name e.g. Metformin 500mg"></td>
            <td><input type="text" class="form-control" placeholder="e.g. 1 Tablet"></td>
            <td>
                <select class="form-control">
                    <option>Once Daily (Morning)</option>
                    <option>Twice Daily (BID)</option>
                    <option>Every 8 Hours (TID)</option>
                    <option>As Needed (PRN)</option>
                </select>
            </td>
            <td><input type="text" class="form-control" placeholder="30 Days"></td>
            <td><input type="text" class="form-control" placeholder="Instructions & refills"></td>
            <td><button type="button" class="btn btn-xs btn-outline-danger remove-rx-row"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
        attachRowRemoveListeners();
    };

    attachRowRemoveListeners();

    document.getElementById("generate-prescription-modal-btn").onclick = () => {
        generateRxModal();
    };
}

function attachRowRemoveListeners() {
    document.querySelectorAll(".remove-rx-row").forEach(btn => {
        btn.onclick = (e) => {
            const row = e.target.closest("tr");
            if (document.querySelectorAll("#rx-items-body tr").length > 1) {
                row.remove();
            }
        };
    });
}

function openRxForPatient(patient) {
    document.getElementById("nav-prescriptions").click();
    const select = document.getElementById("rx-patient-select");
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(patient.name)) {
            select.selectedIndex = i;
            break;
        }
    }
}

function generateRxModal() {
    const rxModal = document.getElementById("rx-modal");
    const patientName = document.getElementById("rx-patient-select").options[document.getElementById("rx-patient-select").selectedIndex].text.split("(")[0];
    const drugsContainer = document.getElementById("modal-rx-drugs-list");

    document.getElementById("modal-rx-patient").textContent = patientName;
    document.getElementById("modal-rx-date").textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    drugsContainer.innerHTML = "";
    const rows = document.querySelectorAll("#rx-items-body tr");
    rows.forEach(r => {
        const inputs = r.querySelectorAll("input, select");
        const drugName = inputs[0].value || "Medication";
        const dosage = inputs[1].value || "As Directed";
        const freq = inputs[2].value;
        const duration = inputs[3].value || "30 Days";
        const notes = inputs[4].value || "Take with meals.";

        const item = document.createElement("div");
        item.className = "rx-drug-item";
        item.innerHTML = `
            <div class="rx-drug-name"><i class="fa-solid fa-pills text-primary"></i> ${drugName} - ${dosage}</div>
            <div class="rx-drug-instructions"><strong>SIG:</strong> Take ${dosage}, ${freq} for ${duration}. ${notes}</div>
        `;
        drugsContainer.appendChild(item);
    });

    rxModal.classList.add("active");
}

// Modals Handler
function initModals() {
    const rxModal = document.getElementById("rx-modal");
    document.getElementById("close-rx-modal").onclick = () => rxModal.classList.remove("active");
    document.getElementById("close-modal-bottom-btn").onclick = () => rxModal.classList.remove("active");

    const emergencyModal = document.getElementById("emergency-modal");
    document.getElementById("emergency-alert-btn").onclick = () => emergencyModal.classList.add("active");
    document.getElementById("close-emergency-modal").onclick = () => emergencyModal.classList.remove("active");
    document.getElementById("cancel-emergency-btn").onclick = () => emergencyModal.classList.remove("active");

    document.getElementById("confirm-emergency-btn").onclick = () => {
        alert("🚨 CODE BLUE BROADCASTED! Emergency Response Team dispatched to location.");
        emergencyModal.classList.remove("active");
    };
}

// Chart.js Vitals & Practice Analytics Initialization
function initCharts() {
    const vitalsCtx = document.getElementById("vitalsTrendChart");
    if (vitalsCtx) {
        vitalsChartInstance = new Chart(vitalsCtx, {
            type: 'line',
            data: {
                labels: ['08:00 AM', '10:00 AM', '12:00 PM', '14:00 PM', '16:00 PM', '18:00 PM'],
                datasets: [
                    {
                        label: 'Systolic BP (mmHg)',
                        data: [142, 138, 140, 138, 136, 134],
                        borderColor: '#DC2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.05)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Heart Rate (BPM)',
                        data: [84, 78, 80, 76, 74, 72],
                        borderColor: '#0284C7',
                        backgroundColor: 'rgba(2, 132, 199, 0.05)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { min: 50, max: 160 } }
            }
        });
    }

    const analyticsCtx = document.getElementById("practiceAnalyticsChart");
    if (analyticsCtx) {
        analyticsChartInstance = new Chart(analyticsCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [
                    { label: 'Completed Consultations', data: [22, 18, 25, 20, 19, 14], backgroundColor: '#0284C7' },
                    { label: 'E-Prescriptions Issued', data: [18, 14, 21, 16, 15, 10], backgroundColor: '#0D9488' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
}
