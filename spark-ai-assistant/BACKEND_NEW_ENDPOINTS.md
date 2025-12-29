# New Backend Endpoints Required

## Tasks API Endpoints

### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <jwt_token>
```

### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the AI assistant project",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "priority": "high"
}
```

### Update Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task",
  "completed": true
}
```

### Delete Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <jwt_token>
```

### Toggle Task Completion
```http
PATCH /api/tasks/:taskId/toggle
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "completed": true
}
```

### Create Task from Chat Message (AI)
```http
POST /api/tasks/from-message
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "Remind me to call John tomorrow at 3pm"
}
```

### Get AI Task Suggestions
```http
POST /api/tasks/suggestions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "taskTitle": "Plan marketing campaign"
}
```

## Reminders API Endpoints

### Get All Reminders
```http
GET /api/reminders
Authorization: Bearer <jwt_token>
```

### Create Reminder
```http
POST /api/reminders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Doctor appointment",
  "description": "Annual checkup",
  "reminder_time": "2024-01-20T09:00:00.000Z",
  "type": "personal",
  "repeat_type": "weekly",
  "repeat_interval": 1
}
```

### Update Reminder
```http
PUT /api/reminders/:reminderId
Authorization: Bearer <jwt_token>
```

### Delete Reminder
```http
DELETE /api/reminders/:reminderId
Authorization: Bearer <jwt_token>
```

### Complete Reminder
```http
PATCH /api/reminders/:reminderId/complete
Authorization: Bearer <jwt_token>
```

### Create Reminder from Chat Message (AI)
```http
POST /api/reminders/from-message
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "Remind me about the meeting tomorrow"
}
```

### Get Upcoming Reminders
```http
GET /api/reminders/upcoming?days=7
Authorization: Bearer <jwt_token>
```

## Document Summarizer API Endpoints

### Summarize Document
```http
POST /api/documents/summarize
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: <PDF/DOC/DOCX/TXT file>
options: {"extractKeyPoints": true, "generateTags": true}
```

### Get User Summaries
```http
GET /api/documents/summaries
Authorization: Bearer <jwt_token>
```

### Get Specific Summary
```http
GET /api/documents/summary/:summaryId
Authorization: Bearer <jwt_token>
```

### Delete Summary
```http
DELETE /api/documents/summary/:summaryId
Authorization: Bearer <jwt_token>
```

### Extract Key Points
```http
POST /api/documents/key-points
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: <document file>
```

### Save Summary to Notes
```http
POST /api/documents/summary/:summaryId/save-to-notes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "noteTitle": "Document Summary: Project Plan"
}
```

## Math Solver API Endpoints (Optional - AI Enhancement)

### Get Step-by-Step Solution
```http
POST /api/math/solve-steps
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "expression": "2x + 5 = 15"
}
```

## Health Check Endpoint

### Backend Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "version": "1.0.0"
}
```

## CORS Configuration Required

Your backend must allow requests from:
- `http://localhost:5173` (Vite dev server default)
- `http://localhost:5174` (Vite dev server alternate)
- `http://localhost:5175` (Vite dev server alternate)
- Your production frontend domain

```javascript
// Express.js CORS example
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```