(() => {
  const eventDate = new Date("2026-10-10T11:00:00-04:00");
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  function updateCountdown() {
    const remaining = eventDate.getTime() - Date.now();

    if (remaining <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";
      return;
    }

    days.textContent = String(Math.floor(remaining / 86400000)).padStart(2, "0");
    hours.textContent = String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");
    minutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    seconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
