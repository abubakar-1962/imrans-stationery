/* products.js - shop page for a 1500+ product catalog.
   Search, sort, category filter, "Show more" paging, a hover button on each
   card (Bungu-style) and a quick-view dialog for choosing options.
   Out-of-stock products and colors are never shown. */

document.addEventListener("DOMContentLoaded", async function () {
  "use strict";

  var PAGE_SIZE   = 40;
  var PLACEHOLDER = "images/placeholder.svg";

  var grid    = document.getElementById("products-grid");
  var toolbar = document.getElementById("toolbar");
  var countEl = document.getElementById("product-count");
  if (!grid || !toolbar) return;

  var all = [], view = [], shown = 0;
  var state = { q: "", cat: "All", sort: "default" };
  var moreBtn, dlg, qv = { product: null, variant: null };

  // A category or search term can arrive via the URL, e.g. products.html?cat=Pens or ?q=notebook
  var params = new URLSearchParams(location.search);
  state.q   = params.get("q")   || "";
  state.cat = params.get("cat") || "All";

  // products.html?catalog=test loads the fake 1500-product file instead
  var testMode = params.get("catalog") === "test";

  if (countEl) countEl.textContent = "Loading productsâ€¦";

  try {
    var rawProducts = await window.getProductsData(testMode); all = rawProducts.map(prepare).filter(Boolean);
    buildToolbar();
    buildMoreButton();
    buildQuickView();
    refresh();
  } catch (err) {
    console.error("Products fetch error:", err);
    if (countEl) countEl.textContent = "Could not load products.";
    grid.innerHTML = "";
    var box = make("div", "error-state");
    box.appendChild(make("p", null, "Could not load the product catalog."));
    box.appendChild(make("small", null, err.message));
    var retry = make("button", "btn btn-primary", "Try again");
    retry.addEventListener("click", function () { location.reload(); });
    box.appendChild(retry);
    grid.appendChild(box);
  }

  /* ---------- helpers ---------- */

  function make(tag, cls, text, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // Out of stock = "inStock": false, or "stock": 0 in products.json.
  function available(x) {
    return x && x.inStock !== false && !(typeof x.stock === "number" && x.stock <= 0);
  }

  function prepare(p) {
    if (!available(p)) return null;
    var listed   = Array.isArray(p.variants) ? p.variants : [];
    var variants = listed.filter(available);
    if (listed.length && !variants.length) return null;   // every color sold out
    p.variants = variants;
    p.category = p.category || "General";
    
    // Extract variant colors so they can be searched
    var colorText = p.variants.map(function(v) { return v.color || ""; }).join(" ");
    p._text = ((p.name || "") + " " + p.category + " " + (p.description || "") + " " + colorText).toLowerCase();
    
    return p;
  }

  function priceOf(p)   { var n = Number(p.price); return n > 0 ? n : null; }
  function priceText(p) { var n = priceOf(p); return n ? "Rs. " + n.toLocaleString() : "Ask for price"; }

  function addItem(p, v, qty) {
    if (typeof window.cartAddItem !== "function") return;
    window.cartAddItem({
      id: p.id, name: p.name, price: p.price,
      image: (v && v.image) || p.image || PLACEHOLDER,
      color: v ? v.color : null, hex: v ? v.hex : null
    }, qty);
  }

  /* ---------- toolbar, filtering, paging ---------- */

  function buildToolbar() {
    var cats = Array.from(new Set(all.map(function (p) { return p.category; }))).sort();

    var search = make("input", null, null, { type: "search", placeholder: "Search products", "aria-label": "Search products" });
    var catSel = make("select", null, null, { "aria-label": "Category" });
    ["All"].concat(cats).forEach(function (c) {
      catSel.appendChild(make("option", null, c === "All" ? "All categories" : c, { value: c }));
    });
    var sortSel = make("select", null, null, { "aria-label": "Sort by" });
    [["default", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"], ["az", "Name: A to Z"]]
      .forEach(function (o) { sortSel.appendChild(make("option", null, o[1], { value: o[0] })); });

    // Pre-fill from URL params
    if (state.q) search.value = state.q;
    if (state.cat) catSel.value = state.cat;

    var timer;
    search.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = search.value.trim(); refresh(); }, 150);
    });
    catSel.addEventListener("change",  function () { state.cat  = catSel.value;  refresh(); });
    sortSel.addEventListener("change", function () { state.sort = sortSel.value; refresh(); });

    toolbar.className = "catalog-tools";
    toolbar.appendChild(search);
    toolbar.appendChild(catSel);
    toolbar.appendChild(sortSel);
  }

  function buildMoreButton() {
    moreBtn = make("button", "catalog-more", "Show more products", { type: "button" });
    moreBtn.addEventListener("click", showMore);
    grid.insertAdjacentElement("afterend", moreBtn);
  }

  function refresh() {
    var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    view = all.filter(function (p) { if (p.status === "discontinued") return false;
      return (state.cat === "All" || p.category === state.cat) &&
             words.every(function (w) { return p._text.indexOf(w) !== -1; });
    });

    if (state.sort === "az") {
      view.sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
    } else if (state.sort === "low" || state.sort === "high") {
      var dir = state.sort === "low" ? 1 : -1;
      view.sort(function (a, b) {
        var x = priceOf(a), y = priceOf(b);
        if (x === null || y === null) return (x === null) - (y === null);   // unpriced go last
        return (x - y) * dir;
      });
    }

    grid.innerHTML = "";
    shown = 0;
    if (!view.length) {
      grid.appendChild(make("p", "catalog-empty", "No products match your search. Try fewer words or another category."));
    }
    showMore();
  }

  function showMore() {
    var frag = document.createDocumentFragment();
    view.slice(shown, shown + PAGE_SIZE).forEach(function (p) { frag.appendChild(buildCard(p)); });
    grid.appendChild(frag);
    shown = Math.min(view.length, shown + PAGE_SIZE);
    if (countEl) countEl.textContent = shown.toLocaleString() + " of " + view.length.toLocaleString() + " products";
    moreBtn.hidden = shown >= view.length;
  }

  /* ---------- product card ---------- */

  function buildCard(p) {
    var hasColors = p.variants.length > 0;
    var card = make("article", "product-card");
    card.addEventListener("click", function () { openQuickView(p); });
    
    var wrap = make("div", "product-img-wrap");
    var img = make("img", null, null, {
      src: (hasColors && p.variants[0].image) || p.image || PLACEHOLDER,
      alt: p.name || "", loading: "lazy", decoding: "async", width: "400", height: "400"
    });
    img.addEventListener("error", function () { img.src = PLACEHOLDER; }, { once: true });
    wrap.appendChild(img);

    var info = make("div", "product-info");
    info.appendChild(make("h3", "product-name", p.name || "Unnamed product"));
    info.appendChild(make("p", "product-price", priceText(p)));
    if (p.variants.length > 1) info.appendChild(make("p", "card-meta", p.variants.length + " options"));

    var btn = make("button", "btn btn-outline card-btn", hasColors ? "Choose options" : "Add to cart", { type: "button" });
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (hasColors) { openQuickView(p); return; }
      addItem(p, null, 1);
      btn.textContent = "Added";
      setTimeout(function () { btn.textContent = "Add to cart"; }, 900);
    });
    info.appendChild(btn);

    card.appendChild(wrap);
    card.appendChild(info);
    return card;
  }

  /* ---------- quick view dialog ---------- */

  function buildQuickView() {
    dlg = make("dialog", "qv");
    dlg.innerHTML =
      '<button class="qv-close" type="button" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
      '<img class="qv-img" alt="" />' +
      '<div class="qv-body">' +
        '<h2 class="qv-name"></h2><p class="qv-price"></p><p class="qv-desc"></p>' +
        '<div class="swatches qv-swatches"></div>' +
        '<div class="qv-row">' +
          '<div class="card-qty-wrap">' +
            '<button type="button" class="qty-btn" data-d="-1" aria-label="Decrease quantity">&minus;</button>' +
            '<input class="card-qty-input" type="number" value="1" min="1" max="9999" aria-label="Quantity" />' +
            '<button type="button" class="qty-btn" data-d="1" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button type="button" class="qv-add">Add to cart</button>' +
          '</div>' +
          '<div class="qv-reviews" style="display:none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">' +
            '<h3>Customer Reviews</h3>' +
            '<div class="qv-reviews-header" style="margin-bottom: var(--sp-sm); font-size: 0.9rem;"></div>' +
            '<div class="qv-reviews-list"></div>' +
          '</div>' +
      '</div>';
    document.body.appendChild(dlg);

    var qtyInput = dlg.querySelector(".card-qty-input");
    dlg.querySelector(".qv-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelectorAll(".qty-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = (parseInt(qtyInput.value, 10) || 1) + Number(b.dataset.d);
        qtyInput.value = Math.max(1, Math.min(9999, n));
      });
    });
        dlg.querySelector(".qv-add").addEventListener("click", function () {
      var addBtn = this;
      var qty = Math.max(1, Math.min(9999, parseInt(qtyInput.value, 10) || 1));
      addItem(qv.product, qv.variant, qty);
      addBtn.textContent = "Added";
      setTimeout(function () { dlg.close(); addBtn.textContent = "Add to cart"; }, 700);
    });
  }

  function renderReviews(p) {
    var wrapper = dlg.querySelector(".qv-reviews");
    if (wrapper) wrapper.style.display = "none";
    var header = dlg.querySelector(".qv-reviews-header");
    var list = dlg.querySelector(".qv-reviews-list");
    
    if (typeof window.getReviewsData !== "function") {
      wrapper.style.display = "none";
      return;
    }
    
    window.getReviewsData().then(function(reviews) {
      var prodReviews = reviews.filter(function(r) { return r.productId === p.id || r.productId === String(p.id); });
      if (!prodReviews.length) {
        wrapper.style.display = "none";
        return;
      }
      
      wrapper.style.display = "block";
      var sum = 0;
      prodReviews.forEach(function(r) { sum += r.rating; });
      var avg = (sum / prodReviews.length).toFixed(1);
      
      header.innerHTML = "<strong>" + avg + " out of 5 stars</strong> (" + prodReviews.length + " review" + (prodReviews.length > 1 ? "s" : "") + ")";
      
      list.innerHTML = "";
      var toShow = prodReviews.slice(0, 3);
      toShow.forEach(function(r) {
        var stars = '&#9733;'.repeat(r.rating) + '&#9734;'.repeat(5 - r.rating);
        var d = document.createElement("div");
        d.className = "review-item";
        d.style.marginBottom = "var(--sp-md)";
        d.innerHTML = 
          "<div style='color:#fbbf24;font-size:1.1rem;'>" + stars + "</div>" +
          "<div><strong>" + (r.name || "Anonymous") + "</strong> <small style='color:var(--color-muted);margin-left:8px;'>" + new Date(r.date).toLocaleDateString() + "</small></div>" +
          "<p style='margin-top:4px;font-size:0.9rem;'>" + (r.text || "") + "</p>";
        list.appendChild(d);
      });
    }).catch(function(err) {
      wrapper.style.display = "none";
    });
  }


  
  function openQuickView(p) {
    var img       = dlg.querySelector(".qv-img");
    var swatches  = dlg.querySelector(".qv-swatches");
    var btns      = [];
    var label     = make("span", "selected-color-name");
    qv.product    = p;
    qv.variant    = p.variants[0] || null;

    dlg.querySelector(".qv-name").textContent  = p.name || "";
    dlg.querySelector(".qv-price").textContent = priceText(p);
    dlg.querySelector(".qv-desc").textContent  = p.description || "";
    dlg.querySelector(".card-qty-input").value = 1;
    dlg.querySelector(".qv-add").textContent   = "Add to cart";

    function pick(v) {
      qv.variant = v;
      img.src = (v && v.image) || p.image || PLACEHOLDER;
      img.alt = (p.name || "") + (v ? " - " + v.color : "");
      label.textContent = v ? v.color || "" : "";
      btns.forEach(function (b, i) { b.classList.toggle("selected", p.variants[i] === v); });
      var qtyInput = dlg.querySelector(".card-qty-input");
      if (qtyInput) qtyInput.value = 1;
    }

    swatches.innerHTML = "";
    p.variants.forEach(function (v) {
      var b = make("button", "swatch", null, { type: "button", title: v.color || "Option", "aria-label": v.color || "Option" });
      b.style.backgroundColor = v.hex || "#ccc";
      b.addEventListener("click", function () { pick(v); });
      btns.push(b);
      swatches.appendChild(b);
    });
    swatches.appendChild(label);
    swatches.style.display = p.variants.length ? "" : "none";

    pick(qv.variant);
    p.base_reviews = p.base_reviews || p.reviews || [];
    renderReviews(p);
    dlg.showModal();
  }
});












