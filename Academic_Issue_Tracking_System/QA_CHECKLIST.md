# AITS — QA Checklist
### Academic Issue Tracking System | Group 13 | Makerere University
**Branch:** `arnold-backend`  
**Last Updated:** April 12, 2026  
**Tested By:** _______________

---

## How to Use This Checklist
- Check off each item after manually testing via Postman or the DRF browsable API
- Record the actual response received
- Mark ✅ Pass or ❌ Fail
- Note any bugs or unexpected behaviour in the comments column

---

## 1. Environment Setup

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1.1 | Pipenv environment activates without errors | Shell activates successfully | ☐ |
| 1.2 | `python manage.py runserver` starts without errors | Server runs on `http://127.0.0.1:8000` | ☐ |
| 1.3 | PostgreSQL database is connected | No database connection errors on startup | ☐ |
| 1.4 | Migrations are up to date | `python manage.py migrate` shows `No migrations to apply` | ☐ |
| 1.5 | All 7 automated tests pass | `Ran 7 tests ... OK` | ☐ |

---

## 2. Authentication

### 2.1 Register
**Endpoint:** `POST /api/register/`

| # | Scenario | Payload | Expected Response | Status |
|---|----------|---------|-------------------|--------|
| 2.1.1 | Register a new student | `{username, password, email, role: "student", registration_number}` | `201 Created` with user data | ☐ |
| 2.1.2 | Register a new registrar | `{username, password, email, role: "registrar"}` | `201 Created` with user data | ☐ |
| 2.1.3 | Register with missing fields | `{username, password}` only | `400 Bad Request` | ☐ |
| 2.1.4 | Register with duplicate username | Same username twice | `400 Bad Request` | ☐ |

---

### 2.2 Login
**Endpoint:** `POST /api/login/`

| # | Scenario | Payload | Expected Response | Status |
|---|----------|---------|-------------------|--------|
| 2.2.1 | Login with valid credentials | `{username, password}` | `200 OK` with `token`, `refresh`, `role`, `username` | ☐ |
| 2.2.2 | Login with wrong password | `{username, wrong_password}` | `401 Unauthorized` with error message | ☐ |
| 2.2.3 | Login with missing fields | `{username}` only | `400 Bad Request` with error message | ☐ |
| 2.2.4 | Login returns correct role | Student logs in | `role: "student"` in response | ☐ |
| 2.2.5 | Login returns JWT token | Valid credentials | Token is present and non-empty | ☐ |

---

## 3. Student Endpoints

> **Note:** All student endpoints require `Authorization: Bearer <token>` header

### 3.1 Submit Issue
**Endpoint:** `POST /api/student/issues/`

| # | Scenario | Payload | Expected Response | Status |
|---|----------|---------|-------------------|--------|
| 3.1.1 | Student submits a valid issue | `{department, course_code, category, description (20+ chars)}` | `201 Created` with issue data | ☐ |
| 3.1.2 | Issue status defaults to `open` | Valid payload | Response contains `status: "open"` | ☐ |
| 3.1.3 | `submitted_by` is auto-set to logged-in student | Valid payload | Response contains correct `submitted_by` username | ☐ |
| 3.1.4 | Description too short is rejected | `description: "Too short"` | `400 Bad Request` with validation error | ☐ |
| 3.1.5 | Empty course code is rejected | `course_code: ""` | `400 Bad Request` with validation error | ☐ |
| 3.1.6 | Course code is normalized to uppercase | `course_code: "csc1100"` | Response contains `course_code: "CSC1100"` | ☐ |
| 3.1.7 | Invalid department is rejected | `department: 9999` | `400 Bad Request` | ☐ |
| 3.1.8 | Unauthenticated request is blocked | No token | `401 Unauthorized` | ☐ |
| 3.1.9 | Registrar cannot submit an issue | Registrar token | `403 Forbidden` | ☐ |
| 3.1.10 | AuditLog entry is created on submission | Valid submission | `AuditLog` record exists with `action: "Issue Submitted"` | ☐ |

---

### 3.2 List Issues
**Endpoint:** `GET /api/student/issues/all/`

| # | Scenario | Expected Response | Status |
|---|----------|-------------------|--------|
| 3.2.1 | Student sees only their own issues | Returns list of issues belonging to logged-in student only | ☐ |
| 3.2.2 | Student cannot see other students' issues | Other student's issues not in response | ☐ |
| 3.2.3 | Empty list returned if no issues submitted | `[]` | ☐ |
| 3.2.4 | Unauthenticated request is blocked | `401 Unauthorized` | ☐ |

---

### 3.3 Issue Detail
**Endpoint:** `GET /api/student/issues/<id>/`

| # | Scenario | Expected Response | Status |
|---|----------|-------------------|--------|
| 3.3.1 | Student can view their own issue | `200 OK` with full issue data | ☐ |
| 3.3.2 | Student cannot view another student's issue | `404 Not Found` | ☐ |
| 3.3.3 | Non-existent issue ID returns error | `404 Not Found` | ☐ |
| 3.3.4 | Unauthenticated request is blocked | `401 Unauthorized` | ☐ |

---

### 3.4 Edit Issue
**Endpoint:** `PATCH /api/student/issues/<id>/edit/`

| # | Scenario | Payload | Expected Response | Status |
|---|----------|---------|-------------------|--------|
| 3.4.1 | Student can edit their own open issue | `{description: "Updated description that is long enough."}` | `200 OK` with updated data | ☐ |
| 3.4.2 | Student cannot edit a resolved issue | Valid payload on resolved issue | `400 Bad Request` | ☐ |
| 3.4.3 | Student cannot edit another student's issue | Valid payload on another student's issue ID | `404 Not Found` | ☐ |
| 3.4.4 | AuditLog entry created on edit | Valid edit | `AuditLog` record exists with `action: "Issue edited by student"` | ☐ |
| 3.4.5 | Unauthenticated request is blocked | No token | `401 Unauthorized` | ☐ |

---

### 3.5 Withdraw Issue
**Endpoint:** `DELETE /api/student/issues/<id>/withdraw/`

| # | Scenario | Expected Response | Status |
|---|----------|-------------------|--------|
| 3.5.1 | Student can withdraw their own open issue | `204 No Content` | ☐ |
| 3.5.2 | Issue is deleted from database after withdrawal | `Issue.objects.count()` decreases by 1 | ☐ |
| 3.5.3 | Student cannot withdraw a resolved issue | `400 Bad Request` | ☐ |
| 3.5.4 | Student cannot withdraw another student's issue | `404 Not Found` | ☐ |
| 3.5.5 | AuditLog entry created on withdrawal | `AuditLog` record exists with `action: "Issue withdrawn by student"` | ☐ |
| 3.5.6 | Unauthenticated request is blocked | `401 Unauthorized` | ☐ |

---

### 3.6 Student Dashboard
**Endpoint:** `GET /api/student/dashboard/`

| # | Scenario | Expected Response | Status |
|---|----------|-------------------|--------|
| 3.6.1 | Student can access their dashboard | `200 OK` with `username`, `student_number`, `stats`, `issues` | ☐ |
| 3.6.2 | Stats correctly count open issues | Submit 2 open issues → `stats.open: 2` | ☐ |
| 3.6.3 | Stats correctly count resolved issues | Resolve 1 issue → `stats.resolved: 1` | ☐ |
| 3.6.4 | Registrar cannot access student dashboard | `403 Forbidden` | ☐ |

---

## 4. Registrar Endpoints

> **Note:** All registrar endpoints require a registrar JWT token

### 4.1 Assign Issue
**Endpoint:** `PATCH /api/registrar/assign-issue/<id>/`

| # | Scenario | Payload | Expected Response | Status |
|---|----------|---------|-------------------|--------|
| 4.1.1 | Registrar can assign an issue to a lecturer | `{assigned_to: <user_id>}` | `200 OK` with success message | ☐ |
| 4.1.2 | Issue status changes to `in_progress` after assignment | Valid assignment | Issue status is `in_progress` | ☐ |
| 4.1.3 | Student cannot assign issues | Student token | `403 Forbidden` | ☐ |
| 4.1.4 | Non-existent issue returns error | Invalid issue ID | `404 Not Found` | ☐ |

---

### 4.2 Resolve Issue
**Endpoint:** `PATCH /api/registrar/resolve-issue/<id>/`

| # | Scenario | Expected Response | Status |
|---|----------|-------------------|--------|
| 4.2.1 | Registrar can resolve an issue | `200 OK` with success message | ☐ |
| 4.2.2 | Issue status changes to `resolved` | Issue status is `resolved` | ☐ |
| 4.2.3 | Non-existent issue returns error | `404 Not Found` | ☐ |

---

## 5. Permissions & Security

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 5.1 | Student cannot access registrar dashboard | `403 Forbidden` | ☐ |
| 5.2 | Registrar cannot access student dashboard | `403 Forbidden` | ☐ |
| 5.3 | Lecturer cannot submit issues | `403 Forbidden` | ☐ |
| 5.4 | Expired/invalid token is rejected | `401 Unauthorized` | ☐ |
| 5.5 | Request with no token is rejected on protected routes | `401 Unauthorized` | ☐ |

---

## 6. Automated Test Results

Run: `python manage.py test AITS`

| # | Test | Status |
|---|------|--------|
| 6.1 | `test_student_can_submit_issue` | ☐ |
| 6.2 | `test_issue_status_defaults_to_open` | ☐ |
| 6.3 | `test_student_can_list_their_issues` | ☐ |
| 6.4 | `test_student_cannot_see_other_students_issues` | ☐ |
| 6.5 | `test_student_can_withdraw_open_issue` | ☐ |
| 6.6 | `test_student_cannot_withdraw_resolved_issue` | ☐ |
| 6.7 | `test_description_too_short_is_rejected` | ☐ |

**Total Tests Run:** _____ / 7  
**Pass Rate:** _____%

---

## 7. Known Issues / Bugs

| # | Description | Severity | Resolved |
|---|-------------|----------|---------|
| | | | |

---

## 8. Frontend Tests

### 8.1 Login Page
| # | Check | Expected | Status |
|---|-------|----------|--------|
| 8.1.1 | Login with valid credentials | Redirects to dashboard based on role | ✅ |
| 8.1.2 | Login with wrong password | Error message shown | ✅ |
| 8.1.3 | Login with empty fields | Error message shown | ✅ |
| 8.1.4 | JWT token stored after login | `token` exists in localStorage | ✅ |
| 8.1.5 | Role stored after login | `role` exists in localStorage | ✅ |

### 8.2 Route Protection
| # | Check | Expected | Status |
|---|-------|----------|--------|
| 8.2.1 | Access dashboard without token | Redirects to login page | ✅ |
| 8.2.2 | Access dashboard with valid token | Dashboard loads correctly | ✅ |
| 8.2.3 | Dashboard doesn't flash before redirect | Page returns null before redirecting | ✅ |

### 8.3 Issue Submission Form
| # | Check | Expected | Status |
|---|-------|----------|--------|
| 8.3.1 | Submit with empty course code | Error: "Please enter a course code" | ✅ |
| 8.3.2 | Submit with short description | Error: "Description must be at least 20 characters" | ✅ |
| 8.3.3 | Submit without selecting department | Error: "Please select a department" | ✅ |
| 8.3.4 | Department dropdown loads from API | Dropdown shows real departments from database | ✅ |
| 8.3.5 | Valid submission succeeds | Success toast shown, form resets, issues list refreshes | ✅ |
| 8.3.6 | Course code normalized to uppercase | Submitting "csc1100" shows "CSC1100" in issues list | ✅ |

### 8.4 Issues List
| # | Check | Expected | Status |
|---|-------|----------|--------|
| 8.4.1 | Issues list loads on dashboard | Student's issues displayed in table | ✅ |
| 8.4.2 | Empty state shown when no issues | "No issues submitted yet" message | ✅ |
| 8.4.3 | Status badges display correctly | open, in_progress, resolved shown with correct badge colors | ✅ |
| 8.4.4 | Stats update after submission | Total and open count increase by 1 | ✅ |

### 8.5 Logout
| # | Check | Expected | Status |
|---|-------|----------|--------|
| 8.5.1 | Logout clears localStorage | token, role, username removed | ✅ |
| 8.5.2 | Logout redirects to login | User lands on login page | ✅ |
| 8.5.3 | Cannot go back after logout | Browser back button redirects to login | ✅ |

## Sign Off

| Role | Name | Date |
|------|------|------|
| Backend Developer | Arnold | |
| Tested By | | |
| Reviewed By | | |