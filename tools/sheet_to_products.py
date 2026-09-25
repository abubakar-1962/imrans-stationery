"""Turn a Google Sheet of products into data/products.json.

How to use:
1. In Google Sheets: File -> Download -> Comma Separated Values (.csv)
2. Save it as products.csv in your project folder (same folder as data/, tools/)
3. Run: python tools/sheet_to_products.py products.csv

Your sheet needs these column headers (exact spelling, any order):
    name          (required)
    price         (required — just the number, no "Rs.")
    category      (required)
    image         (optional — a path like images/products/pen.webp; left blank -> placeholder)
    description   (optional)

A row with an empty name is skipped (so a blank row at the end of your sheet is fine).
Existing data/products.json is backed up to data/products.backup.json first,
same as the dummy-data script, so you can never lose data by running this.
"""
import csv
import json
import os
import shutil
import sys

TARGET = "data/products.json"
BACKUP = "data/products.backup.json"
PLACEHOLDER = "images/placeholder.svg"
REQUIRED = ["name", "price", "category"]


def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/sheet_to_products.py your_sheet.csv")
        sys.exit(1)

    csv_path = sys.argv[1]
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        sys.exit(1)

    with open(csv_path, newline="", encoding="utf-8-sig") as f:  # utf-8-sig handles Excel/Sheets BOM
        reader = csv.DictReader(f)
        headers = [h.strip().lower() for h in (reader.fieldnames or [])]
        missing = [c for c in REQUIRED if c not in headers]
        if missing:
            print(f"Your CSV is missing required column(s): {', '.join(missing)}")
            print(f"Found columns: {', '.join(headers)}")
            sys.exit(1)

        products = []
        skipped = 0
        for i, row in enumerate(reader, start=2):  # start=2: row 1 is the header
            row = {k.strip().lower(): (v or "").strip() for k, v in row.items()}
            name = row.get("name", "")
            if not name:
                continue

            price_raw = row.get("price", "")
            try:
                price = int(float(price_raw)) if price_raw else None
            except ValueError:
                print(f"Row {i}: price '{price_raw}' isn't a number, leaving it blank (shows as 'Ask for price')")
                price = None
                skipped += 1

            category = row.get("category", "") or "General"
            image = row.get("image", "") or PLACEHOLDER
            description = row.get("description", "")

            products.append({
                "id": len(products) + 1,
                "name": name,
                "price": price,
                "category": category,
                "image": image,
                "description": description,
            })

    if not products:
        print("No products found in the CSV — check the file has data below the header row.")
        sys.exit(1)

    os.makedirs("data", exist_ok=True)
    if os.path.exists(TARGET):
        shutil.copy(TARGET, BACKUP)
        print(f"Backed up your current file to {BACKUP}")

    with open(TARGET, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=1)

    print(f"Wrote {len(products)} products to {TARGET}")
    if skipped:
        print(f"{skipped} row(s) had a problem with their price — check the messages above")
    print("Note: this v1 doesn't read color variants from the sheet. If you add those later, tell me and I'll extend this script.")


if __name__ == "__main__":
    main()
