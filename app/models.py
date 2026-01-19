from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class BasicInfo(Base):
    __tablename__ = "basic_info"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    email = Column(String(150), nullable=False, unique=True)
    mobile_number = Column(String(20), unique=True)

    linkedin = Column(String(255))
    github = Column(String(255))

    current_college = Column(String(150))
    profile_image = Column(String(500))
    headline = Column(String(255))
    about_text = Column(Text)
    description = Column(Text)



    projects = relationship("Project", back_populates="basic_info", cascade="all, delete")
    experiences = relationship("Experience", back_populates="basic_info", cascade="all, delete")
    skills = relationship("Skill", back_populates="basic_info", cascade="all, delete")
    hobbies = relationship("Hobby", back_populates="basic_info", cascade="all, delete")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    basic_info_id = Column(Integer, ForeignKey("basic_info.id"), nullable=False)

    name = Column(String(150))
    one_liner = Column(String(255))
    tech_stack = Column(String(255))
    description = Column(Text)
    source = Column(String(255))
    link = Column(String(255))
    images = Column(String(1000))  # comma-separated image URLs

    basic_info = relationship("BasicInfo", back_populates="projects")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    basic_info_id = Column(Integer, ForeignKey("basic_info.id"), nullable=False)

    company_name = Column(String(150))
    role = Column(String(100))
    start_date = Column(String(20))
    end_date = Column(String(20))
    description = Column(Text)

    basic_info = relationship("BasicInfo", back_populates="experiences")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    basic_info_id = Column(Integer, ForeignKey("basic_info.id"), nullable=False)

    application = Column(String(150))
    programming_language = Column(String(100))
    technologies = Column(String(255))

    basic_info = relationship("BasicInfo", back_populates="skills")


class Hobby(Base):
    __tablename__ = "hobbies"

    id = Column(Integer, primary_key=True, index=True)
    basic_info_id = Column(Integer, ForeignKey("basic_info.id"), nullable=False)

    hobby_name = Column(String(100))

    basic_info = relationship("BasicInfo", back_populates="hobbies")
