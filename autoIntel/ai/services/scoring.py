def clamp_score(value, minimum=0, maximum=10):
    return max(minimum, min(maximum, round(value, 1)))


def score_reliability(brand, fuel_type, transmission, service_history):
    brand = (brand or "").lower()
    fuel_type = (fuel_type or "").lower()
    transmission = (transmission or "").lower()
    service_history = (service_history or "").lower()

    score = 6.5

    highly_reliable = ["toyota", "honda", "suzuki", "lexus"]
    decent_reliable = ["hyundai", "kia", "mazda", "nissan"]

    if brand in highly_reliable:
        score += 2
    elif brand in decent_reliable:
        score += 1

    if "full" in service_history or "complete" in service_history or "well" in service_history:
        score += 1

    if fuel_type == "diesel":
        score -= 0.3

    if transmission in ["dct", "cvt"]:
        score -= 0.3

    return clamp_score(score)


def score_engine_reliability(brand, year, kilometers_driven):
    brand = (brand or "").lower()
    score = 6.5

    if brand in ["toyota", "honda", "lexus"]:
        score += 2
    elif brand in ["hyundai", "kia", "mazda"]:
        score += 1

    if year and year < 2012:
        score -= 0.5

    if kilometers_driven and kilometers_driven > 100000:
        score -= 1
    elif kilometers_driven and kilometers_driven > 70000:
        score -= 0.5

    return clamp_score(score)


def score_economy(fuel_type, kilometers_driven, car_type):
    fuel_type = (fuel_type or "").lower()
    car_type = (car_type or "").lower()

    score = 6

    if fuel_type in ["hybrid", "cng"]:
        score += 2
    elif fuel_type == "petrol":
        score += 1
    elif fuel_type == "electric":
        score += 1.5
    elif fuel_type == "diesel":
        score += 0.5

    if car_type in ["suv", "pickup"]:
        score -= 1
    elif car_type in ["hatchback", "sedan"]:
        score += 0.5

    if kilometers_driven and kilometers_driven > 120000:
        score -= 0.5

    return clamp_score(score)


def score_maintenance_burden(brand, transmission, fuel_type, service_history):
    brand = (brand or "").lower()
    transmission = (transmission or "").lower()
    fuel_type = (fuel_type or "").lower()
    service_history = (service_history or "").lower()

    score = 6.5

    premium_brands = ["bmw", "mercedes", "audi", "jaguar", "land rover", "porsche"]
    affordable_brands = ["maruti", "suzuki", "honda", "hyundai", "toyota", "kia"]

    if brand in premium_brands:
        score -= 2
    elif brand in affordable_brands:
        score += 1.5

    if transmission in ["dct", "cvt"]:
        score -= 0.5

    if fuel_type == "diesel":
        score -= 0.3

    if "full" in service_history or "complete" in service_history:
        score += 0.8

    return clamp_score(score)


def score_practicality(car_type, seats):
    car_type = (car_type or "").lower()
    seats = int(seats) if str(seats).isdigit() else 5

    score = 6

    if car_type in ["suv", "mpv"]:
        score += 2
    elif car_type in ["sedan", "hatchback"]:
        score += 1
    elif car_type in ["sports", "coupe", "convertible"]:
        score -= 1

    if seats >= 5:
        score += 1

    return clamp_score(score)


def score_used_car_risk(
    year,
    kilometers_driven,
    owner_count,
    accident_history,
    tyre_condition,
    insurance_status,
    service_history,
):
    score = 8.5

    if year and year < 2015:
        score -= 1

    if kilometers_driven and kilometers_driven > 120000:
        score -= 2
    elif kilometers_driven and kilometers_driven > 80000:
        score -= 1

    if owner_count and owner_count >= 3:
        score -= 2
    elif owner_count and owner_count == 2:
        score -= 0.8

    accident_history = (accident_history or "").lower()
    if accident_history == "major":
        score -= 3
    elif accident_history == "minor":
        score -= 1

    tyre_condition = (tyre_condition or "").lower()
    if tyre_condition in ["worn", "needs replacement"]:
        score -= 1

    insurance_status = (insurance_status or "").lower()
    if insurance_status == "expired":
        score -= 0.8

    service_history = (service_history or "").lower()
    if not service_history or "none" in service_history or "partial" in service_history:
        score -= 1.5

    return clamp_score(score)


def score_value_for_money(asking_price, estimated_low, estimated_high):
    if not asking_price:
        return 5.5

    if asking_price < estimated_low:
        return 9.0
    if estimated_low <= asking_price <= estimated_high:
        return 7.5
    if asking_price <= estimated_high * 1.1:
        return 5.8
    return 3.8


def score_enthusiast_appeal(car_type, brand, transmission, fuel_type):
    car_type = (car_type or "").lower()
    brand = (brand or "").lower()
    transmission = (transmission or "").lower()
    fuel_type = (fuel_type or "").lower()

    score = 5.5

    enthusiast_brands = ["bmw", "audi", "porsche", "ford", "subaru", "mazda", "toyota"]
    if brand in enthusiast_brands:
        score += 1

    if car_type in ["sports", "coupe", "sedan"]:
        score += 1

    if transmission == "manual":
        score += 1

    if fuel_type in ["petrol", "hybrid"]:
        score += 0.5

    return clamp_score(score)


def estimate_price_range(year, kilometers_driven, owner_count, accident_history, asking_price):
    if not asking_price:
        asking_price = 500000

    current_estimate = float(asking_price)

    if year:
        age_penalty_factor = max(0.55, 1 - ((2026 - year) * 0.04))
        current_estimate *= age_penalty_factor

    if kilometers_driven:
        if kilometers_driven > 120000:
            current_estimate *= 0.82
        elif kilometers_driven > 80000:
            current_estimate *= 0.9
        elif kilometers_driven < 40000:
            current_estimate *= 1.05

    if owner_count:
        if owner_count >= 3:
            current_estimate *= 0.88
        elif owner_count == 2:
            current_estimate *= 0.95

    accident_history = (accident_history or "").lower()
    if accident_history == "major":
        current_estimate *= 0.8
    elif accident_history == "minor":
        current_estimate *= 0.93

    low = round(current_estimate * 0.95)
    high = round(current_estimate * 1.08)
    not_worth_above = round(high * 1.05)

    return low, high, not_worth_above


def build_inspection_checklist(accident_history, tyre_condition, service_history, transmission):
    checklist = [
        "Check service history and invoices",
        "Inspect suspension, steering, and braking feel",
        "Scan for hidden warning lights or electrical faults",
        "Check engine bay for leaks and unusual noises",
        "Verify chassis number, insurance, and registration documents",
    ]

    if (accident_history or "").lower() in ["minor", "major"]:
        checklist.append("Inspect body panels, frame alignment, and repaint evidence")

    if (tyre_condition or "").lower() in ["worn", "needs replacement"]:
        checklist.append("Inspect tyre age, tread depth, and wheel alignment")

    if not service_history or "partial" in service_history.lower() or "none" in service_history.lower():
        checklist.append("Get a pre-purchase inspection from a trusted mechanic")

    if (transmission or "").lower() in ["automatic", "cvt", "dct"]:
        checklist.append("Check transmission smoothness, jerks, and delayed shifts")

    return checklist


def build_red_flags(accident_history, owner_count, service_history, tyre_condition, insurance_status):
    red_flags = []

    if (accident_history or "").lower() == "major":
        red_flags.append("Major accident history can reduce structural confidence and resale value")
    elif (accident_history or "").lower() == "minor":
        red_flags.append("Minor accident history should be checked carefully for repair quality")

    if owner_count and owner_count >= 3:
        red_flags.append("High owner count may indicate inconsistent upkeep or resale difficulty")

    if not service_history or "none" in service_history.lower() or "partial" in service_history.lower():
        red_flags.append("Incomplete service history increases ownership uncertainty")

    if (tyre_condition or "").lower() in ["worn", "needs replacement"]:
        red_flags.append("Tyres may need immediate replacement, adding near-term cost")

    if (insurance_status or "").lower() == "expired":
        red_flags.append("Expired insurance adds immediate paperwork and renewal cost")

    return red_flags


def calculate_used_car_scores(data):
    asking_price = data.get("asking_price") or 0
    year = data.get("year")
    kilometers_driven = data.get("kilometers_driven") or 0
    owner_count = data.get("owner_count") or 1

    low, high, not_worth_above = estimate_price_range(
        year=year,
        kilometers_driven=kilometers_driven,
        owner_count=owner_count,
        accident_history=data.get("accident_history"),
        asking_price=asking_price,
    )

    scores = {
        "reliability": score_reliability(
            data.get("brand"),
            data.get("fuel_type"),
            data.get("transmission"),
            data.get("service_history"),
        ),
        "engine_reliability": score_engine_reliability(
            data.get("brand"),
            year,
            kilometers_driven,
        ),
        "economy": score_economy(
            data.get("fuel_type"),
            kilometers_driven,
            data.get("car_type"),
        ),
        "maintenance_burden": score_maintenance_burden(
            data.get("brand"),
            data.get("transmission"),
            data.get("fuel_type"),
            data.get("service_history"),
        ),
        "practicality": score_practicality(
            data.get("car_type"),
            data.get("seats", 5),
        ),
        "used_car_risk": score_used_car_risk(
            year,
            kilometers_driven,
            owner_count,
            data.get("accident_history"),
            data.get("tyre_condition"),
            data.get("insurance_status"),
            data.get("service_history"),
        ),
        "value_for_money": score_value_for_money(
            asking_price,
            low,
            high,
        ),
        "enthusiast_appeal": score_enthusiast_appeal(
            data.get("car_type"),
            data.get("brand"),
            data.get("transmission"),
            data.get("fuel_type"),
        ),
    }

    overall_score = round(sum(scores.values()) / len(scores), 1)

    if overall_score >= 7.5:
        recommendation = "buy"
    elif overall_score >= 5.5:
        recommendation = "cautious"
    else:
        recommendation = "avoid"

    return {
        "recommendation": recommendation,
        "overall_score": overall_score,
        "scores": scores,
        "fair_price_range": {
            "low": low,
            "high": high,
        },
        "not_worth_above": not_worth_above,
        "inspection_checklist": build_inspection_checklist(
            data.get("accident_history"),
            data.get("tyre_condition"),
            data.get("service_history"),
            data.get("transmission"),
        ),
        "red_flags": build_red_flags(
            data.get("accident_history"),
            owner_count,
            data.get("service_history"),
            data.get("tyre_condition"),
            data.get("insurance_status"),
        ),
    }