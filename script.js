document.addEventListener("DOMContentLoaded", () => {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (days && hours && minutes && seconds) {
    const eventDate = new Date(
      document.querySelector(".event-date")?.textContent?.includes("OCTOBER")
        ? "2026-10-10T11:00:00-04:00"
        : "2026-09-20T14:00:00-04:00",
    ).getTime();

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
      days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
      hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
      minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const shareButtons = [
    document.getElementById("share-event"),
    document.getElementById("share-flyer"),
  ].filter(Boolean);
  const shareStatus = document.getElementById("share-status");
  const shareData = {
    title: document.title,
    text: document.querySelector(".event-date")?.textContent?.trim() || "",
    url: window.location.href,
  };

  async function shareEvent() {
    if (navigator.share) {
      await navigator.share(shareData);
      return "Thanks for sharing the festival.";
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareData.url);
      return "Event link copied.";
    }

    throw new Error("Sharing is unavailable.");
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const message = await shareEvent();
        if (shareStatus) {
          shareStatus.textContent = message;
        }
      } catch (error) {
        if (error?.name !== "AbortError" && shareStatus) {
          shareStatus.textContent = "Unable to share this event.";
        }
      }
    });
  });
});
