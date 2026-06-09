const phoneNumber = "2348108444009";

const whatsappMessages = {
  quote: `Hello SureSpark Cleaning, I need a cleaning quote.

Service needed:
City/Area:
Preferred date:
Preferred time:
Property/vehicle details:
I will send photos/videos of the space now.`,

  equipment: `Hello SureSpark Cleaning, I would like to ask about your cleaning equipment and services.

Service needed:
City/Area:
Type of cleaning:
Photos/videos available: Yes/No`,

  gallery: `Hello SureSpark Cleaning, I want to send cleaning site photos/videos for the gallery.

Photo/video type:
Service type:
Location:
Notes:`,

  review: `Hello SureSpark Cleaning, I would like to leave a review.

My name:
Service used:
Rating out of 5:
My review:

Thank you.`
};

function openWhatsApp(type = "quote") {
  const message = whatsappMessages[type] || whatsappMessages.quote;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
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
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      let type = btn.getAttribute("data-whatsapp");

      const btnText = btn.textContent.toLowerCase();
      const pagePath = window.location.pathname.toLowerCase();

      if (
        btnText.includes("review") ||
        btnText.includes("leave a review") ||
        btnText.includes("write a review") ||
        pagePath.includes("reviews")
      ) {
        type = "review";
      }

      openWhatsApp(type);
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const galleryCards = document.querySelectorAll("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      galleryCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";

        if (filter === "all" || category.includes(filter)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
