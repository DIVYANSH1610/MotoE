import re
import requests
from django.core.cache import cache

WIKIPEDIA_SEARCH_API = "https://en.wikipedia.org/w/api.php"
CACHE_TIMEOUT = 60 * 60 * 24 * 7  # 7 days

HEADERS = {
    "User-Agent": "AutoIntelGarage/1.0 (dev project)",
    "Accept": "application/json",
}


def fallback_response():
    return {
        "title": None,
        "sections": {
            "overview": "Detailed reading summary is not available right now.",
            "history": "",
            "performance": "",
            "extra": "",
        },
        "source_url": None,
        "thumbnail": None,
        "fetched": False,
    }


def build_search_queries(car):
    brand = str(car.get("brand", "")).strip()
    model = str(car.get("model", "")).strip()
    year = str(car.get("year", "")).strip()

    queries = []

    if brand and model:
        queries.append(f"{brand} {model}")

    if model:
        queries.append(model)

    if brand and model and year:
        queries.append(f"{brand} {model} {year}")

    final_queries = []
    seen = set()

    for query in queries:
        normalized = query.lower()
        if query and normalized not in seen:
            seen.add(normalized)
            final_queries.append(query)

    return final_queries


def search_wikipedia_page(query, brand="", model=""):
    try:
        response = requests.get(
            WIKIPEDIA_SEARCH_API,
            params={
                "action": "query",
                "list": "search",
                "srsearch": query,
                "format": "json",
                "utf8": 1,
                "srlimit": 10,
            },
            headers=HEADERS,
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        results = data.get("query", {}).get("search", [])
        if not results:
            print(f"[WIKI SEARCH] No results for query: {query}")
            return None

        brand_lower = brand.lower()
        model_lower = model.lower()

        best_title = None
        best_score = -1

        for item in results:
            title = item.get("title", "")
            title_lower = title.lower()
            score = 0

            if brand_lower and brand_lower in title_lower:
                score += 3
            if model_lower and model_lower in title_lower:
                score += 5

            if score > best_score:
                best_score = score
                best_title = title

        print(f"[WIKI SEARCH] Query: {query} -> Selected: {best_title}")
        return best_title or results[0].get("title")

    except requests.RequestException as e:
        print(f"[WIKI SEARCH ERROR] Query: {query} -> {e}")
        return None


def clean_sentence_end(text, max_length=1500):
    text = text.strip()
    if len(text) <= max_length:
        return text

    trimmed = text[:max_length]
    matches = list(re.finditer(r"[.!?]", trimmed))
    if matches:
        trimmed = trimmed[:matches[-1].end()]

    return trimmed.strip()


def split_into_sections(extract, car=None):
    sentences = re.split(r"(?<=[.!?])\s+", extract.strip())
    sentences = [s.strip() for s in sentences if s.strip()]

    overview = " ".join(sentences[:3]).strip()
    history = " ".join(sentences[3:7]).strip()
    extra = " ".join(sentences[7:10]).strip()

    performance = ""
    if car:
        car_name = car.get("car_name") or car.get("model") or "This car"
        horsepower = car.get("horsepower", "N/A")
        top_speed = car.get("top_speed", "N/A")
        torque = car.get("torque", "N/A")
        performance = (
            f"{car_name} delivers {horsepower}, reaches {top_speed}, "
            f"and produces {torque}, making it a strong performer in its segment."
        )

    return {
        "overview": overview or "Detailed reading summary is not available right now.",
        "history": history,
        "performance": performance,
        "extra": extra,
    }


def fetch_wikipedia_summary(title, car=None):
    try:
        response = requests.get(
            WIKIPEDIA_SEARCH_API,
            params={
                "action": "query",
                "prop": "extracts",
                "explaintext": True,
                "titles": title,
                "format": "json",
            },
            headers=HEADERS,
            timeout=10,
        )

        response.raise_for_status()
        data = response.json()

        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})

        extract = page.get("extract", "")
        if not extract:
            return fallback_response()

        extract = clean_sentence_end(extract, max_length=1500)
        sections = split_into_sections(extract, car)

        return {
            "title": title,
            "sections": sections,
            "source_url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}",
            "thumbnail": None,
            "fetched": True,
        }

    except Exception as e:
        print(f"[WIKI SUMMARY ERROR] Title: {title} -> {e}")
        return fallback_response()


def get_wikipedia_summary_for_car(car):
    slug = str(car.get("slug", "")).strip()

    if not slug:
        slug = f"{car.get('brand', '')}-{car.get('model', '')}".lower().replace(" ", "-")

    cache_key = f"wiki_summary_v3_{slug}"
    cached_data = cache.get(cache_key)

    if cached_data:
        return cached_data

    brand = str(car.get("brand", "")).strip()
    model = str(car.get("model", "")).strip()

    queries = build_search_queries(car)

    for query in queries:
        page_title = search_wikipedia_page(query=query, brand=brand, model=model)

        if page_title:
            summary_data = fetch_wikipedia_summary(page_title, car)
            cache.set(cache_key, summary_data, CACHE_TIMEOUT)
            return summary_data

    fallback = fallback_response()
    cache.set(cache_key, fallback, 60 * 10)
    return fallback