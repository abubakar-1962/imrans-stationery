"""Make a fake 1500-product catalog to test the shop page.

Run it from the project folder:
    python tools/make_test_catalog.py
Then open  products.html?catalog=test  in your browser.
Your real data/products.json is never touched.
"""
import json
import os
import random

random.seed(1)  # same fake catalog every time

CATEGORIES = ["Marker Pen", "Ink Pen", "Ballpoint", "Board Marker", "Duster", "Water Bottle",
              "Notebook", "Geometry Box", "Pencil", "Eraser", "Highlighter", "Stapler", "File Cover"]
COLORS = [("Black", "#111111"), ("Blue", "#1d4ed8"), ("Red", "#dc2626"),
          ("Green", "#16a34a"), ("Purple", "#7c3aed")]

products = []
for i in range(1, 1501):
    category = random.choice(CATEGORIES)
    item = {
        "id": i,
        "name": f"{category} Sample {i}",
        "price": random.randint(3, 120) * 10,
        "category": category,
        "image": "images/placeholder.svg",
        "description": f"Placeholder {category.lower()} used for testing.",
    }
    if random.random() < 0.35:            # about a third come in colors
        item["variants"] = [
            {"color": name, "hex": hex_code, "image": "images/placeholder.svg"}
            for name, hex_code in random.sample(COLORS, random.randint(2, 5))
        ]
    if random.random() < 0.10:            # about 10% are out of stock: the shop must hide these
        item["inStock"] = False
    products.append(item)

os.makedirs("data", exist_ok=True)
with open("data/products.test.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False)

hidden = sum(1 for p in products if p.get("inStock") is False)
print(f"{len(products)} products written to data/products.test.json ({hidden} out of stock, should not appear)")
