## Project: 
- Academic Issue Tracking System (AITS)

## TECH STACK.
- Backend: Django + Django REST Framework
- Frontend: React + Redux
- Database: PostgreSQL
- Hosting: Heroku / AWS

## Team Members.
1. Ariko Joseph Ojangole.
2. OYURU ARNOLD HENRY.
3. Opolot Emmanuel Markus.  
4. MUKISA PERCY.  


## How to run this project

## Project root: 
- Group 13

## Backend Setup:
- Install Python dependencies: pipenv install or pip install -r requirements.txt depending on your setup
- Apply migrations: python manage.py migrate
- Create superuser (optional): python manage.py createsuperuser
- Start backend server: python manage.py runserver

## Frontend setup:
- Go to frontend folder: cd Academic_Issue_Tracking_System/frontend
- Install node packages: npm install
- Start React dev server: npm start or npm run dev

## Notes:
- Backend runs on http://127.0.0.1:8000/
- Frontend runs on http://localhost:3000/ (or as configured)
- Login endpoint: http://127.0.0.1:8000/api/login/
- Register endpoint: http://127.0.0.1:8000/api/register/

## Optional:
- If using PostgreSQL, add DB setup steps
- If using .env, mention copy template and set values



## DELIVERABLE 2

## API Endpoints
- `POST /api/login/` - Authenticate user
- `POST /api/register/` - Register new user
- `GET /api/student/dashboard/` - Student issue stats and list
- `POST /api/student/submit_issue/` - Submit new issue
- `GET /api/lecturer/issues/` - Lecturer view assigned issues
- `POST /api/lecturer/issues/:id/update_status/` - Update issue status
- `GET /api/registrar/dashboard/` - Registrar view all issues
- `PATCH /api/registrar/assign-issue/:id/` - Assign issue to lecturer
- `PATCH /api/registrar/resolve-issue/:id/` - Resolve issue
- `GET /api/hod/issues/` - HOD view departmental issues

## Roles
- **Student**: View issues, submit new issues
- **Lecturer**: View assigned issues, update status
- **Registrar**: Assign issues, resolve issues
- **HOD**: View departmental issues

## Deliverable 2 Status
### Complete
- User authentication (login)
- Student dashboard and issue submission
- Basic role-based routing
- Backend API structure

### Pending
- Lecturer issue management UI
- Registrar assignment/resolution UI
- HOD departmental view
- Complete signup flow
- Role-based access validation
- QA testing and bug fixes

## Environment Requirements
- Python 3.8+
- Node.js 16+
- PostgreSQL (if not using SQLite)
- Django 4.0+
- React 18+
