const festivalDate = new Date("2026-09-20T12:00:00");

function updateCountdown() {
  const distance = Math.max(0, festivalDate - new Date());
  const units = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };
  Object.entries(units).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const form = document.getElementById("email-form");
const email = document.getElementById("email");
const status = document.getElementById("form-status");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!email.validity.valid) {
    status.textContent = "Please enter a valid email address.";
    email.focus();
    return;
  }
  status.textContent = "You are on the list. Watch your inbox.";
  form.reset();
});
