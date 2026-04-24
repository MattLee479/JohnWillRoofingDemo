const siteHeader = document.getElementById("site-header");
const progressBar = document.getElementById("scroll-progress-bar");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const contactForm = document.getElementById("contact-form");
const contactFormFields = document.getElementById("contact-form-fields");
const contactFormSuccess = document.getElementById("contact-form-success");
const contactFormStatus = document.getElementById("contact-form-status");
const currentYear = document.getElementById("current-year");

function updateScrollState() {
  const scrolled = window.scrollY > 24;
  const root = document.documentElement;
  const maxScroll = root.scrollHeight - root.clientHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", scrolled);
  }

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
}

function setMenuOpen(isOpen) {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    setMenuOpen(false);
  }
});
updateScrollState();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });
}

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

if (contactForm && contactFormFields && contactFormSuccess) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const defaultButtonLabel = submitButton ? submitButton.innerHTML : "";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!submitButton) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    if (contactFormStatus) {
      contactFormStatus.hidden = true;
      contactFormStatus.textContent = "";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      contactForm.reset();
      contactFormFields.hidden = true;
      contactFormSuccess.hidden = false;
    } catch (error) {
      if (contactFormStatus) {
        contactFormStatus.textContent =
          error instanceof Error ? error.message : "Something went wrong. Please try again.";
        contactFormStatus.hidden = false;
      }
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = defaultButtonLabel;
    }
  });
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
