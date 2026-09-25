"""Fill the shop with believable DUMMY products so you can see the site with content.

    python tools/make_dummy_products.py        -> 1500 products
    python tools/make_dummy_products.py 60     -> 60 products

Writes data/products.json. Your existing file is copied to data/products.backup.json
first (only the first time, so that backup is never overwritten).
To go back to your old products, copy the backup over data/products.json.

Everything is fake: names, prices. Each category gets its own icon picture
from images/icons/ (a placeholder look, not real photos — swap these for
Imran's real photos in products.json whenever they're ready).
Real products are never out of stock, so none of the dummy ones are either.
12 products get "featured": true for the home page.
"""
import json
import os
import random
import shutil
import sys

random.seed(7)  # same dummy catalog every time

TARGET = "data/products.json"
BACKUP = "data/products.backup.json"

# category: (kinds of product, price range in Rs, does it come in colors?, icon file)
CATEGORIES = {
    "Ballpoint Pen": (["Ballpoint Pen 0.7mm", "Gel Pen 0.5mm", "Ballpoint Pen Pack of 10"], (10, 90), True, "ballpoint-pen"),
    "Ink Pen": (["Ink Pen", "Fountain Pen", "Ink Pen with Cartridges"], (60, 450), True, "ink-pen"),
    "Marker Pen": (["Permanent Marker", "Marker Pen Set of 6", "Fine Tip Marker"], (40, 400), True, "marker-pen"),
    "Board Marker": (["Board Marker", "Board Marker Set of 4", "Refillable Board Marker"], (50, 380), True, "board-marker"),
    "Duster": (["Whiteboard Duster", "Felt Duster", "Magnetic Board Eraser"], (60, 250), False, "duster"),
    "Water Bottle": (["Water Bottle 750ml", "Steel Water Bottle", "Kids Water Bottle"], (350, 1900), True, "water-bottle"),
    "Notebook": (["A4 Ruled Notebook", "A5 Notebook", "Spiral Notebook 200 Pages"], (80, 650), False, "notebook"),
    "Pencil": (["HB Pencil Box of 12", "Color Pencils 24 Pack", "Mechanical Pencil 0.5mm"], (40, 500), True, "pencil"),
    "Eraser": (["Dust-Free Eraser", "Eraser Pack of 3", "Kneaded Eraser"], (10, 120), False, "eraser"),
    "Highlighter": (["Highlighter", "Highlighter Set of 5", "Dual Tip Highlighter"], (40, 350), True, "highlighter"),
    "Geometry Box": (["Geometry Box", "Compass Set", "Ruler 30cm"], (90, 700), False, "geometry-box"),
    "Stapler": (["Stapler", "Mini Stapler", "Heavy Duty Stapler"], (120, 1500), True, "stapler"),
    "File Cover": (["Plastic File Cover", "Box File", "Button Folder"], (25, 450), True, "file-cover"),
    "Glue": (["Glue Stick", "Liquid Glue", "Glue Stick Pack of 3"], (20, 200), False, "glue"),
    "Scissors": (["Scissors", "Craft Scissors", "Kids Safety Scissors"], (60, 400), True, "scissors"),
}
COLORS = [("Black", "#111111"), ("Blue", "#1d4ed8"), ("Red", "#dc2626"), ("Green", "#16a34a"),
          ("Purple", "#7c3aed"), ("Pink", "#ec4899"), ("Orange", "#f97316")]
STYLES = ["Classic", "Smooth", "Everyday", "Student", "Office", "Pocket", "Jumbo", "Slim", "Soft Grip", "Premium"]


def make_product(pid):
    category = random.choice(list(CATEGORIES))
    kinds, (low, high), has_colors, icon = CATEGORIES[category]
    image = f"images/icons/{icon}.svg"
    item = {
        "id": pid,
        "name": f"{random.choice(STYLES)} {random.choice(kinds)}",
        "price": random.randrange(low, high + 1, 5),
        "category": category,
        "image": image,
        "description": f"Dummy {category.lower()} for testing the shop layout.", "status": "discontinued" if random.random() < 0.1 else "active", "reviews": []
    }
    if has_colors and random.random() < 0.5:
        picks = random.sample(COLORS, random.randint(2, 6))
        item["variants"] = [{"color": n, "hex": h, "image": image} for n, h in picks]
    return item


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
    products = [make_product(i) for i in range(1, count + 1)]

    for p in random.sample(products, min(12, len(products))):
        p["featured"] = True

    os.makedirs("data", exist_ok=True)
    if os.path.exists(TARGET) and not os.path.exists(BACKUP):
        shutil.copy(TARGET, BACKUP)
        print(f"Backed up your old file to {BACKUP}")

    with open(TARGET, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=1)

    print(f"{len(products)} dummy products written to {TARGET} (12 are featured)")


if __name__ == "__main__":
    main()


