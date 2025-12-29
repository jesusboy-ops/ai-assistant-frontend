# Spark AI Assistant - Backend API Specification

This document outlines all the API endpoints expected by the Spark AI Assistant frontend.

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Google OAuth
```http
POST /api/auth/oauth/google
```

**Request Body:**
```json
{
  "idToken": "google_id_token_here"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset link sent to email"
}
```

### Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

### Get Profile
```http
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Chat Endpoints

### Get All Conversations
```http
GET /api/chat/conversations
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "conv_123",
    "title": "Project Discussion",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
```

### Get Specific Conversation
```http
GET /api/chat/conversations/:conversationId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "conversation": {
    "id": "conv_123",
    "title": "Project Discussion",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "messages": [
    {
      "id": "msg_123",
      "role": "user",
      "content": "Hello, how can you help me?",
      "timestamp": "2024-01-01T10:00:00.000Z",
      "isFavorite": false
    },
    {
      "id": "msg_124",
      "role": "assistant",
      "content": "I can help you with various tasks...",
      "timestamp": "2024-01-01T10:00:05.000Z",
      "isFavorite": false
    }
  ]
}
```

### Send Message
```http
POST /api/chat/message
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "conversationId": "conv_123",
  "message": "What's the weather like?"
}
```

**Response (200):**
```json
{
  "message": {
    "id": "msg_125",
    "role": "assistant",
    "content": "I don't have real-time weather data, but...",
    "timestamp": "2024-01-01T10:05:00.000Z",
    "isFavorite": false
  }
}
```

### Delete Conversation
```http
DELETE /api/chat/conversations/:conversationId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Conversation deleted successfully"
}
```

---

## Email Endpoints

### Generate Email
```http
POST /api/email/generate
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "prompt": "Write a follow-up email to a client",
  "tone": "professional",
  "context": "Meeting was last Tuesday about project timeline"
}
```

**Response (200):**
```json
{
  "email": "Dear [Client Name],\n\nI hope this email finds you well...",
  "subject": "Follow-up: Project Timeline Discussion"
}
```

### Send Email
```http
POST /api/email/send
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "to": "client@example.com",
  "subject": "Follow-up: Project Timeline",
  "body": "Dear Client,\n\nI hope this email finds you well..."
}
```

**Response (200):**
```json
{
  "message": "Email sent successfully",
  "messageId": "sendgrid_message_id"
}
```

### Generate and Send Email
```http
POST /api/email/generate-and-send
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "prompt": "Write a follow-up email to a client",
  "tone": "professional",
  "context": "Meeting was last Tuesday",
  "to": "client@example.com"
}
```

**Response (200):**
```json
{
  "message": "Email generated and sent successfully",
  "email": "Dear [Client Name]...",
  "messageId": "sendgrid_message_id"
}
```

---

## Notes Endpoints

### Get All Notes
```http
GET /api/notes
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "note_123",
    "title": "Meeting Notes",
    "content": "Discussed project timeline and deliverables...",
    "isPinned": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### Get Specific Note
```http
GET /api/notes/:noteId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "note_123",
  "title": "Meeting Notes",
  "content": "Discussed project timeline and deliverables...",
  "isPinned": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### Create Note
```http
POST /api/notes
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "New Note",
  "content": "This is the content of my note...",
  "isPinned": false
}
```

**Response (201):**
```json
{
  "id": "note_124",
  "title": "New Note",
  "content": "This is the content of my note...",
  "isPinned": false,
  "createdAt": "2024-01-01T14:00:00.000Z",
  "updatedAt": "2024-01-01T14:00:00.000Z"
}
```

### Update Note
```http
PUT /api/notes/:noteId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated content...",
  "isPinned": true
}
```

**Response (200):**
```json
{
  "id": "note_123",
  "title": "Updated Note Title",
  "content": "Updated content...",
  "isPinned": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T15:00:00.000Z"
}
```

### Delete Note
```http
DELETE /api/notes/:noteId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Note deleted successfully"
}
```

---

## Calendar Endpoints

### Get Events
```http
GET /api/calendar/events?startDate=2024-01-01&endDate=2024-01-31
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response (200):**
```json
[
  {
    "id": "event_123",
    "title": "Team Meeting",
    "description": "Weekly sync with the team",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T11:00:00.000Z",
    "location": "Conference Room A",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
```

### Create Event
```http
POST /api/calendar/events
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Client Call",
  "description": "Discuss Q1 objectives",
  "startTime": "2024-01-20T14:00:00.000Z",
  "endTime": "2024-01-20T15:00:00.000Z",
  "location": "Zoom"
}
```

**Response (201):**
```json
{
  "id": "event_124",
  "title": "Client Call",
  "description": "Discuss Q1 objectives",
  "startTime": "2024-01-20T14:00:00.000Z",
  "endTime": "2024-01-20T15:00:00.000Z",
  "location": "Zoom",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### Update Event
```http
PUT /api/calendar/events/:eventId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "startTime": "2024-01-20T15:00:00.000Z",
  "endTime": "2024-01-20T16:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": "event_123",
  "title": "Updated Event Title",
  "description": "Discuss Q1 objectives",
  "startTime": "2024-01-20T15:00:00.000Z",
  "endTime": "2024-01-20T16:00:00.000Z",
  "location": "Zoom",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Delete Event
```http
DELETE /api/calendar/events/:eventId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## File Upload Endpoints

### Upload Files
```http
POST /api/upload
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
files: [File, File, ...]
```

**Response (200):**
```json
{
  "files": [
    {
      "id": "file_123",
      "name": "document.pdf",
      "size": 1024000,
      "type": "application/pdf",
      "url": "https://storage.example.com/files/document.pdf",
      "uploadedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### Get All Files
```http
GET /api/upload/files
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "file_123",
    "name": "document.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "url": "https://storage.example.com/files/document.pdf",
    "uploadedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

### Delete File
```http
DELETE /api/upload/files/:fileId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

---

## Notifications Endpoints

### Get VAPID Public Key
```http
GET /api/notifications/vapid-public-key
```

**Response (200):**
```json
{
  "publicKey": "BEl62iUYgUivxIkv69yViEuiBIa-Ib37gp2ENSbOkFZJPrYuQfdkihnTpt8WJT..."
}
```

### Subscribe to Push Notifications
```http
POST /api/notifications/subscribe
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u...",
      "auth": "tBHItJI5svbpez7KI4CCXg=="
    }
  }
}
```

**Response (200):**
```json
{
  "message": "Subscription successful"
}
```

### Unsubscribe from Push Notifications
```http
POST /api/notifications/unsubscribe
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

**Response (200):**
```json
{
  "message": "Unsubscribed successfully"
}
```

### Send Test Notification
```http
POST /api/notifications/test
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Test notification sent"
}
```

---

## Voice Endpoints

### Text-to-Speech
```http
POST /api/voice/text-to-speech
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "text": "Hello, this is a test of the text to speech system.",
  "voice": "alloy"
}
```

**Response (200):**
```
Content-Type: audio/mpeg
<binary audio data>
```

### Speech-to-Text
```http
POST /api/voice/speech-to-text
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
audio: <audio file blob>
```

**Response (200):**
```json
{
  "text": "This is the transcribed text from the audio file."
}
```

### Get Available Voices
```http
GET /api/voice/voices
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "voices": [
    { "id": "alloy", "name": "Alloy" },
    { "id": "echo", "name": "Echo" },
    { "id": "fable", "name": "Fable" },
    { "id": "onyx", "name": "Onyx" },
    { "id": "nova", "name": "Nova" },
    { "id": "shimmer", "name": "Shimmer" }
  ]
}
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "message": "Invalid request data",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## CORS Configuration

The backend should allow requests from the frontend origin:

```javascript
// Example Express.js CORS configuration
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
```

---

## JWT Token Format

The JWT token should include:

```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

Token expiration: Recommended 7 days for refresh tokens, 1 hour for access tokens.

---

## Rate Limiting

Recommended rate limits:
- Authentication endpoints: 5 requests per minute
- AI generation endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute

---

## Notes for Backend Developers

1. **JWT Secret**: Use a strong secret key for JWT signing
2. **Password Hashing**: Use bcrypt with at least 10 rounds
3. **Input Validation**: Validate all inputs on the server side
4. **SQL Injection**: Use parameterized queries
5. **File Upload**: Validate file types and sizes
6. **AI Integration**: Use OpenAI API or similar for chat and email generation
7. **Email Service**: Use SendGrid, AWS SES, or similar
8. **File Storage**: Use AWS S3, Cloudinary, or similar
9. **Database**: PostgreSQL, MongoDB, or similar
10. **Real-time**: Consider WebSockets or Supabase for real-time features
