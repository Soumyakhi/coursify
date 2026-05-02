import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.services.recommender import HybridCourseRecommender
from app.routes.recommend_routes import router as recommend_router
from app.routes.course_route import router as course_router
from app.routes.student_routes import router as student_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("!!! STARTING INITIALIZATION !!!")

    instance = HybridCourseRecommender()

    try:
        await instance.initialize()
        app.state.recommender = instance  # store on app.state AFTER training is done
        print("!!! INITIALIZATION COMPLETE !!!")
    except Exception as e:
        app.state.recommender = None
        print(f"!!! INITIALIZATION FAILED: {e} !!!")

    yield

    app.state.recommender = None


app = FastAPI(lifespan=lifespan)

app.include_router(recommend_router)
app.include_router(course_router)
app.include_router(student_router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)