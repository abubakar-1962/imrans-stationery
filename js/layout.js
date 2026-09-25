/* layout.js - Injects shared header, footer, and cart panel HTML across all pages */

document.addEventListener("DOMContentLoaded", function () {
  const headerHTML = `
    <div class="announcement-bar">
      <div class="container">
        Notice: Free delivery on orders over Rs. 7,000. Nationwide shipping available.
      </div>
    </div>
    
    <header class="site-header">
      <div class="container">
        <div class="header-main">
          <a href="index.html" class="nav-logo" aria-label="Imran's Stationery Home">
            Imran's Stationery
          </a>
          
          <div class="header-search">
            <form action="products.html" method="GET" class="search-form">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" name="q" placeholder="Search for stationery..." aria-label="Search">
            </form>
          </div>

          <div class="header-icons">
            <button id="theme-toggle" class="icon-btn" aria-label="Switch theme">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <button id="design-toggle" class="icon-btn" aria-label="Switch design style" title="Toggle Modern/Vintage Design">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
            </button>
            <button id="cart-icon-btn" class="icon-btn" aria-label="Open shopping cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cart-badge" aria-live="polite"></span>
            </button>
            <button class="nav-toggle mobile-only" aria-expanded="false" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <nav class="header-nav">
          <ul class="nav-menu" id="dynamic-header-nav">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="products.html" class="nav-link">All Products</a></li>
            <li><a href="contact.html" class="nav-link">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  const waNum = (typeof SHOP !== "undefined" && SHOP.whatsapp) ? SHOP.whatsapp : "923036360703";

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3 class="footer-brand">Imran's Stationery</h3>
            <p>Curated stationery and daily goods for students, artists, and professionals.</p>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <ul id="dynamic-footer-nav">
              <li><a href="products.html">All Products</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Visit Us</h4>
            <address>
              Shop No. 47, Urdu Bazaar<br>
              Near Chowk Urdu Bazaar<br>
              Lahore, Punjab 54000
            </address>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Imran's Stationery. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <a href="https://wa.me/${waNum}" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
    </a>
  `;

  const cartHTML = `
    <div id="cart-overlay" class="cart-overlay" aria-hidden="true"></div>
    <aside id="cart-panel" class="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div class="cart-panel-header">
        <h2>Your Cart</h2>
        <button id="cart-close-btn" class="cart-close-btn" aria-label="Close cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div id="cart-items-list" class="cart-items-list"></div>
      <div id="cart-footer" class="cart-footer" style="display:none;">
        <div class="cart-total-row">
          <span class="cart-total-label">Subtotal</span>
          <span id="cart-subtotal-amount" class="cart-total-amount">Rs. 0</span>
        </div>
        <div class="cart-total-row">
          <span class="cart-total-label">Delivery</span>
          <span id="cart-delivery-amount" class="cart-total-amount">Rs. 0</span>
        </div>
        <div class="cart-total-row cart-grand-total">
          <span class="cart-total-label">Total</span>
          <span id="cart-total-amount" class="cart-total-amount">Rs. 0</span>
        </div>
        <p id="cart-courier-note" class="cart-courier-note"></p>
        <button id="cart-checkout-btn" class="btn btn-primary btn-block">Checkout via WhatsApp</button>
        
        <div id="checkout-form-container" style="display:none; flex-direction:column; gap:0.75rem; margin-top:1rem;">
          <div class="form-group">
            <label for="co-name">Full Name *</label>
            <input type="text" id="co-name" placeholder="Your Name" />
          </div>
          <div class="form-group">
            <label for="co-phone">WhatsApp Number *</label>
            <input type="text" id="co-phone" placeholder="03XXXXXXXXX" />
          </div>
          <div class="form-group">
            <label for="co-address">Delivery Address *</label>
            <textarea id="co-address" placeholder="Full address" rows="2"></textarea>
          </div>
          <div id="co-error" class="form-error"></div>
          <button id="co-submit-btn" class="btn btn-primary btn-block">Send Order Request</button>
        </div>
      </div>
    </aside>
  `;

  const headerContainer = document.getElementById("layout-header");
  const footerContainer = document.getElementById("layout-footer");
  const cartContainer   = document.getElementById("layout-cart");

  if (headerContainer) headerContainer.innerHTML = headerHTML;
  if (footerContainer) footerContainer.innerHTML = footerHTML;
  if (cartContainer)   cartContainer.innerHTML   = cartHTML;

  // Setup Theme (Dark/Light) Toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const isDark = localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) document.documentElement.setAttribute("data-theme", "dark");
    
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Setup Design (Vintage/Modern) Switcher
  const designToggle = document.getElementById("design-toggle");
  if (designToggle) {
    const savedDesign = localStorage.getItem("design") || "vintage";
    document.documentElement.setAttribute("data-design", savedDesign);

    designToggle.addEventListener("click", () => {
      const currentDesign = document.documentElement.getAttribute("data-design");
      const nextDesign = currentDesign === "modern" ? "vintage" : "modern";
      document.documentElement.setAttribute("data-design", nextDesign);
      localStorage.setItem("design", nextDesign);
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".header-nav");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      navMenu.classList.toggle("open");
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q");
  if (q) {
    const searchInput = document.querySelector('.search-form input[name="q"]');
    if (searchInput) searchInput.value = q;
  }

  if (typeof window.getProductsData === "function") {
    window.getProductsData()
      .then(products => {
        const activeProducts = products.filter(p => p.status !== "discontinued" && p.category);
        const cats = Array.from(new Set(activeProducts.map(p => p.category))).sort();
        
        const headerNav = document.getElementById("dynamic-header-nav");
        if (headerNav) {
          let links = "";
          cats.slice(0, 5).forEach(c => { 
            links += `<li><a href="products.html?cat=${encodeURIComponent(c)}" class="nav-link">${c}</a></li>`; 
          });
          const contactLi = headerNav.lastElementChild;
          if (contactLi) contactLi.insertAdjacentHTML('beforebegin', links);
        }
        
        const footerNav = document.getElementById("dynamic-footer-nav");
        if (footerNav) {
          let links = "";
          cats.slice(0, 3).forEach(c => { 
            links += `<li><a href="products.html?cat=${encodeURIComponent(c)}">${c}</a></li>`; 
          });
          footerNav.insertAdjacentHTML('beforeend', links);
        }
      })
      .catch(e => console.error("Failed to load categories for nav", e));
  }
});
