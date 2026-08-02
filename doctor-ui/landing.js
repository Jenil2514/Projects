/**
 * AuraMed Care - Patient Landing Page & Interactive Booking Wizard
 */

document.addEventListener("DOMContentLoaded", () => {
    initDoctorFilter();
    initBookingWizard();
    initHeroQuickSearch();
    initFaqAccordion();
});

// FAQ Accordion Toggle
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-accordion-item");

    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-question-btn");
        if (btn) {
            btn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");

                faqItems.forEach(i => i.classList.remove("active"));

                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });
}

// Doctor Category Tabs Filter
function initDoctorFilter() {
    const tabs = document.querySelectorAll("#doctor-tabs .doc-tab");
    const cards = document.querySelectorAll("#doctors-grid .doctor-card");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const dept = tab.getAttribute("data-dept");

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            cards.forEach(card => {
                const cardDept = card.getAttribute("data-dept");
                if (dept === "all" || cardDept === dept) {
                    card.style.display = "block";
                    card.style.animation = "fadeIn 0.3s ease";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

// Hero Quick Search Trigger
function initHeroQuickSearch() {
    const searchBtn = document.getElementById("quick-search-btn");
    searchBtn.addEventListener("click", () => {
        const specialty = document.getElementById("quick-specialty").value;
        const date = document.getElementById("quick-date").value;
        openBookingWizardWithData(specialty, date);
    });
}

// 3-Step Appointment Booking Wizard Logic
let currentStep = 1;

function initBookingWizard() {
    const modal = document.getElementById("booking-modal");
    const closeBtn = document.getElementById("close-booking-modal");
    const triggers = document.querySelectorAll("#hero-book-trigger, .book-specific-doc");

    triggers.forEach(trig => {
        trig.addEventListener("click", (e) => {
            const specificDoc = trig.getAttribute("data-doctor");
            if (specificDoc) {
                const selectDoc = document.getElementById("modal-select-doctor");
                for (let i = 0; i < selectDoc.options.length; i++) {
                    if (selectDoc.options[i].value.includes(specificDoc)) {
                        selectDoc.selectedIndex = i;
                        break;
                    }
                }
            }
            openWizard();
        });
    });

    closeBtn.onclick = () => closeModal();

    // Time Slot Button Selection
    const timeSlots = document.querySelectorAll(".time-slot-btn");
    timeSlots.forEach(slot => {
        slot.addEventListener("click", () => {
            timeSlots.forEach(s => s.classList.remove("active"));
            slot.classList.add("active");
        });
    });

    // Wizard Next & Prev Buttons
    const nextBtn = document.getElementById("wizard-next-btn");
    const prevBtn = document.getElementById("wizard-prev-btn");

    nextBtn.onclick = () => {
        if (currentStep === 1) {
            goToStep(2);
        } else if (currentStep === 2) {
            goToStep(3);
        } else if (currentStep === 3) {
            // Validate patient details
            const name = document.getElementById("modal-patient-name").value;
            const phone = document.getElementById("modal-patient-phone").value;
            if (!name || !phone) {
                alert("Please enter your name and phone number to confirm appointment.");
                return;
            }

            // Populate confirmation
            const doc = document.getElementById("modal-select-doctor").value;
            const date = document.getElementById("modal-select-date").value;
            const activeTime = document.querySelector(".time-slot-btn.active") ? document.querySelector(".time-slot-btn.active").textContent : "09:00 AM";

            document.getElementById("confirm-doc").textContent = doc;
            document.getElementById("confirm-datetime").textContent = `${date} at ${activeTime}`;
            document.getElementById("confirm-ref").textContent = `#AM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

            goToStep("confirm");
        } else if (currentStep === "confirm") {
            closeModal();
        }
    };

    prevBtn.onclick = () => {
        if (currentStep === 2) goToStep(1);
        else if (currentStep === 3) goToStep(2);
    };
}

function openWizard() {
    currentStep = 1;
    goToStep(1);
    document.getElementById("booking-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("booking-modal").classList.remove("active");
}

function openBookingWizardWithData(specialty, date) {
    if (date) document.getElementById("modal-select-date").value = date;
    openWizard();
}

function goToStep(step) {
    currentStep = step;
    const pages = document.querySelectorAll(".wizard-page");
    const dots = document.querySelectorAll(".wizard-step");
    const prevBtn = document.getElementById("wizard-prev-btn");
    const nextBtn = document.getElementById("wizard-next-btn");

    pages.forEach(p => p.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    if (step === "confirm") {
        document.getElementById("wizard-page-confirm").classList.add("active");
        prevBtn.style.display = "none";
        nextBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Done & Close`;
        return;
    }

    document.getElementById(`wizard-page-${step}`).classList.add("active");
    for (let i = 1; i <= step; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        if (dot) dot.classList.add("active");
    }

    if (step === 1) {
        prevBtn.style.display = "none";
        nextBtn.innerHTML = `Next Step <i class="fa-solid fa-arrow-right"></i>`;
    } else if (step === 2) {
        prevBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `Next Step <i class="fa-solid fa-arrow-right"></i>`;
    } else if (step === 3) {
        prevBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Confirm Appointment`;
    }
}
