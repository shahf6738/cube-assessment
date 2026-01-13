document.addEventListener("DOMContentLoaded", () => {
  /* ====================== GALLERY ======================= */
  const mainImageEl = document.querySelector(".gallery__image");
  const dots = Array.from(document.querySelectorAll(".dot"));
  const leftBtn = document.querySelector(".gallery__arrow--left");
  const rightBtn = document.querySelector(".gallery__arrow--right");

  const images = [
    "assets/product-main1.png",
    "assets/product-main2.png",
    "assets/product-main1.png",
    "assets/product-main2.png",
  ];

  let currentIndex = 0;

  function updateGallery(index) {
    if (!mainImageEl) return;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    mainImageEl.src = images[currentIndex];
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex)
    );
  }

  leftBtn?.addEventListener("click", () => updateGallery(currentIndex - 1));
  rightBtn?.addEventListener("click", () => updateGallery(currentIndex + 1));
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => updateGallery(i))
  );

  /* ===================  THUMBNAILS ============================ */
  const thumbs = Array.from(document.querySelectorAll(".thumb"));

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      const bg = thumb.style.backgroundImage;
      if (!bg) return;
      const imageUrl = bg.replace(/^url\((['"]?)(.*)\1\)$/, "$2");
      mainImageEl.src = imageUrl;

      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      currentIndex = index;
    });
  });

  /* ====================== SUBSCRIPTION TOGGLE (SINGLE / DOUBLE)  ========================= */
  const planRadios = Array.from(
    document.querySelectorAll('input[name="plan"]')
  );

  const singleRow = document.querySelector(".product__price-row");
  const doubleRow = document.querySelector(".product__alt-price");

  const singleContent = document.querySelector(".product__content--single");
  const doubleContent = document.querySelector(".product__content--double");

  function applyPlanToggle() {
    const selected = planRadios.find((r) => r.checked);
    if (!selected) return;

    const isDouble = selected.closest(".product__alt-price") !== null;

    // Toggle visual highlight
    singleRow?.classList.toggle("is-selected", !isDouble);
    doubleRow?.classList.toggle("is-selected", isDouble);

    // Toggle content visibility
    singleContent?.classList.toggle("is-active", !isDouble);
    doubleContent?.classList.toggle("is-active", isDouble);

    updateAddButtonLabel();
  }

  planRadios.forEach((radio) =>
    radio.addEventListener("change", applyPlanToggle)
  );

  /* ====================== ADD TO CART LABEL  ========================= */
  const addBtn = document.querySelector(".product__add");
  const fragranceRadios = Array.from(
    document.querySelectorAll('input[name="fragrance"]')
  );

  function getSelectedFragrance() {
    const r = fragranceRadios.find((x) => x.checked);
    if (!r) return "Original";
    const label = r.closest(".choose__item");
    return (
      label?.querySelector(".choose__name")?.textContent.trim() || "Original"
    );
  }

  function updateAddButtonLabel() {
    if (!addBtn) return;

    /* ===== Get selected purchase type ===== */
    const selectedPlan = planRadios.find((r) => r.checked);
    let plan = "single";

    if (selectedPlan?.closest(".product__alt-price")) {
      plan = "double";
    }

    /* ===== Get selected fragrance ===== */
    const selectedFragranceRadio = fragranceRadios.find((r) => r.checked);
    let fragrance = "original";

    if (selectedFragranceRadio) {
      const item = selectedFragranceRadio.closest(".choose__item");
      fragrance =
        item
          ?.querySelector(".choose__name")
          ?.textContent.trim()
          .toLowerCase() || "original";
    }

    /* ===== Build dummy Add-to-Cart URL ===== */
    const cartUrl = `/cart?plan=${plan}&fragrance=${fragrance}`;

    /* ===== Apply ===== */
    addBtn.href = cartUrl;
    addBtn.textContent = "Add to Cart";
  }

  fragranceRadios.forEach((r) =>
    r.addEventListener("change", updateAddButtonLabel)
  );

  /* =======================  INITIAL STATE  ======================== */
  applyPlanToggle();
  updateAddButtonLabel();

  /* =======================  STATS COUNTER  ============================ */
  const statEls = Array.from(document.querySelectorAll(".stats-bar__value"));
  if ("IntersectionObserver" in window && statEls.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const to = parseInt(el.textContent.replace(/\D/g, ""), 10);
          animateCount(el, to, 1100);
          obs.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    statEls.forEach((el) => observer.observe(el));
  }

  function animateCount(el, target, duration) {
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(p * target) + "%";
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* =======================  ACCORDION  ========================== */
  const accordionHeaders = document.querySelectorAll(".collection__header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".collection__item");
      const open = item.classList.contains("collection__item--active");

      document
        .querySelectorAll(".collection__item")
        .forEach((i) => i.classList.remove("collection__item--active"));

      if (!open) item.classList.add("collection__item--active");
    });
  });

  /* =======================  HAMBURGER  =========================== */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navEl = document.querySelector(".navbar__nav");

  const actionsEl = document.querySelector(".navbar__actions");

  hamburgerBtn?.addEventListener("click", () => {
    navEl?.classList.toggle("nav-open");
    actionsEl?.classList.toggle("nav-open");
  });
});
