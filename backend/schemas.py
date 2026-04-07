from pydantic import BaseModel, EmailStr
from typing import Optional


class BasicInfoCreate(BaseModel):
    name: str
    email: EmailStr
    mobile_number: Optional[str] = None
    current_college: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    profile_image: Optional[str] = None
    headline: Optional[str] = None
    about_text: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AcademicsCreate(BaseModel):
    school_10: str
    marks_10: float
    school_12: str
    marks_12: float
    current_college: str
    current_cgpa: float

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    name: str
    one_liner: str
    tech_stack: str
    description: str
    source: Optional[str] = None
    link: Optional[str] = None
    images: Optional[str] = None  # comma-separated image URLs

    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    company_name: str
    role: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: str

    class Config:
        from_attributes = True


class SkillCreate(BaseModel):
    application: str
    programming_language: str
    technologies: str

    class Config:
        from_attributes = True


class HobbyCreate(BaseModel):
    hobby_name: str

    class Config:
        from_attributes = True
