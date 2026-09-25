/* main.js — shared across all pages: theme toggle, nav, active links */

(function () {
  "use strict";

  // --- Dark mode ---

  function getStoredTheme() { return localStorage.getItem("theme"); }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.innerHTML = theme === "dark"
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  // Apply immediately to avoid flash-of-wrong-theme
  applyTheme(getStoredTheme() || getSystemTheme());

  document.addEventListener("DOMContentLoaded", function () {

    // Theme toggle click
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("theme", next);
      });
    }

    // Mobile hamburger
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu   = document.querySelector(".nav-menu");
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen);
      });
      navMenu.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
          navMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Active nav link
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function (link) {
      if (link.getAttribute("href").split("/").pop() === currentPage) {
        link.classList.add("active");
      }
    });

    // Dynamic footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Populate dynamic elements from SHOP config
    if (typeof SHOP !== "undefined") {
      if (SHOP.name) {
        document.title = document.title.replace(/Imran's Stationery/g, SHOP.name);
        document.querySelectorAll(".nav-logo, .footer-brand, .footer-bottom p, meta[name='description']").forEach(function(el) {
          if (el.tagName === 'META') {
            el.content = el.content.replace(/Imran's Stationery/g, SHOP.name);
          } else {
            el.innerHTML = el.innerHTML.replace(/Imran's Stationery/g, SHOP.name);
          }
        });
      }

      // Floating WhatsApp button
      document.querySelectorAll(".whatsapp-float").forEach(function (el) {
        el.href = "https://wa.me/" + SHOP.whatsapp;
      });
      // Footer / contact phone links
      document.querySelectorAll("[data-phone]").forEach(function (el) {
        el.href = "tel:+" + SHOP.whatsapp;
        el.textContent = SHOP.phoneDisplay;
      });
      document.querySelectorAll("[data-phone-text]").forEach(function (el) {
        el.textContent = SHOP.phoneDisplay;
      });
    }
  });

  // Follow OS-level changes only when user hasn't chosen manually
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
  });

})();

