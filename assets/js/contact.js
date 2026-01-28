document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactStatus");
  const submitBtn = document.getElementById("contactSubmit");

  // Quick proof the script is loaded
  console.log("[contact.js] loaded", { form });

  if (!form) return;

  const setStatus = (msg, ok = true) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? "green" : "red";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      subject: document.getElementById("subject")?.value.trim() || "",
      message: document.getElementById("message")?.value.trim() || "",
    };

    // Basic validation
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setStatus("Please fill in all fields.", false);
      return;
    }

    // MUST be your deployed Worker URL
    const WORKER_URL = "https://wavegames-worker.salman-khattapp.workers.dev";

    try {
      submitBtn && (submitBtn.disabled = true);
      setStatus("Sending message...");

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Read as text first (handles non-JSON error pages)
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch {}

      if (!res.ok) {
        console.error("[contact.js] Worker error:", res.status, text);
        setStatus(`Failed to send (HTTP ${res.status}). Check console.`, false);
        return;
      }

      if (json && json.success) {
        setStatus("Message sent successfully!");
        form.reset();
      } else {
        console.error("[contact.js] Unexpected response:", text);
        setStatus("Failed to send. Unexpected response. Check console.", false);
      }
    } catch (err) {
      console.error("[contact.js] Network error:", err);
      setStatus("Network error. Please try again later.", false);
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
});
