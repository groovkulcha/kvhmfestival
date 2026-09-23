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
  }

  const shareButtons = [
    document.getElementById("share-event"),
    document.getElementById("share-flyer"),
  ].filter(Boolean);
  const shareStatus = document.getElementById("share-status");
  const eventDate = document.querySelector(".event-date")?.textContent?.trim();
  const eventVenue = document.querySelector(".event-venue")?.textContent?.trim();
  const shareData = {
    title: document.title,
    text: [eventDate, eventVenue].filter(Boolean).join(" · "),
    url: window.location.href,
  };
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedText = encodeURIComponent(`${shareData.title} — ${shareData.text}`);

  const shareMenu = document.createElement("div");
  shareMenu.className = "share-menu";
  shareMenu.hidden = true;
  shareMenu.innerHTML = `
    <div class="share-menu-backdrop" data-share-close></div>
    <div class="share-menu-panel" role="dialog" aria-modal="true" aria-labelledby="share-menu-title">
      <button class="share-menu-close" type="button" aria-label="Close share options" data-share-close>×</button>
      <p class="eyebrow">Share the festival</p>
      <h2 id="share-menu-title">Send it<br><em>to your people.</em></h2>
      <div class="share-menu-links">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer">X / Twitter</a>
        <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodedText}%0A${encodedUrl}">Email</a>
      </div>
      <button class="button button-primary share-copy" type="button">Copy link</button>
      <p class="share-menu-status" aria-live="polite"></p>
    </div>`;
  document.body.appendChild(shareMenu);
  const shareMenuStatus = shareMenu.querySelector(".share-menu-status");

  function closeShareMenu() {
    shareMenu.hidden = true;
    document.body.classList.remove("share-menu-open");
  }

  function openShareMenu() {
    shareMenu.hidden = false;
    document.body.classList.add("share-menu-open");
    shareMenu.querySelector(".share-menu-close").focus();
  }

  async function copyShareUrl() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareData.url);
      return;
    }

    const input = document.createElement("textarea");
    input.value = shareData.url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();

    if (!copied) {
      throw new Error("Unable to copy the event link.");
    }
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", openShareMenu);
  });

  shareMenu.querySelectorAll("[data-share-close]").forEach((control) => {
    control.addEventListener("click", closeShareMenu);
  });
  shareMenu.querySelector(".share-copy").addEventListener("click", async () => {
    try {
      await copyShareUrl();
      shareMenuStatus.textContent = "Event link copied.";
      if (shareStatus) {
        shareStatus.textContent = "Event link copied.";
      }
    } catch {
      shareMenuStatus.textContent = "Copy failed. Select and copy the page URL.";
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !shareMenu.hidden) {
      closeShareMenu();
    }
  });
});
