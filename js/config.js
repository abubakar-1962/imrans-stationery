// js/config.js - Single source of truth for shop contact details.
// Edit this file to update the number everywhere at once.

const SHOP = {
  // Shop Name
  name: "Imran's Stationery",
  
  // Courier Note
  courier: "Leopards Courier",

  // Delivery Configuration
  DELIVERY_FEE: 250,
  FREE_DELIVERY_THRESHOLD: 7000,

  // Payment Safety Note (shown in WhatsApp order message)
  PAYMENT_NOTE: "⚠️ Important: Please do not pay until we confirm your order and total in this chat. Only send payments to the JazzCash/Easypaisa account title and number we provide here. NEVER share your PIN or OTP with anyone.",

  // Used in wa.me links: country code + number, no + or spaces
  whatsapp: "923036360703",

  // Display format shown in the UI (footer, contact page)
  phoneDisplay: "+92 303 636 0703",

  // Local Pakistani format (used in tel: href and form placeholders)
  phoneLocal: "0303-6360703",

  // Shop landline
  shopPhone: "042-37654321",

  // Other contact details
  email: "imranstationery@gmail.com",
  address: "Shop No. 47, Urdu Bazaar, Near Chowk Urdu Bazaar, Lahore, Punjab 54000",
  hours: "Mon-Sat 9:00 AM - 8:00 PM  |  Sun 10:00 AM - 4:00 PM"
};

// Global shared fetch so multiple scripts don't download the product catalog twice
window.getProductsData = function(testMode) {
  var key = testMode ? "test" : "main";
  window._productsPromises = window._productsPromises || {};
  if (!window._productsPromises[key]) {
    var file = testMode ? "products.test.json" : "products.json";
    window._productsPromises[key] = fetch("./data/" + file + "?v=7").then(function(r) { return r.ok ? r.json() : Promise.reject(new Error(r.statusText)); });
  }
  return window._productsPromises[key];
};

// Fetch curated reviews (from data/reviews.json)
window.getReviewsData = function(testMode) {
  var key = testMode ? "test_reviews" : "main_reviews";
  window._reviewsPromises = window._reviewsPromises || {};
  if (!window._reviewsPromises[key]) {
    window._reviewsPromises[key] = fetch("./data/reviews.json?v=7").then(function(r) { return r.ok ? r.json() : []; });
  }
  return window._reviewsPromises[key];
};
