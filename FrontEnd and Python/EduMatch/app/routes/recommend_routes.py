from fastapi import APIRouter, Depends, HTTPException, Request

from app.services.recommender import HybridCourseRecommender

router = APIRouter()


def get_recommender(request: Request) -> HybridCourseRecommender:
    instance = getattr(request.app.state, "recommender", None)

    if instance is None:
        raise HTTPException(
            status_code=503,
            detail="Recommender system is not available."
        )

    if instance.model is None:
        raise HTTPException(
            status_code=503,
            detail="Recommender system is still initializing. Please try again shortly."
        )

    return instance


@router.get("/recommend/{student_id}")
async def get_course_recommendations(
    student_id: str,
    recommender: HybridCourseRecommender = Depends(get_recommender)
):
    results = await recommender.recommend(student_id=student_id, top_n=6)
    return results