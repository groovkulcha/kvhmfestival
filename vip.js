const FUNCTION_URL = "https://fnlozdznfvfwaullhqrj.supabase.co/functions/v1/create-vip-checkout";
const UNIT_PRICE = 21;

const form = document.querySelector("#vip-checkout-form");
const email = document.querySelector("#email");
const quantity = document.querySelector("#quantity");
const total = document.querySelector("#total");
const message = document.querySelector("#checkout-message");
const button = document.querySelector("#checkout-button");

function normalizedQuantity() {
  const value = Number.parseInt(quantity.value, 10);
  return Number.isInteger(value) ? Math.min(10, Math.max(1, value)) : 1;
}

function updateTotal() {
  const value = normalizedQuantity();
  quantity.value = value;
  total.textContent = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value * UNIT_PRICE);
}

function showMessage(text) {
  message.textContent = text;
  message.hidden = !text;
}

quantity.addEventListener("input", updateTotal);
document.querySelectorAll("[data-change]").forEach((control) => {
  control.addEventListener("click", () => {
    quantity.value = normalizedQuantity() + Number(control.dataset.change);
    updateTotal();
  });
});

if (new URLSearchParams(window.location.search).get("checkout") === "cancelled") {
  document.querySelector("#cancelled-message").hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");
  const buyerEmail = email.value.trim();
  const passCount = normalizedQuantity();
  if (!email.checkValidity()) {
    email.focus();
    showMessage("Enter a valid email address for your Stripe receipt.");
    return;
  }

  button.disabled = true;
  button.textContent = "Opening secure checkout…";
  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: buyerEmail, quantity: passCount }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.checkout_url) throw new Error(payload.error || "Checkout could not be started.");
    window.location.assign(payload.checkout_url);
  } catch (error) {
    showMessage(error.message || "Checkout could not be started. Please try again.");
    button.disabled = false;
    button.innerHTML = "Continue to secure checkout <span aria-hidden=\"true\">→</span>";
  }
});

updateTotal();
