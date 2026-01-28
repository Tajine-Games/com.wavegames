document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("name")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();
    const subject = (document.getElementById("subject")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const to = "amine.abourifa.games@gmail.com";
    const fullSubject = encodeURIComponent(subject);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    );

    // Opens user's mail client with prefilled data
    window.location.href = `mailto:${to}?subject=${fullSubject}&body=${body}`;
  });
});
