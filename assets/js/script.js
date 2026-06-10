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

      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");

        const icon = menuBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }

  document.querySelectorAll("[data-whatsapp]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      let type = btn.getAttribute("data-whatsapp") || "quote";
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

/* Back to top button */
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
