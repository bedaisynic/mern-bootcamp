"""Recommendations service, in Python.

Behind the gateway it looks exactly like the Node services: HTTP in, JSON
out. Python is the usual choice for data and machine-learning work.
"""

import json
import os
import random
import time
import urllib.request

from fastapi import FastAPI

CATALOG_URL = os.environ.get("CATALOG_URL", "http://localhost:4102")

app = FastAPI()


def burn_cpu(ms: int) -> float:
    """Stands in for scoring every product with a heavy model."""
    end = time.perf_counter() + ms / 1000
    x = 0.0
    while time.perf_counter() < end:
        x += (x + 1) ** 0.5
    return x


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/recommendations")
def recommendations(ms: int = 5000):
    # The same slow work as the monolith's version. Here it only ties up this
    # service's own CPU, so every other service keeps answering instantly.
    ms = min(ms, 30000)
    burn_cpu(ms)

    # A Python service calling a Node service: just HTTP and JSON.
    try:
        with urllib.request.urlopen(f"{CATALOG_URL}/products", timeout=3) as res:
            products = json.load(res)
    except OSError:
        # Graceful degradation: no catalog, no recommendations, but no error page.
        return {"tookMs": ms, "recommendations": [], "note": "catalog unreachable"}

    picks = random.sample(products, k=min(3, len(products)))
    return {
        "tookMs": ms,
        "servedBy": "recommendations (Python / FastAPI)",
        "recommendations": [{"sku": p["sku"], "name": p["name"], "price": p["price"]} for p in picks],
    }
