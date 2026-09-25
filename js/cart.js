/* cart.js â€” Shopping cart with color-variant support, localStorage-backed */

function loadCart() {
  try {
    var saved = localStorage.getItem("imran_cart");
    return saved ? JSON.parse(saved) : [];
  } catch (_) { return []; }
}

function saveCart(items) {
  try {
    localStorage.setItem("imran_cart", JSON.stringify(items));
  } catch (e) {
    console.error("Could not save cart", e);
  }
}

function cartKey(id, name, color) {
  return id + "|" + name + "|" + (color || "");
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

var cart = loadCart();

function addToCart(product, qty) {
  qty = Math.max(1, Math.min(9999, parseInt(qty, 10) || 1));
  var key = cartKey(product.id, product.name, product.color);
  var existing = cart.find(function (i) { return cartKey(i.id, i.name, i.color) === key; });

  if (existing) {
    existing.qty = Math.min(9999, existing.qty + qty);
  } else {
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      image: product.image,
      color: product.color || null,
      hex:   product.hex   || null,
      qty:   qty
    });
  }

  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}

function setQty(key, newQty) {
  newQty = Math.max(0, Math.min(9999, parseInt(newQty, 10) || 0));
  if (newQty < 1) { removeItem(key); return; }
  var item = cart.find(function (i) { return cartKey(i.id, i.name, i.color) === key; });
  if (item) { item.qty = newQty; saveCart(cart); updateCartBadge(); renderCartItems(); }
}

function removeItem(key) {
  cart = cart.filter(function (i) { return cartKey(i.id, i.name, i.color) !== key; });
  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}

function getCartTotal() {
  return cart.reduce(function (t, i) { 
    return t + ((i.price && i.price > 0) ? i.price * i.qty : 0); 
  }, 0);
}

function getCartCount() {
  return cart.reduce(function (t, i) { return t + i.qty; }, 0);
}

function updateCartBadge() {
  var badge = document.querySelector(".cart-badge");
  if (!badge) return;
  var count = getCartCount();
  badge.textContent = count > 99 ? "99+" : count;
  badge.classList.toggle("has-items", count > 0);
}

function renderCartItems() {
  var itemsList = document.getElementById("cart-items-list");
  var footer    = document.getElementById("cart-footer");
  if (!itemsList) return;

  if (cart.length === 0) {
    itemsList.innerHTML =
      '<div class="cart-empty">' +
        '<span class="cart-empty-icon">\uD83D\uDED2</span>' +
        '<p><strong>Your cart is empty</strong></p>' +
        '<p>Add products from the <a href="products.html" style="color:var(--color-primary)">Products page</a></p>' +
      '</div>';
    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "flex";

  itemsList.innerHTML = cart.map(function (item) {
    var key = cartKey(item.id, item.name, item.color);
    var safeKey = escapeHTML(key);
    var safeName = escapeHTML(item.name);
    var safeColor = escapeHTML(item.color);
    var safeImage = escapeHTML(item.image);
    var lineTotal = (item.price && item.price > 0) ? "Rs. " + (item.price * item.qty).toLocaleString() : "Ask for price";

    var colorHTML = "";
    if (item.color) {
      var dot = item.hex ? '<span class="cart-item-color-dot" style="background:' + escapeHTML(item.hex) + '"></span>' : "";
      colorHTML = '<span class="cart-item-color">' + dot + safeColor + '</span>';
    }

    return (
      '<div class="cart-item" data-key="' + safeKey + '">' +
        '<img class="cart-item-img" src="' + safeImage + '" alt="' + safeName + '" onerror="this.src=\'images/placeholder.svg\'" />' +
        '<div class="cart-item-details">' +
          '<span class="cart-item-name" title="' + safeName + '">' + safeName + '</span>' +
          colorHTML +
          '<span class="cart-item-price">' + lineTotal + '</span>' +
          '<div class="qty-controls">' +
            '<button class="qty-btn" data-action="dec" data-key="' + safeKey + '" aria-label="Decrease">\u2212</button>' +
            '<input class="qty-input" type="number" value="' + item.qty + '" min="1" max="9999" data-key="' + safeKey + '" aria-label="Quantity" />' +
            '<button class="qty-btn" data-action="inc" data-key="' + safeKey + '" aria-label="Increase">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" data-action="remove" data-key="' + safeKey + '" aria-label="Remove" title="Remove">&times;</button>' +
      '</div>'
    );
  }).join("");

  var subtotal = getCartTotal();
  var delivery = subtotal >= (SHOP.FREE_DELIVERY_THRESHOLD || 7000) ? 0 : (SHOP.DELIVERY_FEE || 250);
  var total = subtotal + delivery;

  var subtotalEl = document.getElementById("cart-subtotal-amount");
  if (subtotalEl) subtotalEl.textContent = "Rs. " + subtotal.toLocaleString();

  var deliveryEl = document.getElementById("cart-delivery-amount");
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? "Free" : "Rs. " + delivery.toLocaleString();

  var totalEl = document.getElementById("cart-total-amount");
  if (totalEl) totalEl.textContent = "Rs. " + total.toLocaleString();

  var courierNoteEl = document.getElementById("cart-courier-note");
  if (courierNoteEl && typeof SHOP !== "undefined" && SHOP.courier) {
    courierNoteEl.textContent = "Orders are dispatched via " + SHOP.courier + " at the end of the day.";
  }
}

function openCart() {
  var panel   = document.getElementById("cart-panel");
  var overlay = document.getElementById("cart-overlay");
  if (panel)   panel.classList.add("open");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  var closeBtn = document.getElementById("cart-close-btn");
  if (closeBtn) closeBtn.focus();
}

function closeCart() {
  var panel   = document.getElementById("cart-panel");
  var overlay = document.getElementById("cart-overlay");
  if (panel)   panel.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
  
  var checkoutBtn = document.getElementById("cart-checkout-btn");
  var checkoutForm = document.getElementById("checkout-form-container");
  if (checkoutBtn) checkoutBtn.style.display = "";
  if (checkoutForm) checkoutForm.style.display = "none";
}

function generateOrderID() {
  var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  var arr = new Uint8Array(4);
  window.crypto.getRandomValues(arr);
  var id = "";
  for (var i = 0; i < 4; i++) {
    id += chars[arr[i] % chars.length];
  }
  var date = new Date();
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var dd = String(date.getDate()).padStart(2, "0");
  return "IMS-" + mm + dd + "-" + id;
}

function sendToWhatsApp(cartItems, customer) {
  var orderId = sessionStorage.getItem("ims_order_id");
  if (!orderId) {
    orderId = generateOrderID();
    sessionStorage.setItem("ims_order_id", orderId);
  }

  var waNumber = (typeof SHOP !== "undefined") ? SHOP.whatsapp : "923036360703";
  var shopName = (typeof SHOP !== "undefined" && SHOP.name) ? SHOP.name : "Imran's Stationery";
  var courierName = (typeof SHOP !== "undefined" && SHOP.courier) ? SHOP.courier : "";

  var lines = cartItems.map(function (item, index) {
    var colorStr = item.color ? " (" + item.color + ")" : "";
    var priceStr = (item.price && item.price > 0) ? "" : " (Price to be confirmed)";
    return (index + 1) + ". " + item.name + colorStr + " \u00d7 " + item.qty + priceStr;
  }).join("\n");

  var subtotal = getCartTotal();
  var delivery = subtotal >= (SHOP.FREE_DELIVERY_THRESHOLD || 7000) ? 0 : (SHOP.DELIVERY_FEE || 250);
  var total = subtotal + delivery;

  var msg =
    "*New Order Request: " + orderId + "*\n" +
    "Name: " + customer.name + "\n" +
    "Phone: " + customer.phone + "\n" +
    "Address: " + customer.address + "\n" +
    "(Please share a Google Maps pin of this address in this chat)\n\n" +
    lines + "\n\n" +
    "Subtotal: Rs " + subtotal.toLocaleString() + "\n" +
    "Delivery: " + (delivery === 0 ? "Free" : "Rs " + delivery.toLocaleString()) + "\n" +
    "Estimated total: Rs " + total.toLocaleString() + "\n\n";

  if (courierName) {
    msg += "Orders are dispatched via " + courierName + " at the end of the day.\n\n";
  }
  
  if (SHOP.PAYMENT_NOTE) {
    msg += SHOP.PAYMENT_NOTE + "\n";
  }

  window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg), "_blank", "noopener,noreferrer");
  
  sessionStorage.removeItem("ims_order_id");
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
  renderCartItems();

    document.addEventListener("click", function (e) {
    if (e.target.closest("#cart-icon-btn")) openCart();
    else if (e.target.closest("#cart-close-btn") || e.target.id === "cart-overlay") closeCart();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCart();
  });
var itemsList = document.getElementById("cart-items-list");
  if (itemsList) {
    itemsList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var key    = btn.dataset.key;
      var action = btn.dataset.action;
      var item   = cart.find(function (i) { return cartKey(i.id, i.name, i.color) === key; });

      if (action === "inc" && item)  setQty(key, item.qty + 1);
      if (action === "dec" && item)  setQty(key, item.qty - 1);
      if (action === "remove")       removeItem(key);
    });

    itemsList.addEventListener("change", function (e) {
      var input = e.target.closest(".qty-input");
      if (!input) return;
      setQty(input.dataset.key, input.value);
    });
  }

  var checkoutBtn = document.getElementById("cart-checkout-btn");
  var checkoutForm = document.getElementById("checkout-form-container");
  var submitBtn = document.getElementById("co-submit-btn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      checkoutBtn.style.display = "none";
      if (checkoutForm) checkoutForm.style.display = "flex";
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      var name = document.getElementById("co-name").value.trim();
      var phone = document.getElementById("co-phone").value.trim();
      var address = document.getElementById("co-address").value.trim();
      var errorEl = document.getElementById("co-error");

      if (errorEl) errorEl.textContent = "";

      if (name.length < 2) {
        if (errorEl) errorEl.textContent = "Please enter a valid name.";
        return;
      }

      var normalizedPhone = phone.replace(/\D/g, "");
      if (normalizedPhone.startsWith("92")) {
        normalizedPhone = "0" + normalizedPhone.substring(2);
      } else if (normalizedPhone.startsWith("0092")) {
        normalizedPhone = "0" + normalizedPhone.substring(4);
      }
      
      if (!/^03\d{9}$/.test(normalizedPhone)) {
        if (errorEl) errorEl.textContent = "Please enter a valid Pakistani mobile number (e.g. 03XXXXXXXXX).";
        return;
      }

      if (address.length < 15) {
        if (errorEl) errorEl.textContent = "Please enter a complete delivery address (at least 15 characters).";
        return;
      }

      sendToWhatsApp(cart, { name: name, phone: normalizedPhone, address: address });
      var checkoutForm = document.getElementById("checkout-form-container");
      if (checkoutForm) {
        checkoutForm.innerHTML = "<div style='text-align:center; padding: 1rem 0; color: var(--color-text); font-weight: 600;'>Your order request is ready &mdash; check WhatsApp to send it.</div>";
      }
    });
  }

  window.cartAddItem = addToCart;
});







