document.addEventListener("DOMContentLoaded", () => {
  const WORKER_URL = "https://wavegames-worker.salman-khattapp.workers.dev";

  async function postJson(payload) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}

    return { res, text, json };
  }

  function makeStatus(statusEl) {
    return (msg, ok = true) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.color = ok ? "green" : "red";
    };
  }

  function setButtonDisabled(form, disabled) {
    const btn =
      form.querySelector('button[type="submit"]') ||
      form.querySelector('input[type="submit"]');
    if (btn) btn.disabled = disabled;
  }

  function bindContactForm({
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
    const setStatus = makeStatus(statusEl);

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
        setButtonDisabled(form, true);
        setStatus("Sending message...");

        const { res, text, json } = await postJson(payload);

        if (!res.ok || !json?.success) {
          console.error(`[${formId}] error:`, res.status, text);
          setStatus("Failed to send message. Please try again.", false);
          return;
        }

        setStatus("Message sent successfully!");
        form.reset();
      } catch (err) {
        console.error(`[${formId}] network error:`, err);
        setStatus("Network error. Please try again later.", false);
      } finally {
        setButtonDisabled(form, false);
      }
    });
  }

  function bindNewsletterForm() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;

    const emailInput = document.getElementById("newsletterEmail");
    const statusEl = document.getElementById("newsletterStatus");
    const setStatus = makeStatus(statusEl);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = (emailInput?.value || "").trim();
      if (!email) {
        setStatus("Please enter your email address.", false);
        return;
      }

      try {
        setButtonDisabled(form, true);
        setStatus("Subscribing...");

        const { res, text, json } = await postJson({
          type: "newsletter",
          email,
        });

        if (!res.ok || !json?.success) {
          console.error("[newsletter] error:", res.status, text);
          setStatus("Subscription failed. Please try again.", false);
          return;
        }

        setStatus("Successfully subscribed!");
        form.reset();
      } catch (err) {
        console.error("[newsletter] network error:", err);
        setStatus("Network error. Please try again later.", false);
      } finally {
        setButtonDisabled(form, false);
      }
    });
  }

  // Contact page form
  bindContactForm({
    formId: "contactForm",
    statusId: "contactStatus",
    nameId: "name",
    emailId: "email",
    subjectId: "subject",
    messageId: "message",
  });

  // Home page form
  bindContactForm({
    formId: "homeContactForm",
    statusId: "homeContactStatus",
    nameId: "contactName",
    emailId: "contactEmail",
    subjectId: "contactSubject",
    messageId: "contactMessage",
  });

  // Newsletter form
  bindNewsletterForm();
});
