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

function openWhatsApp(type = "quote", customMessage = "") {
  const message = customMessage || whatsappMessages[type] || whatsappMessages.quote;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function buildQuoteWhatsAppMessage(formData) {
  return `Hello SureSpark Cleaning, I need a cleaning quote.

Full name: ${formData.name}
Phone / WhatsApp: ${formData.phone}
Email: ${formData.email || "Not provided"}
City / Area: ${formData.city}
Service needed: ${formData.service}
Property type: ${formData.property || "Not provided"}
Preferred date: ${formData.date || "Not provided"}
Preferred time: ${formData.time || "Not provided"}

Cleaning details:
${formData.details}

I will send photos/videos of the space now.`;
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

  const quoteForm = document.getElementById("quoteForm");

  if (quoteForm) {
    quoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalButtonText = submitBtn ? submitBtn.innerHTML : "";

      const formData = {
        name: quoteForm.name.value.trim(),
        phone: quoteForm.phone.value.trim(),
        email: quoteForm.email.value.trim(),
        city: quoteForm.city.value.trim(),
        service: quoteForm.service.value,
        property: quoteForm.property.value,
        date: quoteForm.date.value,
        time: quoteForm.time.value,
        details: quoteForm.details.value.trim()
      };

      const whatsappMessage = buildQuoteWhatsAppMessage(formData);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending request...';
      }

      try {
        const response = await fetch("/api/submit-quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          alert(result.message || "Could not send email. WhatsApp will still open.");
        } else {
          alert("Your quote request has been sent by email. WhatsApp will now open so you can send photos/videos.");
        }
      } catch (error) {
        console.error("Quote form error:", error);
        alert("Email could not be sent right now. WhatsApp will still open.");
      } finally {
        openWhatsApp("quote", whatsappMessage);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalButtonText;
        }
      }
    });
  }

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
