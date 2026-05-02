import asyncio
from app.db.mongo import student_collection, course_collection

from app.services.embedding import get_student_embedding
from app.services.course_embedding import get_course_embedding
async def update_courses():
    print("Updating course embeddings...")

    count = 0

    async for course in course_collection.find():
        emb = get_course_embedding(course)

        await course_collection.update_one(
            {"_id": course["_id"]},
            {"$set": {"embedding": emb}}
        )

        count += 1
        if count % 50 == 0:
            print(f"{count} courses updated...")

    print(f"Done. Total courses updated: {count}")


# -----------------------------
# REGENERATE STUDENT EMBEDDINGS
# -----------------------------
async def update_students():
    print("Updating student embeddings...")

    count = 0

    async for student in student_collection.find():
        emb = get_student_embedding(student)

        await student_collection.update_one(
            {"_id": student["_id"]},
            {"$set": {"embedding": emb}}
        )

        count += 1
        if count % 50 == 0:
            print(f"{count} students updated...")

    print(f"Done. Total students updated: {count}")


# -----------------------------
# MAIN
# -----------------------------
async def main():
    await update_courses()
    await update_students()


if __name__ == "__main__":
    asyncio.run(main())