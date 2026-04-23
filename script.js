const siteHeader = document.getElementById("site-header");
const progressBar = document.getElementById("scroll-progress-bar");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const contactForm = document.getElementById("contact-form");
const contactFormFields = document.getElementById("contact-form-fields");
const contactFormSuccess = document.getElementById("contact-form-success");
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
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactFormFields.hidden = true;
    contactFormSuccess.hidden = false;
  });
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
