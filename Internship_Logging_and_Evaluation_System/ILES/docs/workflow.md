# ILES Workflow & State Documentation

## ERD Summary

### Models
- **CustomUser** — id, username, email, password, first_name, last_name, role
- **InternshipPlacement** — id, student (FK), workplace_supervisor (FK), company_name, start_date, end_date
- **WeeklyLog** — id, placement (FK), week_number, activities, status, submitted_at
- **EvaluationCriteria** — id, name, weight
- **Evaluation** — id, placement (FK), criteria (FK), evaluated_by (FK), score, evaluated_at

### Relationships
- One CustomUser (student) → many InternshipPlacements
- One CustomUser (supervisor) → many InternshipPlacements
- One InternshipPlacement → many WeeklyLogs
- One InternshipPlacement → many Evaluations
- One EvaluationCriteria → many Evaluations
- One CustomUser (evaluator) → many Evaluations

## Weekly Log States

| State | Meaning |
|---|---|
| `draft` | Student is creating/editing the log. Not visible to supervisors |
| `submitted` | Student submitted the log. Editing locked. Awaiting supervisor review |
| `reviewed` | Supervisor has reviewed and added comments |
| `approved` | Academic supervisor approved. Log locked and score computed |