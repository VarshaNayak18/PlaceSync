# PlaceSync

### Smart Campus Placement Management Platform

PlaceSync is a full-stack campus placement management platform that streamlines the placement process by connecting **students, placement administrators, and recruiters** through a secure, role-based system.

The platform manages the complete placement workflow — from student profiles and company job postings to eligibility checking, applications, interview scheduling, and placement tracking.

---

## 🎯 Problem Statement

Campus placement processes often involve managing student information, job eligibility, applications, interviews, and placement updates across multiple stakeholders.

PlaceSync provides a centralized platform to simplify these processes and ensure that each user can access the functionality relevant to their role.

---

## 💡 Solution

PlaceSync provides separate workflows for three user roles:

- **Students** — manage profiles, view eligible jobs, apply for positions, and track applications.
- **Administrators** — manage companies, jobs, applications, interviews, and placement data.
- **Recruiters** — manage their company's job postings, applications, and interviews.

The backend uses **JWT authentication and role-based authorization** to protect the platform's APIs.

---

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Student, Admin, and Recruiter roles
- BCrypt password hashing
- Protected REST APIs
- Recruiter company-level access isolation
- Global exception handling
- Request validation

### 🎓 Student Management

- Student registration and authentication
- Student profile creation
- Profile updates
- Academic information management
- Personal information management

### 🏢 Company Management

- Company creation and management
- Company information tracking
- Recruiter-company association

### 💼 Job Management

- Job posting
- Job updates and deletion
- Job browsing
- Minimum CGPA requirements
- Department eligibility
- Required skills
- Application deadlines
- Salary and location information

### ✅ Automatic Eligibility Checking

PlaceSync automatically checks whether a student satisfies a job's requirements before allowing an application.

Eligibility is evaluated using factors such as:

- Minimum CGPA
- Eligible department
- Application deadline

The system also provides reasons when a student is not eligible.

### 📝 Application Management

- Student job applications
- Duplicate application prevention
- Application status tracking
- Admin application management
- Recruiter application management
- Application status updates

Supported application statuses:

`APPLIED` → `SHORTLISTED` → `SELECTED`

or

`REJECTED`

### 📅 Interview Management

- Interview scheduling
- Interviewer details
- Interview mode
- Meeting links
- Interview status tracking
- Interview cancellation
- Recruiter-specific interview management

Supported interview statuses include:

`SCHEDULED` · `COMPLETED` · `CANCELLED`

### 📊 Dashboards & Analytics

Role-specific dashboards provide relevant placement information for:

- Students
- Administrators
- Recruiters

---

## 👥 User Roles

| Role | Responsibilities |
|------|------------------|
| **Student** | Manage profile, view jobs, check eligibility, apply for jobs, and track applications |
| **Admin** | Manage companies, jobs, applications, interviews, recruiters, and placement operations |
| **Recruiter** | Manage company jobs, review applications, and manage interviews for their company |

---

## 🔄 Core Placement Workflow

```text
Student Registration
        ↓
Student Profile
        ↓
Recruiter/Admin creates Job
        ↓
Eligibility Check
        ↓
Student Application
        ↓
Application Review
        ↓
Shortlisting
        ↓
Interview Scheduling
        ↓
Interview
        ↓
Application Status Update
        ↓
Selection / Rejection
```

---

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- Hibernate
- JWT
- MySQL
- Maven
- Lombok

### Frontend

- React
- Vite
- Axios
- React Router

### API Documentation

- OpenAPI 3.1
- Swagger UI

### Testing

- JUnit
- Mockito
- Spring Boot Test

---

## 🏗️ System Architecture

PlaceSync follows a layered full-stack architecture that separates presentation, API handling, business logic, data access, and database responsibilities.

```text
┌──────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│              React + Vite + Axios                        │
│                                                          │
│  Student Dashboard | Admin Dashboard | Recruiter UI     │
└─────────────────────────┬────────────────────────────────┘
                          │
                     REST API / JSON
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                  Spring Boot Backend                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Controller Layer                      │  │
│  │  Auth | Student | Company | Job | Application      │  │
│  │  Interview | Recruiter | Dashboard                 │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐  │
│  │                 Service Layer                      │  │
│  │ Authentication | Eligibility | Applications        │  │
│  │ Interviews | Jobs | Companies | Dashboard Logic    │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐  │
│  │                Repository Layer                    │  │
│  │              Spring Data JPA                       │  │
│  └───────────────────────┬────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────┘
                           │
                    Hibernate / JPA
                           │
                           ▼
                ┌─────────────────────┐
                │        MySQL        │
                │    placesync_db     │
                └─────────────────────┘
```

### 🔄 Request Flow

A typical request flows through the application as follows:

```text
React Frontend
      ↓
Axios
      ↓
Spring Boot REST Controller
      ↓
Service Layer
      ↓
Repository Layer
      ↓
Hibernate / JPA
      ↓
MySQL Database
      ↓
Response DTO
      ↓
React Frontend
```

---

## 🔒 Security Architecture

PlaceSync secures its backend using JWT-based authentication and role-based authorization.

```text
Login
  ↓
JWT Token
  ↓
JwtAuthenticationFilter
  ↓
Spring Security
  ↓
Role-Based Authorization
  ↓
Protected REST API
```

---

## 📁 Project Structure

PlaceSync is organized into separate backend and frontend modules following a clean layered architecture.

```text
PlaceSync/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/placesync/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/
│   │   │   │   │   └── response/
│   │   │   │   ├── entity/
│   │   │   │   ├── enums/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

### Backend Package Responsibilities

| Package | Responsibility |
|---------|----------------|
| `config` | Application, security, and OpenAPI configuration |
| `controller` | REST API endpoints and request handling |
| `dto` | API request and response data transfer objects |
| `entity` | JPA database entities |
| `enums` | Application-specific enumerations |
| `exception` | Custom exceptions and global exception handling |
| `repository` | Database access using Spring Data JPA |
| `service` | Business logic and application workflows |

### Frontend Directory Responsibilities

| Directory | Responsibility |
|-----------|----------------|
| `components` | Reusable UI components |
| `context` | Global application state and authentication context |
| `pages` | Application pages and role-specific dashboards |
| `services` | API communication using Axios |
| `utils` | Utility functions and supporting frontend logic |

---

## ⚙️ Setup & Installation

Follow the steps below to run PlaceSync locally.

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd PlaceSync
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

PlaceSync uses **MySQL** as its database.

Create the database:

```sql
CREATE DATABASE placesync_db;
```

The backend requires the following environment variables:

```text
MYSQL_DB_USERNAME
MYSQL_DB_PASSWORD
PLACESYNC_JWT_SECRET
```

Example:

```text
MYSQL_DB_USERNAME=root
MYSQL_DB_PASSWORD=your_mysql_password
PLACESYNC_JWT_SECRET=your_secure_jwt_secret
```

> **Security:** Never commit real passwords, JWT secrets, API keys, or other credentials to GitHub.

### 3. Run the Backend

From the `backend` directory:

#### Windows

```bash
.\mvnw.cmd spring-boot:run
```

#### macOS / Linux

```bash
./mvnw spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The React application will be available at the URL shown by Vite, typically:

```text
http://localhost:5173
```

### 5. Access API Documentation

Once the backend is running, interactive API documentation is available through Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI specification:

```text
http://localhost:8080/v3/api-docs
```

Swagger UI supports JWT Bearer authentication for testing protected APIs.

### 6. Run Backend Tests

From the `backend` directory:

#### Windows

```bash
.\mvnw.cmd clean test
```

#### macOS / Linux

```bash
./mvnw clean test
```

The backend test suite covers authentication, eligibility checking, application workflows, recruiter access isolation, interview management, and application context validation.

### 7. Build the Frontend

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📡 API Reference

PlaceSync exposes REST APIs for authentication, student management, company management, job management, applications, interviews, recruiter management, and dashboard analytics.

All protected endpoints require a valid **JWT Bearer Token** unless otherwise specified.

### 🔐 Authentication APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate a user and receive a JWT token |

### 🎓 Student APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/students/profile` | Student | Create student profile |
| `GET` | `/api/students/profile` | Student | Retrieve the logged-in student's profile |
| `PUT` | `/api/students/profile` | Student | Update the logged-in student's profile |

### 🏢 Company APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/companies` | Admin | Create a company |
| `GET` | `/api/companies` | Admin | Retrieve all companies |
| `GET` | `/api/companies/{id}` | Admin | Retrieve a company by ID |
| `PUT` | `/api/companies/{id}` | Admin | Update company details |
| `DELETE` | `/api/companies/{id}` | Admin | Delete a company |

### 💼 Job APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/jobs` | Admin | Create a job posting |
| `GET` | `/api/jobs` | Admin | Retrieve all jobs |
| `GET` | `/api/jobs/{id}` | Admin | Retrieve a job by ID |
| `GET` | `/api/jobs/company/{companyId}` | Admin | Retrieve jobs posted by a company |
| `PUT` | `/api/jobs/{id}` | Admin | Update a job posting |
| `DELETE` | `/api/jobs/{id}` | Admin | Delete a job posting |

### 📝 Application APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/applications` | Student | Apply for a job |
| `GET` | `/api/applications/my` | Student | Retrieve the logged-in student's applications |
| `GET` | `/api/applications` | Admin | Retrieve all applications |
| `GET` | `/api/applications/{id}` | Admin | Retrieve an application by ID |
| `GET` | `/api/applications/job/{jobId}` | Admin | Retrieve applications for a specific job |
| `PUT` | `/api/applications/{id}/status?status={status}` | Admin | Update application status |

Supported application statuses:

```text
APPLIED
SHORTLISTED
REJECTED
SELECTED
```

### 📅 Interview APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/interviews` | Admin | Schedule an interview |
| `GET` | `/api/interviews` | Admin | Retrieve all interviews |
| `GET` | `/api/interviews/{id}` | Admin | Retrieve an interview by ID |
| `GET` | `/api/interviews/status/{status}` | Admin | Retrieve interviews by status |
| `PUT` | `/api/interviews/{id}/status?status={status}` | Admin | Update interview status |
| `PUT` | `/api/interviews/{id}/cancel` | Admin | Cancel an interview |

### 👤 Recruiter APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/recruiters` | Admin | Create a recruiter account associated with a company |

### 📊 Dashboard APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/dashboard/admin` | Admin | Retrieve admin dashboard analytics |

### 🔑 Authentication

Protected APIs use **JWT Bearer Authentication**.

Include the JWT token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

The API applies role-based authorization using Spring Security.

```text
ADMIN      → Administrative APIs
STUDENT    → Student and application APIs
RECRUITER  → Recruiter-specific APIs
```

Recruiter operations are additionally restricted to resources belonging to the recruiter's associated company.

---

## 📚 API Documentation

PlaceSync provides interactive API documentation using **OpenAPI 3.1** and **Swagger UI**.

When the backend is running locally, access the documentation at:

**Swagger UI**

```text
http://localhost:8080/swagger-ui.html
```

**OpenAPI Specification**

```text
http://localhost:8080/v3/api-docs
```

Swagger UI provides:

- Interactive documentation for PlaceSync REST APIs
- API endpoints grouped by controller
- Request parameters and request body schemas
- Response information
- JWT Bearer authentication support
- Direct API testing from the browser

### 🔑 JWT Authentication in Swagger

Protected endpoints require authentication.

To test protected APIs:

1. Obtain a JWT token by logging in through `/api/auth/login`.
2. Open the **Authorize** button in Swagger UI.
3. Enter the token using the Bearer authentication scheme.
4. Execute protected API requests directly from Swagger UI.

```text
Login
  ↓
JWT Token
  ↓
Swagger Authorize
  ↓
Protected API Request
  ↓
Spring Security
  ↓
API Response
```

The actual PlaceSync APIs remain protected by Spring Security and role-based authorization.

---

## 🧪 Testing

PlaceSync includes automated backend tests to verify core business logic, authentication, authorization, and placement workflows.

### Test Coverage

The backend test suite covers:

- Authentication and user registration
- Login validation
- Duplicate registration prevention
- Job eligibility checking
- CGPA and department eligibility
- Expired application deadlines
- Job application workflow
- Duplicate application prevention
- Application status updates
- Recruiter company-level access isolation
- Interview scheduling
- Interview validation
- Recruiter interview access isolation
- Spring Boot application context

### Current Test Result

```text
Tests run: 26
Failures: 0
Errors: 0
Skipped: 0
```

### Run Tests

From the `backend` directory:

#### Windows

```bash
.\mvnw.cmd clean test
```

#### macOS / Linux

```bash
./mvnw clean test
```

A successful test run confirms that the backend application context and core placement workflows are functioning as expected.

---

## 🗄️ Database Design

PlaceSync uses **MySQL** with **Hibernate/JPA** for persistent data management.

The database is organized around the core entities involved in the campus placement lifecycle:

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1:1
       ▼
┌──────────────┐
│   Student    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌────────────────┐
│  Application   │
└───────┬────────┘
        │ N:1
        ▼
┌──────────────┐
│     Job      │
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│   Company    │
└──────────────┘

┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ N:1
       ▼
┌──────────────┐
│   Company    │
└──────────────┘

┌────────────────┐
│  Application   │
└───────┬────────┘
        │ 1:N
        ▼
┌────────────────┐
│   Interview    │
└────────────────┘
```

### Core Entities

| Entity | Purpose |
|--------|---------|
| `User` | Stores authentication credentials, user details, and roles |
| `Student` | Stores student academic and profile information |
| `Company` | Stores company information |
| `Job` | Stores job postings and eligibility requirements |
| `Application` | Tracks student applications and their statuses |
| `Interview` | Stores interview scheduling and status information |

### Key Relationships

- A `User` can have an associated `Student` profile.
- A `User` with the `RECRUITER` role is associated with a `Company`.
- A `Company` can have multiple `Job` postings.
- A `Student` can submit multiple `Application` records.
- Each `Application` is associated with a specific `Job`.
- An `Application` can have associated `Interview` records.

Database relationships are implemented using **JPA entity mappings** such as `@OneToOne` and `@ManyToOne`.

---

## 🔄 Application Workflow

PlaceSync manages the complete job application lifecycle through a structured workflow.

```text
Student
   │
   ▼
View Job
   │
   ▼
Eligibility Check
   │
   ├── Not Eligible ──→ Display Eligibility Reasons
   │
   └── Eligible
          │
          ▼
     Submit Application
          │
          ▼
        APPLIED
          │
          ▼
      Application Review
          │
          ▼
      SHORTLISTED
          │
          ▼
   Interview Scheduling
          │
          ▼
       Interview
          │
          ▼
   Application Decision
       │          │
       ▼          ▼
   SELECTED    REJECTED
```

### Application Processing

When a student applies for a job, PlaceSync:

1. Identifies the authenticated student.
2. Retrieves the selected job.
3. Checks the student's eligibility.
4. Prevents duplicate applications.
5. Creates the application with `APPLIED` status.
6. Allows authorized users to update the application status.
7. Tracks the application throughout the placement process.

### Eligibility Validation

Before an application is created, the system checks:

- Minimum CGPA requirement
- Eligible department
- Application deadline

If the student is not eligible, the application is rejected and the system provides the reasons for ineligibility.

### Application Status Lifecycle

```text
APPLIED
   │
   ▼
SHORTLISTED
   │
   ├───────────────┐
   ▼               ▼
SELECTED        REJECTED
```

This workflow ensures that applications progress through defined stages while maintaining eligibility and duplicate-application checks.

---

## 🚀 Project Status

**PlaceSync's core platform functionality has been implemented.**

### Completed

- ✅ JWT authentication and role-based authorization
- ✅ Student profile management
- ✅ Company management
- ✅ Job management
- ✅ Automatic eligibility checking
- ✅ Job application workflow
- ✅ Application status management
- ✅ Interview scheduling and management
- ✅ Recruiter company-level access isolation
- ✅ Role-specific dashboards
- ✅ Global exception handling and request validation
- ✅ Automated backend testing
- ✅ Swagger / OpenAPI documentation
- ✅ React frontend integration
- ✅ Technical project documentation

### Current Focus

- 🎨 UI/UX refinement
- 📌 Portfolio presentation
- 🚀 Deployment preparation

---

## 🔮 Future Enhancements

Potential future improvements for PlaceSync include:

- 📱 Responsive UI improvements for mobile and tablet devices
- 🔔 Email and notification support for application and interview updates
- 📈 Advanced placement analytics and reporting
- 📄 Resume upload and management
- 🔎 Advanced job search and filtering
- 📅 Calendar integration for interview scheduling
- ☁️ Cloud deployment and production infrastructure
- 🧪 Expanded automated test coverage
- 🔐 Additional security and audit features

---

## 👩‍💻 Author

**Varsha V Nayak**

Bachelor of Engineering — Robotics and Artificial Intelligence

Bangalore Institute of Technology