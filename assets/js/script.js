const WHATSAPP_NUMBER = "2348108444009";

function encodedMessage(message) {
  return encodeURIComponent(message);
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-nav]");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll("[data-whatsapp]").forEach((btn) => {
    const type = btn.getAttribute("data-whatsapp");

    let message = `Hello SureSpark Cleaning, I need a cleaning quote.

Service needed:
City/Area:
Preferred date:
Preferred time:
Property/vehicle details:
I will send photos/videos of the space now.`;

    if (type === "equipment") {
      message = `Hello SureSpark Cleaning, I would like to know more about your cleaning equipment and services.

Service needed:
City/Area:
Preferred date:
Message:`;
    }

    btn.setAttribute("href", whatsappUrl(message));
  });

  const quoteForm = document.querySelector("#quoteForm");

  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(quoteForm);

      const message = `Hello SureSpark Cleaning, I need a cleaning quote.

Full Name: ${data.get("name") || ""}
Phone/WhatsApp: ${data.get("phone") || ""}
Email: ${data.get("email") || ""}
City/Area: ${data.get("city") || ""}
Service Type: ${data.get("service") || ""}
Property Type: ${data.get("property") || ""}
Preferred Date: ${data.get("date") || ""}
Preferred Time: ${data.get("time") || ""}

Cleaning Details:
${data.get("details") || ""}

I will send photos/videos of the space now.`;

      window.open(whatsappUrl(message), "_blank");
    });
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
