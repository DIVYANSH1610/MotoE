from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services.llm_client import generate_response, generate_used_car_advice


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def garage_assistant(request):
    question = request.data.get("question", "").strip()
    context_car_slug = request.data.get("context_car_slug", "").strip()

    if not question:
        return Response(
            {"error": "Question is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        answer = generate_response(question, context_car_slug)
        return Response({"answer": answer}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def used_car_advisor(request):
    user_data = request.data.get("user_data", {})
    scoring_result = request.data.get("scoring_result", {})

    try:
        answer = generate_used_car_advice(user_data, scoring_result)
        return Response({"answer": answer}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
