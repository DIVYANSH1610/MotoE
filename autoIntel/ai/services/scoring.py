from datetime import datetime


def clamp(value, minimum=0, maximum=10):
    return max(minimum, min(maximum, round(value, 1)))


def compute_age(year):
    current_year = datetime.now().year
    if not year:
        return None
    return max(0, current_year - int(year))


def score_age(year):
    age = compute_age(year)
    if age is None:
        return 5.0
    if age <= 2:
        return 9.0
    if age <= 4:
        return 8.2
    if age <= 6:
        return 7.4
    if age <= 8:
        return 6.5
    if age <= 10:
        return 5.6
    if age <= 12:
        return 4.8
    return 3.8


def score_mileage(km, year):
    if not km:
        return 6.0

    age = compute_age(year)
    if age is None or age <= 0:
        if km <= 20000:
            return 8.5
        if km <= 50000:
            return 7.0
        if km <= 80000:
            return 5.8
        return 4.5

    expected_km = age * 12000
    ratio = km / max(expected_km, 1)

    if ratio <= 0.7:
        return 9.0
    if ratio <= 1.0:
        return 8.0
    if ratio <= 1.25:
        return 6.8
    if ratio <= 1.5:
        return 5.6
    if ratio <= 2.0:
        return 4.2
    return 3.2


def score_owner_count(owner_count):
    owner_count = int(owner_count or 1)
    if owner_count == 1:
        return 9.0
    if owner_count == 2:
        return 7.0
    if owner_count == 3:
        return 5.2
    return 3.8


def score_service_history(service_history):
    text = (service_history or "").strip().lower()
    if not text:
        return 4.8
    if "complete" in text or "full" in text or "authorized" in text:
        return 8.8
    if "partial" in text or "some" in text:
        return 6.3
    return 5.8


def score_accident_history(accident_history):
    value = (accident_history or "unknown").strip().lower()
    if value == "none":
        return 9.0
    if value == "minor":
        return 6.0
    if value == "major":
        return 2.5
    return 4.5


def score_tyre_condition(tyre_condition):
    value = (tyre_condition or "good").strip().lower()
    if value == "new":
        return 9.0
    if value == "good":
        return 7.5
    if value == "worn":
        return 5.0
    if value == "needs replacement":
        return 2.8
    return 5.5


def score_insurance_status(insurance_status):
    value = (insurance_status or "expired").strip().lower()
    if value == "comprehensive":
        return 8.5
    if value == "third-party":
        return 6.0
    if value == "expired":
        return 3.5
    return 5.0


def score_price_value(asking_price, year, km, owner_count, accident_history):
    if not asking_price or asking_price <= 0:
        return 5.5

    age = compute_age(year)
    if age is None:
        age = 7

    base = 8.5
    base -= min(age * 0.35, 3.2)
    base -= min((km or 0) / 50000, 2.5) * 0.6
    base -= max(0, (owner_count or 1) - 1) * 0.6

    if (accident_history or "").lower() == "major":
        base -= 1.8
    elif (accident_history or "").lower() == "minor":
        base -= 0.7

    if asking_price >= 1500000:
        base -= 0.8
    elif asking_price >= 800000:
        base -= 0.4

    return clamp(base)


def estimate_fair_price_range(data, scores):
    asking_price = int(data.get("asking_price") or 0)

    if asking_price <= 0:
        return {"low": 0, "high": 0}, 0

    weighted_score = (
        scores["age_condition"] * 0.18
        + scores["mileage_health"] * 0.18
        + scores["ownership_history"] * 0.10
        + scores["service_history"] * 0.14
        + scores["accident_risk"] * 0.16
        + scores["tyre_condition"] * 0.08
        + scores["insurance_status"] * 0.06
        + scores["price_value"] * 0.10
    )

    if weighted_score >= 8.0:
        multiplier_low = 0.95
        multiplier_high = 1.05
        not_worth_above = asking_price * 1.08
    elif weighted_score >= 6.5:
        multiplier_low = 0.88
        multiplier_high = 0.98
        not_worth_above = asking_price * 1.00
    elif weighted_score >= 5.0:
        multiplier_low = 0.78
        multiplier_high = 0.90
        not_worth_above = asking_price * 0.92
    else:
        multiplier_low = 0.60
        multiplier_high = 0.78
        not_worth_above = asking_price * 0.82

    fair_range = {
        "low": int(round(asking_price * multiplier_low, -3)),
        "high": int(round(asking_price * multiplier_high, -3)),
    }
    not_worth_above = int(round(not_worth_above, -3))

    return fair_range, not_worth_above


def build_red_flags(data, scores):
    red_flags = []

    if int(data.get("owner_count") or 1) >= 3:
        red_flags.append("Higher owner count reduces resale confidence and often hints at inconsistent long-term care.")

    if (data.get("accident_history") or "").lower() == "major":
        red_flags.append("Major accident history is a serious structural and resale risk.")
    elif (data.get("accident_history") or "").lower() == "minor":
        red_flags.append("Minor accident history should be verified carefully for repair quality.")

    if int(data.get("kilometers_driven") or 0) >= 100000:
        red_flags.append("High mileage raises the chance of suspension, clutch, gearbox, and engine wear.")

    if (data.get("insurance_status") or "").lower() == "expired":
        red_flags.append("Expired insurance may indicate poor upkeep or delayed paperwork attention.")

    if (data.get("tyre_condition") or "").lower() == "needs replacement":
        red_flags.append("Tyres need immediate replacement, which adds direct post-purchase cost.")

    service_history = (data.get("service_history") or "").strip()
    if not service_history:
        red_flags.append("Missing or unclear service history reduces confidence in maintenance quality.")

    if not red_flags:
        red_flags.append("No major red flags from the submitted data, but physical inspection is still essential.")

    return red_flags


def build_inspection_checklist(data):
    checklist = [
        "Check engine idle quality, unusual sounds, smoke, and cold-start behavior.",
        "Inspect clutch, gearbox shifts, and test-drive response under load.",
        "Look for repaint mismatch, panel gaps, weld marks, and accident repair signs.",
        "Inspect suspension noise, steering alignment, and uneven tyre wear.",
        "Verify service records, insurance papers, RC details, and ownership transfer history.",
    ]

    if (data.get("fuel_type") or "").lower() == "diesel":
        checklist.append("Inspect turbo response, injector health, and diesel smoke levels.")

    if (data.get("transmission") or "").lower() in {"automatic", "cvt", "dct"}:
        checklist.append("Check transmission smoothness, hesitation, and service history for gearbox maintenance.")

    if (data.get("accident_history") or "").lower() in {"minor", "major"}:
        checklist.append("Get the underbody and structural members inspected by a trusted workshop.")

    return checklist


def build_recommendation(overall_score, red_flags):
    severe_flag = any(
        phrase in " ".join(red_flags).lower()
        for phrase in ["major accident", "structural", "serious"]
    )

    if severe_flag and overall_score < 6:
        return "avoid"

    if overall_score >= 8.0:
        return "buy"
    if overall_score >= 6.5:
        return "cautious-buy"
    if overall_score >= 5.0:
        return "negotiate-hard"
    return "avoid"


def score_used_car(data):
    scores = {
        "age_condition": score_age(data.get("year")),
        "mileage_health": score_mileage(
            int(data.get("kilometers_driven") or 0),
            data.get("year"),
        ),
        "ownership_history": score_owner_count(data.get("owner_count")),
        "service_history": score_service_history(data.get("service_history")),
        "accident_risk": score_accident_history(data.get("accident_history")),
        "tyre_condition": score_tyre_condition(data.get("tyre_condition")),
        "insurance_status": score_insurance_status(data.get("insurance_status")),
        "price_value": score_price_value(
            int(data.get("asking_price") or 0),
            data.get("year"),
            int(data.get("kilometers_driven") or 0),
            int(data.get("owner_count") or 1),
            data.get("accident_history"),
        ),
    }

    overall_score = clamp(
        (
            scores["age_condition"] * 0.16
            + scores["mileage_health"] * 0.18
            + scores["ownership_history"] * 0.10
            + scores["service_history"] * 0.15
            + scores["accident_risk"] * 0.18
            + scores["tyre_condition"] * 0.08
            + scores["insurance_status"] * 0.05
            + scores["price_value"] * 0.10
        )
    )

    red_flags = build_red_flags(data, scores)
    fair_price_range, not_worth_above = estimate_fair_price_range(data, scores)
    inspection_checklist = build_inspection_checklist(data)
    recommendation = build_recommendation(overall_score, red_flags)

    return {
        "recommendation": recommendation,
        "overall_score": overall_score,
        "scores": scores,
        "fair_price_range": fair_price_range,
        "not_worth_above": not_worth_above,
        "red_flags": red_flags,
        "inspection_checklist": inspection_checklist,
    }
