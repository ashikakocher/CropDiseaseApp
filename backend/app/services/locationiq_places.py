import requests
from app.config import LOCATIONIQ_API_KEY


def get_nearby_agro_stores(lat: float, lng: float):
    url = "https://us1.locationiq.com/v1/nearby.php"

    params = {
        "key": LOCATIONIQ_API_KEY,
        "lat": lat,
        "lon": lng,
        "tag": "shop:*",
        "radius": 5000,
        "format": "json"
    }

    response = requests.get(
        url,
        params=params,
        timeout=20,
        headers={"User-Agent": "CropGuard/1.0"}
    )
    response.raise_for_status()

    try:
        data = response.json()
    except Exception:
        return {
            "agro_stores": [],
            "nearby_stores": [],
            "message": "Store data unavailable"
        }

    if not isinstance(data, list):
        return {
            "agro_stores": [],
            "nearby_stores": [],
            "message": "Unexpected response from LocationIQ"
        }

    keywords = [
        "agro", "fertilizer", "seed", "seeds",
        "pesticide", "krishi", "kisan",
        "farm", "nursery", "agriculture"
    ]

    agro_stores = []
    nearby_stores = []

    for place in data:
        display_name = place.get("display_name", "")
        name = place.get("name") or display_name.split(",")[0]

        store = {
            "name": name,
            "address": display_name,
            "lat": float(place.get("lat")) if place.get("lat") else lat,
            "lng": float(place.get("lon")) if place.get("lon") else lng
        }

        if store not in nearby_stores:
            nearby_stores.append(store)

        text_to_check = f"{name} {display_name}".lower()

        if any(keyword in text_to_check for keyword in keywords):
            if store not in agro_stores:
                agro_stores.append(store)

    return {
        "agro_stores": agro_stores,
        "nearby_stores": nearby_stores[:5],
        "message": "success"
    }