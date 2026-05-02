from fastapi import HTTPException

from fastapi import APIRouter
from typing import List

from fastapi import Request
from app.services.course_service import CourseService
from app.schemas.course_schema import CourseSchema
from app.services.recommender import recommender_instance

router = APIRouter()

@router.post("/postCourses")
async def bulk_courses(courses: List[CourseSchema], request: Request):
    try:
        result = await CourseService.upsert_courses(courses)

        recommender = request.app.state.recommender

        # 🔥 Refresh course data
        if recommender:
            await recommender.load_data()
            print("Recommender reloaded with new course data.")
        else:
            print("Recommender instance not available to refresh courses.")

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )