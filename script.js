(() => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const mobileCta = document.getElementById("mobileCta");
  const contact = document.getElementById("contact");

  function onScroll() {
    const y = window.scrollY || 0;
    if (backToTop) backToTop.style.display = y > 700 ? "block" : "none";

    if (!mobileCta || !contact) return;
    const rect = contact.getBoundingClientRect();
    const isContactNear = rect.top < window.innerHeight * 0.65;
    mobileCta.style.opacity = isContactNear ? "0" : "1";
    mobileCta.style.pointerEvents = isContactNear ? "none" : "auto";
    mobileCta.setAttribute("aria-hidden", isContactNear ? "true" : "false");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
