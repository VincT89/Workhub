document.addEventListener("DOMContentLoaded", () => {
  // Splash Intro
  const intro = document.getElementById("intro");
  const landing = document.getElementById("landing");
  const navbar = document.querySelector(".navbar");
  const footer = document.querySelector("footer");

  setTimeout(() => {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
      document.body.classList.remove("intro-active");
      landing.classList.remove("hidden");
      navbar.classList.remove("hidden");
      footer.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
  }, 4500);

  // Navbar morphing on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Pricing toggle
  const toggleBtn = document.getElementById("togglePricing");
  const prices = document.querySelectorAll(".price");
  let isMonthly = true;

  toggleBtn.addEventListener("click", () => {
    isMonthly = !isMonthly;
    toggleBtn.textContent = isMonthly ? "Mensile" : "Annuale";
    prices.forEach(price => {
      price.textContent = isMonthly
        ? price.getAttribute("data-monthly")
        : price.getAttribute("data-yearly");
    });
  });

  // Tilt effect on cards
  document.querySelectorAll(".focus-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (x - centerX) / 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  // Reveal on scroll
  const revealElements = document.querySelectorAll("section, .focus-card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
});
