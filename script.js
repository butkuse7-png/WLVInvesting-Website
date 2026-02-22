(() => {
  // ====== SETTINGS ======
  // Replace this with your Zapier/Make/CRM webhook URL to capture leads.
  // If you keep it as "FORM_ACTION" the script will use a mailto fallback.
  const WEBHOOK_URL = "FORM_ACTION";

  // If true, always use mailto (no webhook/CRM).
  const USE_MAILTO_FALLBACK = false;

  // Where the mailto should go (your inbox). Update to your real address.
  const MAILTO_TO = "info@wlvinvesting.com";

  // ====== NAV (mobile) ======
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ====== YEAR ======
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ====== FORM ======
  const form = document.getElementById("leadForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  const isWebhookConfigured = (WEBHOOK_URL && WEBHOOK_URL !== "FORM_ACTION");

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? "rgba(255,255,255,.75)" : "rgba(255,120,120,.9)";
  }

  function sanitize(str) {
    return String(str || "").trim();
  }

  function openMailto(payload) {
    const subject = encodeURIComponent("WLV Investing — New Website Lead");
    const body = encodeURIComponent(
      `New lead submitted from wlvinvesting.com\n\n` +
      `Name: ${payload.name}\n` +
      `Email: ${payload.email}\n` +
      `Interest: ${payload.interest}\n` +
      `Consent: ${payload.consent ? "Yes" : "No"}\n` +
      `Source: ${payload.source}\n` +
      `Page: ${payload.page}\n` +
      `Timestamp: ${new Date().toISOString()}\n`
    );
    window.location.href = `mailto:${MAILTO_TO}?subject=${subject}&body=${body}`;
  }

  async function postWebhook(payload) {
    // Note: Many webhook services accept JSON.
    // If your webhook requires x-www-form-urlencoded, tell me and I’ll adjust it.
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Webhook error: ${res.status} ${res.statusText} ${text}`.trim());
    }
  }

  if (form) {
    // If WEBHOOK_URL isn't configured, remove action attribute to prevent weird submits.
    if (!isWebhookConfigured) {
      form.removeAttribute("action");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = sanitize(document.getElementById("name")?.value);
      const email = sanitize(document.getElementById("email")?.value);
      const interest = sanitize(document.getElementById("interest")?.value);
      const consent = !!document.getElementById("consent")?.checked;

      if (name.length < 2) return setStatus("Please enter your name.", false);
      if (!email.includes("@") || !email.includes(".")) return setStatus("Please enter a valid email.", false);
      if (!consent) return setStatus("Please agree to be contacted.", false);

      const payload = {
        name,
        email,
        interest,
        consent,
        source: "wlvinvesting.com",
        page: "home",
        timestamp: new Date().toISOString(),
      };

      try {
        submitBtn && (submitBtn.disabled = true);
        setStatus("Submitting…");

        if (USE_MAILTO_FALLBACK || !isWebhookConfigured) {
          setStatus("Opening your email client…");
          openMailto(payload);
          setTimeout(() => setStatus("If your email app didn’t open, please email us directly."), 1200);
        } else {
          await postWebhook(payload);
          setStatus("Thanks — you’re all set! We’ll be in touch shortly.");
          form.reset();
        }
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong. Please try again or email us directly.", false);
      } finally {
        submitBtn && (submitBtn.disabled = false);
      }
    });
  }
})();
