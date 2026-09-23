document.addEventListener("DOMContentLoaded", () => {
  const eventDate = new Date("2026-10-10T11:00:00-04:00").getTime();

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (!days || !hours || !minutes || !seconds) {
    console.error("Countdown elements were not found.");
    return;
  }

  function updateCountdown() {
    const remaining = eventDate - Date.now();

    if (remaining <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const dayCount = Math.floor(totalSeconds / 86400);
    const hourCount = Math.floor((totalSeconds % 86400) / 3600);
    const minuteCount = Math.floor((totalSeconds % 3600) / 60);
    const secondCount = totalSeconds % 60;

    days.textContent = String(dayCount).padStart(2, "0");
    hours.textContent = String(hourCount).padStart(2, "0");
    minutes.textContent = String(minuteCount).padStart(2, "0");
    seconds.textContent = String(secondCount).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
});
