/* ExoSeq® — interactive behaviors */
(function () {
  "use strict";

  /* Mobile nav toggle */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      header.classList.toggle("nav-open");
      const expanded = header.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", expanded);
    });
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) header.classList.remove("nav-open");
    });
  }

  /* Active nav link based on path */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a[data-route]").forEach((a) => {
    if (a.getAttribute("data-route") === path) a.classList.add("is-active");
  });

  /* Reveal-on-scroll */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* Filter pills (Clinical Areas page) */
  const filters = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-cat]");
  if (filters.length && items.length) {
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-filter");
        filters.forEach((b) => b.classList.toggle("is-active", b === btn));
        items.forEach((it) => {
          const show = target === "all" || it.getAttribute("data-cat") === target;
          it.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ExoSearch — client-side filter demo */
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");
  if (searchInput && searchResults) {
    const rows = Array.from(searchResults.querySelectorAll("tr[data-row]"));
    const empty = searchResults.querySelector("[data-empty]");
    const run = () => {
      const q = searchInput.value.trim().toLowerCase();
      let visible = 0;
      rows.forEach((r) => {
        const text = r.getAttribute("data-row").toLowerCase();
        const show = !q || text.includes(q);
        r.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? "" : "none";
    };
    searchInput.addEventListener("input", run);
    document.querySelectorAll("[data-search-tag]").forEach((t) => {
      t.addEventListener("click", (e) => {
        e.preventDefault();
        searchInput.value = t.textContent.trim();
        run();
        searchInput.focus();
      });
    });
  }

  /* Language switch (demo only — preserves selection) */
  const lang = document.querySelector("[data-lang]");
  if (lang) {
    const stored = localStorage.getItem("exoseq.lang");
    if (stored) lang.value = stored;
    lang.addEventListener("change", () => {
      localStorage.setItem("exoseq.lang", lang.value);
      document.documentElement.setAttribute("lang", lang.value);
    });
  }

  /* Smooth focus for in-page anchors after scroll */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.setAttribute("tabindex", "-1");
          setTimeout(() => target.focus({ preventScroll: true }), 400);
        }
      }
    });
  });
})();
