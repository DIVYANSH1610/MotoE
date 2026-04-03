# cars/services/car_loader.py

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_FILE = BASE_DIR / "data" / "carsFullDataset.json"


def load_all_cars():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except Exception as e:
        print(f"[CAR LOADER ERROR] {e}")
        return []


def normalize_car(car):
    company = str(car.get("company", "")).strip()
    car_name = str(car.get("car_name", "")).strip()

    return {
        **car,
        "brand": company,
        "model": car_name,
        "generation": "",
    }


def get_car_by_slug(slug: str):
    cars = load_all_cars()
    for car in cars:
        if str(car.get("slug", "")).lower() == slug.lower():
            return normalize_car(car)
    return None


def get_all_cars():
    return [normalize_car(car) for car in load_all_cars()]