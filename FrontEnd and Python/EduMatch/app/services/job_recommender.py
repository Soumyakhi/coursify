from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.db.mongo import student_collection
from app.config import MODEL_NAME
from app.schemas.job_schema import jobSchema


class JobStudentRecommender:

    def __init__(self):
        self.embedder = SentenceTransformer(MODEL_NAME)

    def build_job_text(self, job: jobSchema):

        position = job.position or ""
        description = job.description or ""
        skills = " ".join(job.skills or [])
        experience = job.experience or ""

        return f"""
        job role {position}.
        required skills {skills}.
        responsibilities {description}.
        experience required {experience}.
        """

    async def recommend_students(
            self,
            job: jobSchema,
            top_n: int
    ) -> list[str]:

        job_text = self.build_job_text(job)

        job_embedding = self.embedder.encode(
            job_text,
            normalize_embeddings=True
        ).reshape(1, -1)

        students = await student_collection.find().to_list(length=None)

        results = []

        required_skills = set(
            s.lower() for s in (job.skills or [])
        )

        for student in students:

            student_embedding = student.get("embedding")

            if not student_embedding:
                continue

            student_embedding = np.array(
                student_embedding
            ).reshape(1, -1)

            sim = cosine_similarity(
                job_embedding,
                student_embedding
            )[0][0]

            student_skills = set(
                s.lower() for s in student.get("skills", [])
            )

            overlap = len(
                required_skills.intersection(student_skills)
            )

            if required_skills:
                overlap_score = overlap / len(required_skills)
            else:
                overlap_score = 0

            experience_score = 0

            for c in student.get("enrolledCourses", []):

                rating = float(c.get("rating", 0))
                progress = float(c.get("percentageMarks", 0))
                complete = c.get("isComplete", False)

                score = (
                    0.5 * (rating / 5) +
                    0.3 * (progress / 100) +
                    (0.2 if complete else 0)
                )

                experience_score += score

            experience_score = min(experience_score / 5, 1)

            final_score = (
                0.6 * sim +
                0.25 * overlap_score +
                0.15 * experience_score
            )

            results.append({
                "student_id": str(student["_id"]),
                "score": float(final_score)
            })

        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return [
            r["student_id"]
            for r in results[:top_n]
        ]