import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "carsFullDataset.json")


def load_cars():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def find_relevant_cars(query, cars):
    query = query.lower().strip()
    query_words = query.split()
    results = []

    for car in cars:
        searchable_text = " ".join(
            [
                str(car.get("company", "")),
                str(car.get("car_name", "")),
                str(car.get("slug", "")),
                str(car.get("engine", "")),
                str(car.get("fuel_type", "")),
                str(car.get("horsepower", "")),
                str(car.get("top_speed", "")),
                str(car.get("performance_0_100", "")),
                str(car.get("torque", "")),
                str(car.get("story", "")),
                str(car.get("design_notes", "")),
                " ".join(car.get("fun_facts", [])),
            ]
        ).lower()

        score = 0

        if query in searchable_text:
            score += 10

        for word in query_words:
            if word in searchable_text:
                score += 2

        if score > 0:
            results.append((score, car))

    results.sort(key=lambda x: x[0], reverse=True)
    return [car for _, car in results[:3]]


def get_car_by_slug(slug, cars):
    for car in cars:
        if car.get("slug") == slug:
            return car
    return None