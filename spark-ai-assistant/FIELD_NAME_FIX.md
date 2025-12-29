# Field Name Convention Fix

## Issue Identified
The backend validation error was caused by **field name convention mismatch**:

- **Frontend**: Uses snake_case (`reminder_time`, `repeat_type`, `repeat_interval`)
- **Backend**: Expects snake_case (`reminder_time`, `repeat_type`, `repeat_interval`)
- **Previous Code**: Was converting to camelCase (`reminderDate`, `repeatType`, `repeatInterval`)

## Root Cause
The API documentation in `BACKEND_NEW_ENDPOINTS.md` showed camelCase (`reminderDate`) but the actual backend implementation expects snake_case (`reminder_time`).

## Fix Applied

### ✅ Correct Format (What Backend Expects)
```json
{
  "title": "Meeting with John",
  "description": "Discuss project updates",
  "reminder_time": "2025-12-25T14:30:00.000Z",
  "type": "personal",
  "repeat_type": "weekly",
  "repeat_interval": 1
}
```

### ❌ Previous Incorrect Format
```json
{
  "title": "Meeting with John", 
  "description": "Discuss project updates",
  "reminderDate": "2025-12-25T14:30:00.000Z",  // ❌ Wrong field name
  "type": "daily",                              // ❌ Wrong type value
  "repeatType": "weekly",                       // ❌ Wrong field name
  "repeatInterval": 1                           // ❌ Wrong field name
}
```

## Files Updated

### 1. `src/api/remindersApi.js`
- Fixed field names to use snake_case
- Corrected type values (personal/meeting/task/event vs daily/weekly)
- Enhanced validation and error handling

### 2. `BACKEND_NEW_ENDPOINTS.md`
- Updated documentation to show correct snake_case format
- Added repeat_type and repeat_interval fields

### 3. Validation Components
- Updated test cases to use correct format
- Added comprehensive testing scenarios

## Field Mapping Summary

| Frontend Field | Backend Field | Type | Example |
|---------------|---------------|------|---------|
| `title` | `title` | string | "Doctor appointment" |
| `description` | `description` | string | "Annual checkup" |
| `reminder_time` | `reminder_time` | ISO string | "2024-01-20T09:00:00.000Z" |
| `reminder_type` | `type` | enum | "personal", "meeting", "task", "event" |
| `repeat_type` | `repeat_type` | enum | "none", "daily", "weekly", "monthly", "yearly" |
| `repeat_interval` | `repeat_interval` | number | 1, 2, 3... |

## Validation Rules

### Required Fields
- `title` (string, non-empty)
- `reminder_time` (valid ISO date string, future date)

### Optional Fields
- `description` (string, can be empty)
- `type` (defaults to "personal")
- `repeat_type` (defaults to "none")
- `repeat_interval` (defaults to 1, only used if repeat_type !== "none")

### Valid Values
- **type**: "personal", "meeting", "task", "event"
- **repeat_type**: "none", "daily", "weekly", "monthly", "yearly"
- **repeat_interval**: positive integer (1-365)

## Testing
Use the "Reminder Validation Test" component on the Dashboard to verify the fix works correctly.

## Result
The 400 validation error should now be resolved, and reminder creation should work properly with the backend.