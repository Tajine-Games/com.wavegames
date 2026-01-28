document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(
        "https://wavegames-worker.salman-khattapp.workers.dev",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  });
});
