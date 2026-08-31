const FESTIVAL_API = "https://fnlozdznfvfwaullhqrj.supabase.co/functions/v1/festival-activity";
const EVENT_SLUG = "kennebec-valley-house-music-festival-2026";

function referrerDomain() {
  if (!document.referrer) return null;
  try { return new URL(document.referrer).hostname; } catch { return null; }
}

function track(action) {
  const payload = JSON.stringify({ action, event_slug: EVENT_SLUG, referrer_domain: referrerDomain() });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(FESTIVAL_API, new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch(FESTIVAL_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  } catch (_) {}
}

const festivalDate = new Date("2026-09-20T14:00:00-04:00");
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

document.querySelectorAll(".directions-link").forEach((link) => link.addEventListener("click", () => track("directions_click")));
document.querySelectorAll(".instagram-link").forEach((link) => link.addEventListener("click", () => track("instagram_click")));

const shareButton = document.getElementById("share-event");
const shareStatus = document.getElementById("share-status");
shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "Kennebec Valley House Music Festival",
    text: "Kennebec Valley House Music Festival — Sunday, September 20, 2026, 2:00 PM–8:00 PM at Mill Park Pavilion in Augusta, ME. Free event.",
    url: window.location.href
  };
  track("share_click");
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      if (shareStatus) shareStatus.textContent = "Thanks for sharing the festival.";
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    if (shareStatus) shareStatus.textContent = "Event link copied — send it to your people.";
  } catch (error) {
    if (error?.name !== "AbortError" && shareStatus) shareStatus.textContent = "Unable to share right now. Please copy the page link.";
  }
});

track("page_view");
