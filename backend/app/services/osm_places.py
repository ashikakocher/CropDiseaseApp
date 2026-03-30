import requests


def get_nearby_agro_stores(lat: float, lng: float):
    overpass_url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json][timeout:25];
    (
      node["shop"](around:5000,{lat},{lng});
      node["amenity"="marketplace"](around:5000,{lat},{lng});
      node["shop"="garden_centre"](around:5000,{lat},{lng});
      node["shop"="hardware"](around:5000,{lat},{lng});
      way["shop"](around:5000,{lat},{lng});
      way["amenity"="marketplace"](around:5000,{lat},{lng});
      way["shop"="garden_centre"](around:5000,{lat},{lng});
      way["shop"="hardware"](around:5000,{lat},{lng});
    );
    out center;
    """

    response = requests.get(
        overpass_url,
        params={"data": query},
        timeout=30,
        headers={"User-Agent": "CropGuard/1.0"}
    )

    response.raise_for_status()

    try:
        data = response.json()
    except Exception:
        return [
            {
                "name": "Store data unavailable",
                "address": "OpenStreetMap did not return valid data right now",
                "lat": lat,
                "lng": lng
            }
        ]

    stores = []
    keywords = ["agro", "fertilizer", "seed", "seeds", "pesticide", "krishi", "kisan"]

    for element in data.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name", "")

        if not name:
            continue

        if not any(keyword in name.lower() for keyword in keywords):
            continue

        if element.get("type") == "way":
            center = element.get("center", {})
            store_lat = center.get("lat")
            store_lng = center.get("lon")
        else:
            store_lat = element.get("lat")
            store_lng = element.get("lon")

        stores.append({
            "name": name,
            "address": tags.get("addr:street", "Address not available"),
            "lat": store_lat,
            "lng": store_lng
        })

    if not stores:
        return [
            {
                "name": "No nearby agro stores found",
                "address": "Try a different location or larger radius",
                "lat": lat,
                "lng": lng
            }
        ]

    return stores