(() => {
  // Mobile menu toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Subtle reveal on scroll
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();
