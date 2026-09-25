/* contact.js — sends contact form via WhatsApp */

document.addEventListener("DOMContentLoaded", function () {
  const form     = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name    = form.querySelector("#name").value.trim();
    const email   = form.querySelector("#email").value.trim();
    const phone   = form.querySelector("#phone") ? form.querySelector("#phone").value.trim() : "";
    const subject = form.querySelector("#subject") ? form.querySelector("#subject").options[form.querySelector("#subject").selectedIndex].text : "";
    const message = form.querySelector("#message").value.trim();

    if (!name) {
      showFeedback("error", "Please enter your name.");
      form.querySelector("#name").focus();
      return;
    }
    if (!message || message.length < 10) {
      showFeedback("error", "Message must be at least 10 characters.");
      form.querySelector("#message").focus();
      return;
    }

    const waNumber = (typeof SHOP !== "undefined") ? SHOP.whatsapp : "923036360703";
    let text = `*New Contact Message*\n\n`;
    text += `*Name:* ${name}\n`;
    if (email) text += `*Email:* ${email}\n`;
    if (phone) text += `*Phone:* ${phone}\n`;
    if (subject) text += `*Subject:* ${subject}\n\n`;
    text += `*Message:*\n${message}`;

    window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");

    showFeedback("success", `Opening WhatsApp to send your message...`);
    setTimeout(() => {
      form.reset();
      feedback.classList.remove("success", "error");
    }, 5000);
  });

  function showFeedback(type, message) {
    feedback.classList.remove("success", "error");
    feedback.textContent = message;
    feedback.classList.add(type);
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});
