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
  const shareDialog = document.createElement("dialog");
  shareDialog.className = "share-dialog";
  shareDialog.innerHTML = `
    <form method="dialog" class="share-dialog-card">
      <button class="share-dialog-close" value="cancel" aria-label="Close share options">×</button>
      <p class="eyebrow">Share the festival</p>
      <h2>Copy the event link.</h2>
      <input class="share-dialog-input" type="text" readonly aria-label="Event link">
      <button class="button button-primary share-dialog-copy" type="button">Copy link</button>
      <p class="share-dialog-status" aria-live="polite"></p>
    </form>`;
  document.body.appendChild(shareDialog);
  const shareInput = shareDialog.querySelector(".share-dialog-input");
  const shareDialogStatus = shareDialog.querySelector(".share-dialog-status");
  shareInput.value = shareData.url;

  function showShareDialog() {
    if (typeof shareDialog.showModal === "function") {
      shareDialog.showModal();
    } else {
      shareDialog.setAttribute("open", "");
    }
    shareInput.select();
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", showShareDialog);
  });

  shareDialog.querySelector(".share-dialog-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      shareDialogStatus.textContent = "Event link copied.";
      if (shareStatus) {
        shareStatus.textContent = "Event link copied.";
      }
    } catch {
      shareInput.focus();
      shareInput.select();
      shareDialogStatus.textContent = "Select the link and copy it.";
    }
  });
});
