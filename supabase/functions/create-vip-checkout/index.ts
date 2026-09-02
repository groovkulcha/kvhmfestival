import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;
const UNIT_AMOUNT = 2100;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function safeOrigin(value: string | null) {
  if (!value) return "";
  try {
    const origin = new URL(value).origin;
    if (origin === "https://groovkulcha.github.io" || origin === "http://localhost:3000" || origin === "http://127.0.0.1:5500") return origin;
  } catch {
    // Fall through to an empty string.
  }
  return "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const clientKey = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const prior = rateLimits.get(clientKey);
  const current = !prior || prior.resetAt <= now ? { count: 0, resetAt: now + RATE_WINDOW_MS } : prior;
  current.count += 1;
  rateLimits.set(clientKey, current);
  if (current.count > RATE_LIMIT) return json({ error: "Too many checkout attempts. Please wait a minute and try again." }, 429);

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return json({ error: "Stripe checkout is not configured yet. Please contact the organizer." }, 503);

  let payload: { quantity?: unknown; email?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const quantity = Number(payload.quantity ?? 1);
  const email = typeof payload.email === "string" ? payload.email.trim().slice(0, 320) : "";
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) return json({ error: "Quantity must be between 1 and 10." }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);

  const origin = safeOrigin(request.headers.get("origin")) || "https://groovkulcha.github.io";
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "KVHM VIP Tent Access",
            description: "VIP Tent Access — Kennebec Valley House Music Festival",
          },
          unit_amount: UNIT_AMOUNT,
        },
        quantity,
      }],
      success_url: `${origin}/kvhmfestival/vip-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kvhmfestival/vip.html?checkout=cancelled`,
      metadata: { product: "kvhm_vip_tent_access", quantity: String(quantity) },
      allow_promotion_codes: false,
    });
    if (!session.url) return json({ error: "Unable to start checkout." }, 500);
    return json({ checkout_url: session.url });
  } catch (error) {
    console.error("Stripe Checkout creation failed", error);
    return json({ error: "Unable to start checkout. Please try again." }, 502);
  }
});
