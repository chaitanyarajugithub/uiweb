// Add your WhatsApp number in international format, without +, spaces, or punctuation.
const businessWhatsAppNumber = "YOUR_NUMBER_HERE";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const note = document.querySelector("#form-note");
  if (businessWhatsAppNumber === "YOUR_NUMBER_HERE") {
    note.textContent = "Please add your WhatsApp number in script.js to enable enquiries.";
    note.focus();
    return;
  }

  const data = new FormData(form);
  const message = [
    `Hello KodandaRamReddy Constructions and Interiors, my name is ${data.get("name")}.`,
    `My contact number is ${data.get("phone")}.`,
    `I'm interested in: ${data.get("project")}.`,
    data.get("message") ? `Project details: ${data.get("message")}` : "",
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
