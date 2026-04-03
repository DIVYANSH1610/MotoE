from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services.llm_client import generate_response, generate_used_car_advice
from .services.scoring import calculate_used_car_scores


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def garage_assistant(request):
    question = request.data.get("question", "").strip()
    context_car_slug = request.data.get("context_car_slug", "").strip()

    if not question:
        return Response({"error": "Question is required."}, status=400)

    try:
        answer = generate_response(question, context_car_slug=context_car_slug)
        return Response({"answer": answer})
    except Exception as e:
        print("AI ERROR:", str(e))
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def used_car_advisor(request):
    data = request.data

    try:
        result = calculate_used_car_scores(data)
        analysis = generate_used_car_advice(data, result)

        return Response({
            **result,
            "analysis": analysis,
        })
    except Exception as e:
        print("USED CAR ADVISOR ERROR:", str(e))
        return Response({"error": str(e)}, status=500)