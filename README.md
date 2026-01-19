# Profile Portfolio

A personal portfolio website with admin panel and authentication.

## Features
- 🎨 Modern dark-themed portfolio design
- 🔐 JWT-based authentication for admin access
- 📝 Admin panel to manage: Projects, Experience, Skills
- 🐳 Docker and Docker Compose support
- 🚀 Deployment-ready

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Auth**: JWT, bcrypt

## Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8001
```

## Docker
```bash
docker-compose up --build
```

## Deployment
Deploy to Render with a Neon PostgreSQL database.
