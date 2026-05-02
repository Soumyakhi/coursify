from fastapi import APIRouter, HTTPException, Request
from typing import List
from app.schemas.student_schema import StudentSchema
from app.services.student_services import StudentService
from app.services.recommender import recommender_instance
from app.db.mongo import student_collection
router = APIRouter()

@router.post("/postStudents")
async def bulk_students(students: List[StudentSchema], request: Request):
    try:
        result = await StudentService.upsert_students(students)

        recommender = request.app.state.recommender
        if recommender:
            recommender.students = await student_collection.find().to_list(length=None)
            print("Recommender reloaded with new student data.")
        else:
            print("Recommender instance not available to refresh students.")


        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )