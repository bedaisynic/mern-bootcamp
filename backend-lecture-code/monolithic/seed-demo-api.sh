#!/usr/bin/env bash
# Seed a small, realistic dataset into the DEPLOYED app through its public API.
# Uses the real endpoints (products -> inventory -> orders), so it exercises the
# same validation + inventory-locking transaction the lecture demonstrates.
#
# Usage:
#   ./seed-demo-api.sh                 # auto-detects API url from terraform output
#   ./seed-demo-api.sh http://host:3100
set -euo pipefail

# --- figure out the API base URL -------------------------------------------
API="${1:-}"
if [[ -z "$API" ]]; then
  API="$(terraform -chdir="$(dirname "$0")/infra" output -raw api_url)"
fi
echo "Seeding against: $API"

post() { # post <path> <json>
  curl -s --max-time 20 -X POST "$API$1" -H 'content-type: application/json' -d "$2"
}

# --- a handful of products --------------------------------------------------
# sku|name|priceCents|stock
CATALOG=(
  "KB-MECH-01|Mechanical Keyboard|8999|120"
  "MOUSE-ERG-02|Ergonomic Mouse|4599|200"
  "MON-27-4K|27-inch 4K Monitor|32900|40"
  "USB-C-HUB|USB-C 7-in-1 Hub|3499|150"
  "WEBCAM-1080|1080p Webcam|5999|80"
  "HEADSET-NC|Noise-Cancelling Headset|12900|60"
  "SSD-1TB|1TB NVMe SSD|9900|100"
  "CHAIR-ERG|Ergonomic Office Chair|24900|25"
  "DESK-STAND|Standing Desk Converter|18900|30"
  "LAMP-LED|LED Desk Lamp|2999|175"
)

echo ""
echo "=== creating products + inventory ==="
declare -a PRODUCT_IDS=()
for row in "${CATALOG[@]}"; do
  IFS='|' read -r sku name price stock <<< "$row"

  prod=$(post /products "{\"sku\":\"$sku\",\"name\":\"$name\",\"priceCents\":$price}")
  pid=$(printf '%s' "$prod" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("id",""))' 2>/dev/null || true)

  if [[ -z "$pid" ]]; then
    echo "  ! skipped $sku (maybe already exists): $prod"
    continue
  fi

  post "/inventory" "{\"productId\":$pid,\"quantity\":$stock}" > /dev/null
  echo "  + product $pid  $sku  ($stock in stock)"
  PRODUCT_IDS+=("$pid")
done

# --- a few orders (leaves plenty of stock for live demos) -------------------
echo ""
echo "=== placing a few sample orders ==="
place_order() { # place_order <productId> <qty> <customerId>
  local out; out=$(post /orders "{\"productId\":$1,\"quantity\":$2,\"customerId\":$3}")
  echo "  order: product $1 x$2 (customer $3) -> $out"
}
if (( ${#PRODUCT_IDS[@]} >= 3 )); then
  place_order "${PRODUCT_IDS[0]}" 3 1001
  place_order "${PRODUCT_IDS[1]}" 1 1002
  place_order "${PRODUCT_IDS[2]}" 2 1001
fi

echo ""
echo "=== done. current counts ==="
echo "products:  $(curl -s "$API/products"  | python3 -c 'import sys,json; print(len(json.load(sys.stdin)))')"
echo "inventory: $(curl -s "$API/inventory" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(len(d if isinstance(d,list) else d.get("items",[])))')"
echo "orders:    $(curl -s "$API/orders"    | python3 -c 'import sys,json; print(len(json.load(sys.stdin)))')"
