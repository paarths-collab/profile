<div align="center">

# Profile Portfolio

### Full-Stack Dynamic Portfolio Management System

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A production-ready, full-stack portfolio platform featuring secure authentication, RESTful API architecture, and a modern responsive interface. Built with industry-standard technologies and best practices.

[View Demo](#production-deployment) · [Documentation](#api-reference) · [Report Issue](https://github.com/yourusername/profile-portfolio/issues)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Design](#database-design)
6. [API Reference](#api-reference)
7. [Authentication & Security](#authentication--security)
8. [Project Structure](#project-structure)
9. [Getting Started](#getting-started)
10. [Docker Deployment](#docker-deployment)
11. [Configuration](#configuration)
12. [Production Deployment](#production-deployment)
13. [Technical Highlights](#technical-highlights)
14. [Performance Optimizations](#performance-optimizations)
15. [Contributing](#contributing)
16. [License](#license)

---

## Overview

This project represents a **comprehensive portfolio management system** engineered to address the limitations of static portfolio websites. It provides a robust backend infrastructure enabling users to dynamically manage their professional profiles, projects, work experiences, and technical skills through a secure administrative interface.

### Problem Statement & Solution

| Challenge | Solution Implemented |
|-----------|---------------------|
| Static content requires code changes | Dynamic content management via RESTful API |
| No content management capability | Intuitive admin panel for CRUD operations |
| Security vulnerabilities | JWT-based stateless authentication |
| Single-tenant architecture | Multi-user support with data isolation |
| Data persistence limitations | PostgreSQL with normalized relational schema |
| Deployment complexity | Docker containerization with orchestration |

---

## Key Features

### Authentication & Authorization
- JWT (JSON Web Token) based stateless authentication
- bcrypt password hashing with automatic salting
- OAuth2 password flow implementation (RFC 6749)
- Configurable token expiration (TTL: 6 hours default)
- Protected endpoints utilizing FastAPI dependency injection
- Role-based access control with owner validation

### Dynamic Content Management
- **Projects**: Full CRUD operations with tech stack, descriptions, source links, and live demos
- **Experience**: Professional timeline with company details, role, and tenure
- **Skills**: Categorized technical competencies with technologies and tools
- **Hobbies**: Personal interests for profile personalization
- **Profile Management**: Comprehensive user profile with social integration

### Frontend Architecture
- Responsive dark-themed design with CSS custom properties
- Animated skills marquee with performance optimization
- Technology icons served via SimpleIcons CDN
- Touch-friendly carousels using Swiper.js

### DevOps & Infrastructure
- Multi-container Docker architecture
- Health checks ensuring service readiness
- Docker Compose for container orchestration
- Production-optimized Dockerfile with slim base image
- Environment-based configuration management

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌───────────────┐
                                    │   Frontend    │
                                    │  (HTML/CSS/JS)│
                                    └───────┬───────┘
                                            │
                                            │ HTTP Requests
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                FASTAPI APPLICATION                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐                   │
│   │   CORS      │    │  Static      │    │  OAuth2         │                   │
│   │  Middleware │    │  Files       │    │  Bearer Auth    │                   │
│   └──────┬──────┘    └──────┬───────┘    └────────┬────────┘                   │
│          │                  │                      │                            │
│          └──────────────────┼──────────────────────┘                            │
│                             ▼                                                    │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         API ROUTES                                       │   │
│   ├─────────────┬─────────────┬────────────┬────────────┬──────────────────┤   │
│   │  /token     │ /basic-info │ /projects  │/experiences│ /skills /hobbies │   │
│   │  /register  │   (CRUD)    │   (CRUD)   │   (CRUD)   │     (CRUD)       │   │
│   └──────┬──────┴──────┬──────┴─────┬──────┴─────┬──────┴────────┬─────────┘   │
│          │             │            │            │               │              │
│          └─────────────┴────────────┼────────────┴───────────────┘              │
│                                     ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      DEPENDENCY INJECTION                                │   │
│   │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────────┐    │   │
│   │  │ get_db()    │  │ get_current_user │  │ get_basic_info_by_id    │    │   │
│   │  │ DB Session  │  │ JWT Validation   │  │ User Data Resolution    │    │   │
│   │  └──────┬──────┘  └────────┬─────────┘  └─────────────┬────────────┘    │   │
│   └─────────┼──────────────────┼──────────────────────────┼─────────────────┘   │
│             │                  │                          │                      │
└─────────────┼──────────────────┼──────────────────────────┼──────────────────────┘
              │                  │                          │
              ▼                  ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SQLAlchemy ORM Layer                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Models: User │ BasicInfo │ Project │ Experience │ Skill │ Hobby       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   PostgreSQL 15     │
                              │   ┌─────────────┐   │
                              │   │   Tables    │   │
                              │   │  - users    │   │
                              │   │  - basic_info│  │
                              │   │  - projects │   │
                              │   │  - experiences│ │
                              │   │  - skills   │   │
                              │   │  - hobbies  │   │
                              │   └─────────────┘   │
                              └─────────────────────┘
```

---

## Technology Stack

### Backend Technologies

| Technology | Purpose | Justification |
|------------|---------|------------|
| **FastAPI** | Web Framework | High performance async framework with automatic OpenAPI docs, type hints, and dependency injection |
| **SQLAlchemy** | ORM | Industry-standard Python ORM with relationship mapping and query building |
| **PostgreSQL** | Database | ACID-compliant, reliable RDBMS with excellent performance for complex queries |
| **Pydantic** | Validation | Data validation using Python type annotations, seamless FastAPI integration |
| **python-jose** | JWT | Secure JWT token encoding/decoding with cryptographic signing |
| **passlib[bcrypt]** | Password Hashing | Industry-standard password hashing with automatic salting |
| **Uvicorn** | ASGI Server | High-performance ASGI server suitable for production workloads |

### Frontend Technologies

| Technology | Purpose | Justification |
|------------|---------|------------|
| **Vanilla JS** | Interactivity | No framework overhead, fast load times, full control |
| **CSS3** | Styling | Custom properties (variables), flexbox, grid, animations |
| **SimpleIcons** | Tech Icons | CDN-based SVG icons for 40+ technologies |
| **Swiper.js** | Carousels | Touch-friendly, responsive image sliders |
| **Google Fonts** | Typography | Inter font family for modern, clean aesthetics |

### Infrastructure & DevOps

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Docker** | Containerization | Ensures environment consistency across development and production |
| **Docker Compose** | Orchestration | Manages multi-container deployments with dependency resolution |
| **PostgreSQL 15** | Database Container | Official image with built-in health check support |

---

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA (PostgreSQL)                         │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │        users         │
    ├──────────────────────┤
    │ PK id (INTEGER)      │
    │    email (VARCHAR)   │◄─────┐
    │    hashed_password   │      │ Authentication
    └──────────────────────┘      │
                                  │
    ┌──────────────────────┐      │
    │     basic_info       │      │
    ├──────────────────────┤      │
    │ PK id (INTEGER)      │      │ Same email links
    │    name (VARCHAR)    │      │ user to profile
    │    email (VARCHAR) ──┼──────┘
    │    mobile_number     │
    │    linkedin          │
    │    github            │
    │    current_college   │
    │    profile_image     │
    │    headline          │
    │    about_text        │
    │    description       │
    └──────────┬───────────┘
               │
               │ One-to-Many Relationships
               │
    ┌──────────┴──────────┬────────────────┬────────────────┐
    │                     │                │                │
    ▼                     ▼                ▼                ▼
┌────────────┐    ┌─────────────┐   ┌──────────┐    ┌──────────┐
│  projects  │    │ experiences │   │  skills  │    │ hobbies  │
├────────────┤    ├─────────────┤   ├──────────┤    ├──────────┤
│PK id       │    │PK id        │   │PK id     │    │PK id     │
│FK basic_   │    │FK basic_    │   │FK basic_ │    │FK basic_ │
│   info_id  │    │   info_id   │   │   info_id│    │   info_id│
│   name     │    │  company_   │   │ applica- │    │ hobby_   │
│   one_liner│    │  name       │   │ tion     │    │ name     │
│   tech_    │    │  role       │   │ program- │    └──────────┘
│   stack    │    │  start_date │   │ ming_lang│
│   descrip- │    │  end_date   │   │ technolo-│
│   tion     │    │  description│   │ gies     │
│   source   │    └─────────────┘   └──────────┘
│   link     │
│   images   │
└────────────┘
```

### Database Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| `User` ↔ `BasicInfo` | Implicit (email) | User authentication linked to profile via email |
| `BasicInfo` → `Projects` | One-to-Many | Each profile can have multiple projects |
| `BasicInfo` → `Experiences` | One-to-Many | Each profile can have multiple experiences |
| `BasicInfo` → `Skills` | One-to-Many | Each profile can have multiple skill entries |
| `BasicInfo` → `Hobbies` | One-to-Many | Each profile can have multiple hobbies |

### Key Database Features

- **Cascade Deletes**: Deleting a BasicInfo automatically removes all related projects, experiences, skills, and hobbies
- **Unique Constraints**: Email and mobile number are unique across users
- **Indexed Fields**: Primary keys and email fields are indexed for fast lookups
- **Relationship Back-populates**: Bidirectional ORM relationships enabling efficient data traversal

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user | ❌ |
| `POST` | `/token` | Login and get JWT token | ❌ |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/basic-info` | Get profile by email/mobile | ❌ |
| `POST` | `/basic-info` | Create/Update profile | ✅ |
| `GET` | `/projects` | Get all projects | ❌ |
| `POST` | `/projects` | Add new project | ✅ |
| `PUT` | `/projects/{id}` | Update project | ✅ |
| `DELETE` | `/projects/{id}` | Delete project | ✅ |
| `GET` | `/experiences` | Get all experiences | ❌ |
| `POST` | `/experiences` | Add new experience | ✅ |
| `PUT` | `/experiences/{id}` | Update experience | ✅ |
| `DELETE` | `/experiences/{id}` | Delete experience | ✅ |
| `GET` | `/skills` | Get all skills | ❌ |
| `POST` | `/skills` | Add new skill | ✅ |
| `PUT` | `/skills/{id}` | Update skill | ✅ |
| `DELETE` | `/skills/{id}` | Delete skill | ✅ |
| `GET` | `/hobbies` | Get all hobbies | ❌ |
| `POST` | `/hobbies` | Add new hobby | ✅ |
| `DELETE` | `/hobbies/{id}` | Delete hobby | ✅ |

### API Request/Response Examples

<details>
<summary><b>User Registration</b></summary>

```bash
POST /register?email=user@example.com&password=securepass123
```

Response:
```json
{
  "message": "User created successfully"
}
```
</details>

<details>
<summary><b>Login & Get Token</b></summary>

```bash
POST /token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepass123
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
</details>

<details>
<summary><b>Create Project (Protected)</b></summary>

```bash
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Portfolio API",
  "one_liner": "Full-stack portfolio management system",
  "tech_stack": "FastAPI, PostgreSQL, Docker",
  "description": "A comprehensive portfolio system...",
  "source": "https://github.com/user/portfolio",
  "link": "https://portfolio.example.com"
}
```
</details>

---

## Authentication & Security

### JWT Authentication Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                             │
└───────────────────────────────────────────────────────────────────┘

    ┌─────────┐                              ┌─────────────┐
    │  User   │                              │   FastAPI   │
    └────┬────┘                              └──────┬──────┘
         │                                          │
         │  1. POST /token                          │
         │     {username, password}                 │
         │─────────────────────────────────────────►│
         │                                          │
         │                            ┌─────────────┴─────────────┐
         │                            │ 2. Verify password        │
         │                            │    bcrypt.verify()        │
         │                            │                           │
         │                            │ 3. Generate JWT           │
         │                            │    - sub: user.email      │
         │                            │    - exp: now + 6hrs      │
         │                            │    - Sign with SECRET_KEY │
         │                            └─────────────┬─────────────┘
         │                                          │
         │  4. {access_token, token_type}           │
         │◄─────────────────────────────────────────│
         │                                          │
         │  5. POST /projects                       │
         │     Authorization: Bearer <token>        │
         │─────────────────────────────────────────►│
         │                                          │
         │                            ┌─────────────┴─────────────┐
         │                            │ 6. Decode & Verify JWT    │
         │                            │    - Check signature      │
         │                            │    - Check expiration     │
         │                            │    - Extract user email   │
         │                            │                           │
         │                            │ 7. Query user from DB     │
         │                            │                           │
         │                            │ 8. Execute endpoint       │
         │                            └─────────────┬─────────────┘
         │                                          │
         │  9. Response data                        │
         │◄─────────────────────────────────────────│
         │                                          │
```

### Security Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Password Hashing** | bcrypt with auto-salt | Prevents rainbow table attacks |
| **JWT Tokens** | HS256 algorithm | Stateless authentication |
| **Token Expiration** | 6-hour TTL | Limits exposure window |
| **Owner Validation** | Email matching on CRUD | Users can only modify their own data |
| **CORS Middleware** | Configurable origins | Prevents cross-origin attacks |
| **SQL Injection Prevention** | SQLAlchemy ORM | Parameterized queries by default |

---

## Project Structure

```
profile/
├── docker-compose.yml       # Multi-container orchestration
├── Dockerfile               # Container build configuration
├── requirements.txt         # Python dependencies
├── README.md                # Project documentation
│
├── app/                     # Backend application
│   ├── __init__.py          # Package initializer
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # SQLAlchemy engine configuration
│   ├── models.py            # ORM model definitions
│   └── schemas.py           # Pydantic validation schemas
│
└── frontend/                # Static frontend assets
    ├── index.html           # Public portfolio interface
    ├── admin.html           # Administrative panel
    ├── login.html           # Authentication page
    ├── signup.html          # User registration page
    ├── style.css            # Stylesheet definitions
    ├── script.js            # Client-side logic
    └── images/              # Static image assets
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or Docker)
- pip package manager

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/profile-portfolio.git
cd profile-portfolio

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# 5. Start PostgreSQL (if not using Docker)
# Ensure PostgreSQL is running and create database

# 6. Run the development server
uvicorn app.main:app --reload --port 8001

# 7. Open browser
# API Docs: http://localhost:8001/docs
# Portfolio: http://localhost:8001/
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Docker Compose Network                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────────┐         ┌─────────────────┐       │
│   │   API Service   │         │   DB Service    │       │
│   │   (Python 3.11) │         │ (PostgreSQL 15) │       │
│   │                 │         │                 │       │
│   │   Port: 8000    │────────►│  Port: 5432     │       │
│   │                 │  SQL    │  (5434 external)│       │
│   │   depends_on:   │ Queries │                 │       │
│   │   db (healthy)  │         │  healthcheck:   │       │
│   └─────────────────┘         │  pg_isready     │       │
│          │                    └─────────────────┘       │
│          │                                               │
└──────────┼───────────────────────────────────────────────┘
           │
           ▼
    Host Port 8000
    http://localhost:8000
```

---

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `SECRET_KEY` | JWT signing key (change in production!) | `your-super-secret-key-change-this` |

### Example `.env` file

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/meapi
SECRET_KEY=your-production-secret-key-here
```

---

## Production Deployment

### Deploy to Render + Neon

1. **Create Neon PostgreSQL Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project and database
   - Copy connection string

2. **Deploy to Render**
   - Connect GitHub repository
   - Set environment variables:
     - `DATABASE_URL`: Neon connection string
     - `SECRET_KEY`: Secure random string
   - Deploy using Dockerfile

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway up
```

---

## Technical Highlights

This section outlines the key technical decisions and architectural patterns implemented in this project, demonstrating proficiency in modern software development practices.

### Software Engineering Principles

#### 1. Clean Architecture Pattern
- Separation of concerns: Models, Schemas, Routes organized in distinct modules
- Dependency injection pattern for database sessions and authentication middleware
- Reusable utility functions abstracting common data access patterns

#### 2. RESTful API Design
- Adherence to HTTP method semantics (GET, POST, PUT, DELETE)
- Query parameter support enabling flexible data retrieval
- Consistent JSON response structures across all endpoints

#### 3. Security Implementation
- Password hashing using bcrypt with automatic salt generation
- JWT tokens with configurable expiration for session management
- Owner-based authorization ensuring data isolation between users
- SQL injection prevention through SQLAlchemy's parameterized queries

#### 4. Database Architecture
- Normalized schema design following Third Normal Form (3NF)
- Foreign key constraints with cascade delete for referential integrity
- Indexed fields optimizing query performance on frequent lookups

#### 5. Infrastructure as Code
- Containerized deployment using Docker
- Health checks ensuring service availability before traffic routing
- Environment-based configuration supporting multiple deployment stages

#### 6. Code Quality Standards
- Type annotations throughout the Python codebase
- Pydantic models enforcing runtime data validation
- Async-compatible architecture for future scalability

### Technical Deep Dives

<details>
<summary><b>Framework Selection: FastAPI vs Flask/Django</b></summary>

FastAPI offers:
- **Automatic OpenAPI documentation** - Zero effort API docs
- **Type checking at runtime** via Pydantic - Fewer runtime bugs
- **Async support** - Better performance under load
- **Modern Python features** - Type hints, dataclasses
- **Dependency injection** - Clean, testable code
- **50-300% faster** than Flask for I/O operations

</details>

<details>
<summary><b>JWT Authentication Implementation</b></summary>

The authentication flow follows industry-standard practices:

1. User submits credentials to `/token` endpoint
2. Server verifies password using bcrypt hash comparison
3. Upon successful validation, server generates JWT containing:
   - `sub` (subject): user's email as identifier
   - `exp` (expiration): current timestamp + 6 hours
4. Token is signed using HS256 algorithm with SECRET_KEY
5. Client stores token and includes it in subsequent requests via `Authorization: Bearer <token>` header
6. Protected endpoints decode token, validate signature and expiration timestamp
7. User record is retrieved from database using email extracted from token payload

</details>

<details>
<summary><b>Data Isolation & Authorization</b></summary>

Every protected endpoint uses `get_current_user` dependency to extract the authenticated user. Before any modification:
1. Get the resource from database
2. Check if `resource.basic_info.email == current_user.email`
3. If not matching, return 403 Forbidden

This ensures row-level security without complex database policies.

</details>

<details>
<summary><b>Database Relationship Design</b></summary>

The schema implements a **one-to-many relational pattern**:
- `BasicInfo` serves as the central entity representing the user profile
- Each profile can contain multiple projects, experiences, skills, and hobbies
- `ForeignKey` constraints link child tables to `basic_info.id`
- SQLAlchemy `relationship()` with `back_populates` enables bidirectional query traversal
- `cascade="all, delete"` ensures referential integrity by removing orphan records

</details>

<details>
<summary><b>Scalability Considerations</b></summary>

**Horizontal Scaling Approach:**
- Stateless JWT authentication enables multiple API instance deployment
- Load balancer distributes traffic across instances
- SQLAlchemy connection pooling manages database connections efficiently

**Vertical Optimization Opportunities:**
- Redis integration for session caching and response memoization
- Pagination implementation for large dataset handling
- Database read replicas for query distribution

**Production Enhancement Path:**
- Migration to async SQLAlchemy for improved concurrency
- Rate limiting middleware to prevent abuse
- Background task processing for computationally intensive operations

</details>

---

## Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Database Indexing** | Primary keys and unique fields auto-indexed |
| **Connection Pooling** | SQLAlchemy session management |
| **Static File Serving** | FastAPI StaticFiles mounting |
| **Lazy Loading** | ORM relationships loaded on demand |
| **CDN Integration** | External icons served from SimpleIcons CDN |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes with descriptive messages
4. Push to the branch (`git push origin feature/enhancement`)
5. Open a Pull Request with detailed description

Please ensure all contributions adhere to the existing code style and include appropriate tests.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Developed with FastAPI, PostgreSQL, and Docker**

[Report Bug](https://github.com/yourusername/profile-portfolio/issues) · [Request Feature](https://github.com/yourusername/profile-portfolio/issues)

</div>