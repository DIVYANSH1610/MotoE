import os
from dotenv import load_dotenv
from google import genai
from .rag import load_cars, find_relevant_cars, get_car_by_slug

load_dotenv()

MODEL_NAME = "gemini-2.5-flash"


def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing.")
    return genai.Client(api_key=api_key)


def build_car_context(car):
    if not car:
        return ""

    return f"""
Selected Car Context:
Company: {car.get("company", "N/A")}
Car Name: {car.get("car_name", "N/A")}
Slug: {car.get("slug", "N/A")}
Engine: {car.get("engine", "N/A")}
CC/Battery Capacity: {car.get("cc_battery_capacity", "N/A")}
Horsepower: {car.get("horsepower", "N/A")}
Top Speed: {car.get("top_speed", "N/A")}
0-100: {car.get("performance_0_100", "N/A")}
Price: {car.get("price", "N/A")}
Fuel Type: {car.get("fuel_type", "N/A")}
Seats: {car.get("seats", "N/A")}
Torque: {car.get("torque", "N/A")}
Story: {car.get("story", "N/A")}
Design Notes: {car.get("design_notes", "N/A")}
Fun Facts: {", ".join(car.get("fun_facts", []))}
"""


def generate_response(prompt: str, context_car_slug: str = "") -> str:
    client = get_client()
    cars = load_cars()

    selected_car = get_car_by_slug(context_car_slug, cars) if context_car_slug else None
    relevant_cars = find_relevant_cars(prompt, cars)

    context_parts = []

    if selected_car:
        context_parts.append(build_car_context(selected_car))

    if relevant_cars:
        related_context = "\n\nRelated Car Data:\n"
        for car in relevant_cars:
            related_context += f"""
Company: {car.get("company", "N/A")}
Car Name: {car.get("car_name", "N/A")}
Slug: {car.get("slug", "N/A")}
Engine: {car.get("engine", "N/A")}
Horsepower: {car.get("horsepower", "N/A")}
Top Speed: {car.get("top_speed", "N/A")}
0-100: {car.get("performance_0_100", "N/A")}
Fuel Type: {car.get("fuel_type", "N/A")}
Torque: {car.get("torque", "N/A")}
Story: {car.get("story", "N/A")}
"""
        context_parts.append(related_context)

    context = "\n".join(context_parts).strip()

    if context:
        full_prompt = f"""
You are an expert automotive AI assistant for a premium car platform.

Use the provided car data when relevant.
If a selected car context is provided, prioritize answering with respect to that car.
If matching car data is available, prefer that over generic knowledge.
If something is not in the dataset, you may use general automotive knowledge.

IMPORTANT RESPONSE RULES:
- Write in clean markdown format
- Use short clear sections with headings
- Use bullet points where useful
- Keep the answer readable and premium
- Do not hallucinate exact specs if they are not provided

Preferred response structure:
## Overview
2-4 lines

## Key Highlights
- point
- point
- point

## Technical Insight
short paragraph or bullets

## Practical Take
short useful conclusion for the user

Context:
{context}

User Question:
{prompt}
"""
    else:
        full_prompt = f"""
You are an expert automotive AI assistant for a premium car platform.

No matching dataset entry was found.
Answer using general automotive knowledge.

IMPORTANT RESPONSE RULES:
- Write in clean markdown format
- Use short clear sections with headings
- Use bullet points where useful
- Keep the answer readable and premium
- Be accurate and practical

Preferred response structure:
## Overview
2-4 lines

## Key Highlights
- point
- point
- point

## Technical Insight
short paragraph or bullets

## Practical Take
short useful conclusion for the user

User Question:
{prompt}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=full_prompt,
    )

    return response.text or ""


def generate_used_car_advice(user_data: dict, scoring_result: dict) -> str:
    client = get_client()

    full_prompt = f"""
You are a premium used car buying advisor for the Indian market.

You must provide a practical, decisive evaluation based on the available data.
Do not ask for more data unless the input is almost empty.
If some data is limited, make cautious assumptions and clearly mention uncertainty.

You are given:
1. User-submitted vehicle details
2. Backend-generated scoring output

Your response must feel like a real pre-owned intelligence report.

Required response format:
## Verdict
A direct recommendation in 2-3 lines.

## Why This Verdict
Explain why the vehicle falls into this category.

## Price Guidance
Discuss the fair range, asking price comfort, and negotiation angle.

## Key Risks
Use bullet points.

## Inspection Priorities
Use bullet points.

## Final Advice
A practical closing recommendation with buyer confidence.

Important rules:
- Be decisive
- Be practical
- Use the scoring output as the backbone
- Do not respond by saying you need more data
- Do not invent exact numbers beyond the given scoring result
- Keep the tone premium, researched, and buyer-focused

User Data:
{user_data}

Scoring Result:
{scoring_result}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=full_prompt,
    )

    return response.text or ""
