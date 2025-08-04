# eTribe API Documentation

## Overview

The eTribe application uses a RESTful API with JWT authentication. All API calls are made through a configured Axios instance with automatic token injection and error handling.

## Base Configuration

### API Instance
```javascript
// src/api/axiosConfig.js
const api = axios.create({
  baseURL: '/api', // Proxy path in development
  headers: {
    'Client-Service': import.meta.env.VITE_CLIENT_SERVICE,
    'Auth-Key': import.meta.env.VITE_AUTH_KEY,
    'rurl': import.meta.env.VITE_RURL,
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for sending cookies (ci_session)
});
```

### Authentication Headers
```javascript
// src/utils/apiHeaders.js
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  
  return {
    'Client-Service': import.meta.env.VITE_CLIENT_SERVICE,
    'Auth-Key': import.meta.env.VITE_AUTH_KEY,
    'uid': uid,
    'token': token,
    'rurl': import.meta.env.VITE_RURL,
    'Content-Type': 'application/json',
  };
};
```

## Authentication Endpoints

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "uid": "user_id",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

## Member Management

### Get Member List
```http
POST /api/member/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "search": "optional_search_term",
  "status": "active|pending|expired"
}
```

### Add Member
```http
POST /api/member/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Member Name",
  "email": "member@example.com",
  "phone": "1234567890",
  "address": "Member Address",
  "membership_type": "basic|premium",
  "additional_fields": {}
}
```

### Edit Member
```http
POST /api/member/edit
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "member_id",
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "1234567890",
  "address": "Updated Address",
  "membership_type": "basic|premium",
  "additional_fields": {}
}
```

### Get Member Details
```http
GET /api/member/{memberId}
Authorization: Bearer {token}
```

### Remove Member
```http
POST /api/member/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "member_id"
}
```

## Event Management

### Get All Events
```http
POST /api/event/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "search": "optional_search_term",
  "status": "upcoming|past|all"
}
```

### Get Upcoming Events
```http
POST /api/event/future
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10
}
```

### Get Past Events
```http
POST /api/event/past
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10
}
```

### Add Event
```http
POST /api/event/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Event Title",
  "description": "Event Description",
  "date": "2024-01-01",
  "time": "10:00:00",
  "location": "Event Location",
  "type": "meeting|celebration|workshop",
  "max_participants": 100,
  "registration_required": true
}
```

### Edit Event
```http
POST /api/event/edit
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "event_id",
  "title": "Updated Event Title",
  "description": "Updated Description",
  "date": "2024-01-01",
  "time": "10:00:00",
  "location": "Updated Location",
  "type": "meeting|celebration|workshop",
  "max_participants": 100,
  "registration_required": true
}
```

### Remove Event
```http
POST /api/event/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "event_id"
}
```

## Group Settings

### Get Group Settings
```http
POST /api/groupSettings
Authorization: Bearer {token}
Content-Type: application/json

{}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Organization Name",
    "email": "org@example.com",
    "logo": "path/to/logo.png",
    "signature": "path/to/signature.png",
    "address": "Organization Address",
    "contact": "1234567890",
    "website": "https://example.com"
  }
}
```

### Update Group Settings
```http
POST /api/groupSettings/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Organization Name",
  "email": "updated@example.com",
  "logo": "path/to/logo.png",
  "signature": "path/to/signature.png",
  "address": "Updated Address",
  "contact": "1234567890",
  "website": "https://example.com"
}
```

## Contact Management

### Get Contacts
```http
GET /api/contact
Authorization: Bearer {token}
```

### Add Contact
```http
POST /api/contact/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "department": "IT Department",
  "name": "Contact Name",
  "contact_no": "1234567890",
  "email_id": "contact@example.com",
  "address": "Contact Address"
}
```

### Edit Contact
```http
POST /api/contact/edit
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "contact_id",
  "department": "Updated Department",
  "name": "Updated Name",
  "contact_no": "1234567890",
  "email_id": "updated@example.com",
  "address": "Updated Address"
}
```

### Remove Contact
```http
POST /api/contact/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "contact_id"
}
```

## Admin Management

### Get Admin Accounts
```http
POST /api/admin/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "search": "optional_search_term"
}
```

### Add Admin
```http
POST /api/admin/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "secure_password",
  "role": "admin|super_admin",
  "permissions": ["read", "write", "delete"]
}
```

### Edit Admin
```http
POST /api/admin/edit
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "admin_id",
  "name": "Updated Admin Name",
  "email": "updated@example.com",
  "role": "admin|super_admin",
  "permissions": ["read", "write", "delete"]
}
```

### Remove Admin
```http
POST /api/admin/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "admin_id"
}
```

## Notification System

### Get Feedbacks
```http
POST /api/feedback/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "status": "read|unread|all"
}
```

### Add Feedback
```http
POST /api/feedback/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "Feedback Subject",
  "message": "Feedback Message",
  "type": "suggestion|complaint|question",
  "priority": "low|medium|high"
}
```

### Get Circulars
```http
POST /api/circular/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "status": "active|inactive|all"
}
```

### Add Circular
```http
POST /api/circular/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Circular Title",
  "content": "Circular Content",
  "priority": "low|medium|high",
  "expiry_date": "2024-12-31",
  "target_audience": "all|members|admins"
}
```

## Grievance Management

### Get Grievances
```http
POST /api/grievance/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "status": "active|pending|closed",
  "priority": "low|medium|high"
}
```

### Add Grievance
```http
POST /api/grievance/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "Grievance Subject",
  "description": "Grievance Description",
  "category": "technical|administrative|other",
  "priority": "low|medium|high",
  "attachments": []
}
```

### Update Grievance Status
```http
POST /api/grievance/update-status
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "grievance_id",
  "status": "active|pending|closed",
  "resolution": "Resolution notes"
}
```

## Payment Management

### Get Payment Details
```http
POST /api/payment/list
Authorization: Bearer {token}
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "member_id": "optional_member_id",
  "status": "paid|pending|failed",
  "date_from": "2024-01-01",
  "date_to": "2024-12-31"
}
```

### Add Payment
```http
POST /api/payment/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "member_id": "member_id",
  "amount": 100.00,
  "payment_type": "cash|card|bank_transfer",
  "description": "Membership fee",
  "due_date": "2024-12-31"
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `AUTH_FAILED`: Authentication failed
- `INVALID_TOKEN`: Invalid or expired token
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

## File Upload

### Upload File
```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": "file_data",
  "type": "image|document|other",
  "folder": "optional_folder_path"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "uploaded_file.jpg",
    "path": "uploads/images/uploaded_file.jpg",
    "url": "https://api.example.com/uploads/images/uploaded_file.jpg"
  }
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Data endpoints**: 100 requests per minute
- **File upload**: 10 requests per minute

## Pagination

All list endpoints support pagination with the following parameters:

```json
{
  "page": 1,        // Page number (1-based)
  "limit": 10,      // Items per page
  "search": "",     // Optional search term
  "sort_by": "",    // Optional sort field
  "sort_order": ""  // "asc" or "desc"
}
```

**Response format:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## WebSocket Events (Future)

For real-time features, the following WebSocket events are planned:

```javascript
// Connection
ws://api.example.com/ws

// Events
{
  "type": "notification",
  "data": {
    "title": "New Message",
    "message": "You have a new notification",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}

{
  "type": "member_update",
  "data": {
    "member_id": "member_id",
    "action": "created|updated|deleted"
  }
}

{
  "type": "event_update",
  "data": {
    "event_id": "event_id",
    "action": "created|updated|deleted"
  }
}
```

## Testing

### Test Environment
- **Base URL**: `https://test-api.etribes.ezcrm.site`
- **Test Credentials**: Available in development environment
- **Mock Data**: Available for testing without backend

### API Testing Tools
- **Postman**: Collection available
- **Insomnia**: Alternative API client
- **curl**: Command-line testing
- **Jest**: Unit testing for API functions

## Security

### Authentication
- JWT tokens with expiration
- Automatic token refresh
- Secure token storage in localStorage

### Data Protection
- HTTPS encryption for all requests
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Rate Limiting
- Per-user rate limiting
- IP-based rate limiting
- DDoS protection

## Monitoring

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

### Metrics
- Request count per endpoint
- Response time statistics
- Error rate monitoring
- User activity tracking

This API documentation provides comprehensive coverage of all endpoints used in the eTribe application. 