from pydantic import BaseModel,Field

class Reponse(BaseModel):
    candidate_name: str=Field(description='Name of the Person')
    email: str | None = Field(default=None,description='Email address of that person')
    degree: str=Field(description='degree completed by that person')
    college: str=Field(description='''from which college person's education was completed''')
    cgpa: float=Field(description='cgpa of that person')
    skills: list[str]=Field(description='list down all the skills mentioned by that person')
    project: list[str]=Field(description='list down all the projects mentioned by that person')
    exp: float | None = Field(default=None, description="Work experience in years, if explicitly supported by the resume")


class TargetRoleAssessment(BaseModel):
    job_role: str
    readiness_level: str = Field(
        description="Assessment such as Strong alignment, Partial alignment, or Significant gaps"
    )
    strengths: list[str]
    missing_or_unproven_skills: list[str]
    experience_gaps: list[str]
    recommendations: list[str]


class AlternativeJobRole(BaseModel):
    role: str
    reason: str
    relevant_existing_skills: list[str]
    skills_to_develop: list[str]


class SkillRecommendation(BaseModel):
    skill: str
    importance: str = Field(
        description="High, medium, or low"
    )
    reason: str


class RoadmapStep(BaseModel):
    phase: str
    topics_to_learn: list[str]
    practical_tasks: list[str]
    expected_outcome: str


class ResumeImprovement(BaseModel):
    section: str
    issue: str
    recommendation: str
    example: str | None = None


class ProjectRecommendation(BaseModel):
    project_name: str
    objective: str
    skills_demonstrated: list[str]
    key_features: list[str]


from pydantic import BaseModel, Field

class ResumeScore(BaseModel):
    overall_score: float = Field(
        ge=0,
        le=10,
        description="Overall resume quality score out of 10"
    )

    content_quality: float = Field(
        ge=0,
        le=10,
        description="Clarity and completeness of resume content"
    )

    project_quality: float = Field(
        ge=0,
        le=10,
        description="Specificity, technical depth, and evidence of project impact"
    )

    skills_presentation: float = Field(
        ge=0,
        le=10,
        description="How clearly and specifically relevant skills are presented"
    )

    achievement_evidence: float = Field(
        ge=0,
        le=10,
        description="Evidence of results, measurable outcomes, and achievements"
    )

    strengths: list[str] = Field(
        description="Strong aspects of the resume supported by the provided profile"
    )

    improvements: list[str] = Field(
        description="Specific changes that could improve resume quality"
    )




class CareerAnalysis(BaseModel):
    target_role_assessment: TargetRoleAssessment
    alternative_job_roles: list[AlternativeJobRole]
    additional_skills: list[SkillRecommendation]
    learning_roadmap: list[RoadmapStep]
    resume_improvements: list[ResumeImprovement]
    project_recommendations: list[ProjectRecommendation]
    resume_score: ResumeScore
