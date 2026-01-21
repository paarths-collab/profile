from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import os

from app.database import SessionLocal, engine, Base
from app.models import *
from app.schemas import *

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Profile")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend - use absolute path relative to this file for robust deployment
from pathlib import Path

# Build paths relative to the project root (parent of 'app' folder)
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

print(f"[STARTUP] Base directory: {BASE_DIR}")
print(f"[STARTUP] Frontend directory: {FRONTEND_DIR}")
print(f"[STARTUP] Frontend exists: {FRONTEND_DIR.exists()}")
if FRONTEND_DIR.exists():
    print(f"[STARTUP] Files in frontend: {list(FRONTEND_DIR.iterdir())}")
    images_dir = FRONTEND_DIR / "images"
    if images_dir.exists():
        print(f"[STARTUP] Images in frontend/images: {list(images_dir.iterdir())}")

# Mount static files
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

@app.get("/")
def serve_frontend():
    """Serve the frontend index.html"""
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"error": "Frontend not found", "frontend_dir": str(FRONTEND_DIR), "exists": FRONTEND_DIR.exists()}

@app.get("/admin")
def serve_admin():
    """Serve the admin panel"""
    admin_path = FRONTEND_DIR / "admin.html"
    if admin_path.exists():
        return FileResponse(str(admin_path))
    return {"error": "Admin page not found"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Config
SECRET_KEY = "supersecretkey" # Should be env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 360 # 6 hours for ease

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Helper function to get basic_info by email or mobile
def get_basic_info_by_identifier(db: Session, email: Optional[str] = None, mobile: Optional[str] = None):
    """Get BasicInfo by email or mobile_number"""
    if email:
        return db.query(BasicInfo).filter(BasicInfo.email == email).first()
    elif mobile:
        return db.query(BasicInfo).filter(BasicInfo.mobile_number == mobile).first()
    return None

@app.get("/health")
def health():
    return {"status": "ok"}

# -------- BASIC INFO --------
@app.post("/basic-info")
def create_basic_info(data: BasicInfoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Enforce email match
    if data.email != current_user.email:
        raise HTTPException(status_code=403, detail="You can only create/update profile for your own email")

    # Check if user exists by email
    existing_user = db.query(BasicInfo).filter(BasicInfo.email == data.email).first()
    
    if existing_user:
        # Update existing user
        for key, value in data.dict().items():
            setattr(existing_user, key, value)
        db.commit()
        db.refresh(existing_user)
        return existing_user
        
    # Check mobile uniqueness if provided and it's a new user (or changing mobile)
    if data.mobile_number:
        mobile_exists = db.query(BasicInfo).filter(BasicInfo.mobile_number == data.mobile_number).first()
        if mobile_exists and (not existing_user or mobile_exists.id != existing_user.id):
             raise HTTPException(status_code=400, detail="Mobile number already exists")

    info = BasicInfo(**data.dict())
    db.add(info)
    db.commit()
    db.refresh(info)
    return info

@app.get("/basic-info")
def get_basic_info(
    email: Optional[str] = Query(None, description="Email to lookup"),
    mobile: Optional[str] = Query(None, description="Mobile number to lookup"),
    db: Session = Depends(get_db)
):
    if email or mobile:
        info = get_basic_info_by_identifier(db, email=email, mobile=mobile)
        if not info:
            raise HTTPException(status_code=404, detail="User not found")
        return info
    return db.query(BasicInfo).first()

# -------- ACADEMICS --------
# -------- AUTHENTICATION --------
@app.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(password)
    new_user = User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# -------- PROJECTS --------
@app.post("/projects")
def add_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    info = get_basic_info_by_identifier(db, email=current_user.email)
    if not info:
        raise HTTPException(status_code=404, detail="Create Basic Info first")
    
    project = Project(basic_info_id=info.id, **data.dict())
    db.add(project)
    db.commit()
    return project

@app.get("/projects")
def get_projects(
    email: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    info = get_basic_info_by_identifier(db, email=email, mobile=mobile)
    if not info:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Project).filter_by(basic_info_id=info.id).all()

# -------- EXPERIENCES --------
@app.post("/experiences")
def add_experience(
    data: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    info = get_basic_info_by_identifier(db, email=current_user.email)
    if not info:
        raise HTTPException(status_code=404, detail="Create Basic Info first")
    
    exp = Experience(basic_info_id=info.id, **data.dict())
    db.add(exp)
    db.commit()
    return exp

@app.get("/experiences")
def get_experiences(
    email: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    info = get_basic_info_by_identifier(db, email=email, mobile=mobile)
    if not info:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Experience).filter_by(basic_info_id=info.id).all()

# -------- SKILLS --------
@app.post("/skills")
def add_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    info = get_basic_info_by_identifier(db, email=current_user.email)
    if not info:
        raise HTTPException(status_code=404, detail="Create Basic Info first")
    
    skill = Skill(basic_info_id=info.id, **data.dict())
    db.add(skill)
    db.commit()
    return skill

@app.get("/skills")
def get_skills(
    email: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    info = get_basic_info_by_identifier(db, email=email, mobile=mobile)
    if not info:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Skill).filter_by(basic_info_id=info.id).all()

# -------- HOBBIES --------
@app.post("/hobbies")
def add_hobby(
    data: HobbyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    info = get_basic_info_by_identifier(db, email=current_user.email)
    if not info:
        raise HTTPException(status_code=404, detail="Create Basic Info first")
    
    hobby = Hobby(basic_info_id=info.id, **data.dict())
    db.add(hobby)
    db.commit()
    return hobby

@app.get("/hobbies")
def get_hobbies(
    email: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    info = get_basic_info_by_identifier(db, email=email, mobile=mobile)
    if not info:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Hobby).filter_by(basic_info_id=info.id).all()

# -------- DELETION ENDPOINTS --------

@app.delete("/projects/{id}")
def delete_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Project).filter(Project.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    db.delete(item)
    db.commit()
    return {"message": "Project deleted"}

@app.delete("/experiences/{id}")
def delete_experience(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Experience).filter(Experience.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(item)
    db.commit()
    return {"message": "Experience deleted"}

@app.delete("/skills/{id}")
def delete_skill(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Skill).filter(Skill.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(item)
    db.commit()
    return {"message": "Skill deleted"}

@app.delete("/hobbies/{id}")
def delete_hobby(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Hobby).filter(Hobby.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Hobby not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(item)
    db.commit()
    return {"message": "Hobby deleted"}

# -------- UPDATE ENDPOINTS --------

@app.put("/projects/{id}")
def update_project(id: int, data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Project).filter(Project.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.dict().items():
        setattr(item, key, value)
    db.commit()
    return item

@app.put("/experiences/{id}")
def update_experience(id: int, data: ExperienceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Experience).filter(Experience.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.dict().items():
        setattr(item, key, value)
    db.commit()
    return item

@app.put("/skills/{id}")
def update_skill(id: int, data: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Skill).filter(Skill.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.dict().items():
        setattr(item, key, value)
    db.commit()
    return item

@app.put("/hobbies/{id}")
def update_hobby(id: int, data: HobbyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Hobby).filter(Hobby.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Hobby not found")
    if item.basic_info.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.dict().items():
        setattr(item, key, value)
    db.commit()
    return item
