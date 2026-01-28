document.addEventListener("DOMContentLoaded", () => {
  const WORKER_URL = "https://wavegames-worker.salman-khattapp.workers.dev";

  function bindForm({
    formId,
    statusId,
    nameId,
    emailId,
    subjectId,
    messageId,
  }) {
    const form = document.getElementById(formId);
    if (!form) return;

    const statusEl = document.getElementById(statusId);

    const setStatus = (msg, ok = true) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.color = ok ? "green" : "red";
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById(nameId)?.value.trim() || "",
        email: document.getElementById(emailId)?.value.trim() || "",
        subject: document.getElementById(subjectId)?.value.trim() || "",
        message: document.getElementById(messageId)?.value.trim() || "",
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.subject ||
        !payload.message
      ) {
        setStatus("Please fill in all fields.", false);
        return;
      }

      try {
        setStatus("Sending message...");

        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {}

        if (!res.ok || !json?.success) {
          console.error("[contact] error:", res.status, text);
          setStatus("Failed to send message. Please try again.", false);
          return;
        }

        setStatus("Message sent successfully!");
        form.reset();
      } catch (err) {
        console.error("[contact] network error:", err);
        setStatus("Network error. Please try again later.", false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const WORKER_URL = "https://wavegames-worker.salman-khattapp.workers.dev";

    const newsletterForm = document.getElementById("newsletterForm");
    if (!newsletterForm) return;

    const emailInput = document.getElementById("newsletterEmail");
    const statusEl = document.getElementById("newsletterStatus");

    const setStatus = (msg, ok = true) => {
      statusEl.textContent = msg;
      statusEl.style.color = ok ? "green" : "red";
    };

    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) {
        setStatus("Please enter your email address.", false);
        return;
      }

      try {
        setStatus("Subscribing...");

        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newsletter",
            email,
          }),
        });

        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {}

        if (!res.ok || !json?.success) {
          console.error("[newsletter] error:", res.status, text);
          setStatus("Subscription failed. Please try again.", false);
          return;
        }

        setStatus("Successfully subscribed!");
        newsletterForm.reset();
      } catch (err) {
        console.error("[newsletter] network error:", err);
        setStatus("Network error. Please try again later.", false);
      }
    });
  });

  // Contact page form
  bindForm({
    formId: "contactForm",
    statusId: "contactStatus",
    nameId: "name",
    emailId: "email",
    subjectId: "subject",
    messageId: "message",
  });

  // Home page form
  bindForm({
    formId: "homeContactForm",
    statusId: "homeContactStatus",
    nameId: "contactName",
    emailId: "contactEmail",
    subjectId: "contactSubject",
    messageId: "contactMessage",
  });
});
