# Imran's Stationery E-Commerce Website

Welcome to the source code for the Imran's Stationery website! This is a fast, simple static website built with pure HTML, CSS, and Vanilla JavaScript. It doesn't use any complicated frameworks (no React, no Next.js), which means it's incredibly easy to maintain and host for free on GitHub Pages.

## Managing Products

All products are stored in `data/products.json`. To add a new product or edit an existing one, simply open that file in a code editor and modify the JSON. 

- Never leave a trailing comma at the end of the list.
- Keep image paths relative (e.g., `"images/products/my-pen.webp"`).
- To feature a product on the home page, add `"featured": true` to its JSON entry.

## Caching & Cache-Busting

Web browsers aggressively cache files to speed up loading. When you update data/products.json or data/reviews.json, returning visitors might still see stale data.
To fix this, bump the version number in **two places**:
1. In `js/config.js` — change the `?v=` query strings inside `getProductsData()` and `getReviewsData()`.
2. In each HTML file (`index.html`, `products.html`, `contact.html`) — change the `?v=` on every `<script src="...?v=X">` and `<link href="...?v=X">` tag.

Keep both sets in sync (e.g. all `?v=7`).

## Product Status

In data/products.json, each product has a "status" field. 
- Set it to "active" for normal products.
- Set it to "discontinued" to hide the product from the catalog and search results. Do not delete discontinued products from the JSON file! Keeping them ensures that old links or QR codes don't break.

## Product Reviews

Reviews are managed manually via `data/reviews.json`.
- There is no customer-facing submission form or moderation UI.
- To add a new review, open `data/reviews.json` and add a new entry.
- Ensure the `productId` matches an existing numeric ID from `data/products.json` if you want the review to appear on a specific product's Quick View dialog. Reviews without a `productId` will just appear generally on the homepage.

## Image Optimization

HD photos load slowly if they are too large. For the best performance, it is recommended to resize product images to **1200px on their longest side** and save them in the **WebP** format.

We've provided a simple Python script to do this automatically in bulk!

**How to use it:**
1. Install Python on your computer.
2. Install the required image library by running: `pip install Pillow`
3. Put your large, original photos in a folder (e.g., `images/raw_photos/`).
4. Run the script from the terminal: 
   \`python tools/resize.py images/raw_photos/ images/products/\`

This will automatically resize all photos and save them as `.webp` in your products folder.

## Publishing to GitHub Pages

Since this is a static site, hosting it is 100% free with GitHub Pages.

1. Create a GitHub account and download GitHub Desktop (or use the terminal).
2. Commit your changes and push them to your GitHub repository.
3. On GitHub, go to your repository's **Settings** > **Pages**.
4. Under "Build and deployment", set the **Source** to "Deploy from a branch".
5. Select your `main` branch (and `/root` folder) and click **Save**.
6. Wait a couple of minutes, and GitHub will provide you with a live URL to your store!

## Updating Shop Details

If the shop's WhatsApp number, delivery fees, or address changes, you only need to update **one file**: `js/config.js`.

Open `js/config.js` and change the details there. They will automatically update across the header, footer, checkout cart, and contact pages.


