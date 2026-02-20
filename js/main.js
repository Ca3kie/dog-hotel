// Loving Homes - main JS
// Accessible mobile nav + FAQ accordion + basic form validation + small enhancements

// Page Loader: hide when fully loaded
(function () {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;

  const hide = () => {
    loader.classList.add("is-hidden");
    // optional: remove from DOM after transition
    setTimeout(() => loader.remove(), 350);
  };

  if (document.readyState === "complete") {
    hide();
  } else {
    window.addEventListener("load", hide, { once: true });
  }
})();

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const mobilePanel = $("#mobilePanel");

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", () => {
      const open = mobilePanel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        const firstLink = $("a", mobilePanel);
        firstLink && firstLink.focus();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobilePanel.classList.contains("open")) {
        mobilePanel.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  // FAQ accordion
  $$(".acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      // close others for neat UX
      $$(".acc-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
      $$(".acc-panel").forEach((p) => (p.style.display = "none"));

      if (!expanded && panel) {
        btn.setAttribute("aria-expanded", "true");
        panel.style.display = "block";
      }
    });
  });

  // Forms: basic client-side validation (demo; no backend)
  const forms = $$("form[data-validate='true']");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const okBox = form.querySelector(".alert.ok");
      const badBox = form.querySelector(".alert.bad");
      if (okBox) okBox.style.display = "none";
      if (badBox) badBox.style.display = "none";

      const required = $$("[data-required='true']", form);
      let valid = true;

      required.forEach((el) => {
        const value = (el.value || "").trim();
        const type = (el.getAttribute("type") || "").toLowerCase();

        // Reset styling
        el.style.borderColor = "rgba(255,255,255,.12)";

        if (!value) {
          valid = false;
          el.style.borderColor = "rgba(255,90,122,.55)";
          return;
        }

        // basic email
        if (type === "email") {
          const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!emailOk) {
            valid = false;
            el.style.borderColor = "rgba(255,90,122,.55)";
          }
        }
      });

      if (!valid) {
        if (badBox) {
          badBox.style.display = "block";
          badBox.textContent =
            "Please check the highlighted fields. Make sure required fields are filled correctly.";
        }
        return;
      }

      // success demo
      if (okBox) {
        okBox.style.display = "block";
        okBox.textContent =
          "Submitted successfully (demo). In a real project, this would be sent to your server/email system.";
      }

      form.reset();
    });
  });

  // Set aria-current automatically (matches filename)
  const path = window.location.pathname.split("/").pop() || "index.html";
  $$("a[data-nav]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(path)) a.setAttribute("aria-current", "page");
  });
})();