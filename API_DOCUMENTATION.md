# Webinar Platform API Documentation

## Base URL
\`\`\`
http://localhost:8000/api/
\`\`\`

## Authentication
All protected endpoints require JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

---

## 1. Authentication APIs (`/api/auth/`)
https://yourdomain.com/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9&email=user@example.com

### Register User
**POST** `/api/auth/register/`
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "attendee"
}
\`\`\`
**Response:**
\`\`\`json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "attendee"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

### Login
**POST** `/api/auth/login/`
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`
**Response:**
\`\`\`json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "attendee"
  }
}
\`\`\`

### Refresh Token
**POST** `/api/auth/token/refresh/`
\`\`\`json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

### Change Password
**POST** `/api/auth/change-password/`
\`\`\`json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123"
}
\`\`\`

### Password Reset Request
**POST** `/api/auth/password-reset/`
\`\`\`json
{
  "email": "user@example.com"
}
\`\`\`

### Password Reset Confirm
**POST** `/api/auth/password-reset-confirm/`
\`\`\`json
{
  "token": "reset-token-here",
  "new_password": "newpassword123"
}
\`\`\`

---

## 2. Users APIs (`/api/users/`)

### Get User Profile
**GET** `/api/users/profile/`
**Response:**
\`\`\`json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "instructor",
  "avatar": "/media/avatars/user1.jpg",
  "bio": "Experienced instructor",
  "specialization": "Web Development",
  "experience_years": 5,
  "rating": 4.8,
  "is_verified": true
}
\`\`\`

### Update User Profile
**PUT** `/api/users/profile/`
\`\`\`json
{
  "first_name": "John",
  "last_name": "Smith",
  "bio": "Updated bio",
  "specialization": "Full Stack Development"
}
\`\`\`

### Get All Users (Admin Only)
**GET** `/api/users/`
**Query Parameters:**
- `role`: Filter by role (admin, instructor, attendee)
- `is_verified`: Filter by verification status
- `search`: Search by name or email

### Verify Instructor (Admin Only)
**POST** `/api/users/{id}/verify/`
\`\`\`json
{
  "is_verified": true
}
\`\`\`

### Get User Activity
**GET** `/api/users/activity/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "activity_type": "webinar_join",
    "webinar_title": "React Basics",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

---

## 3. Webinars APIs (`/api/webinars/`)

### List Webinars
**GET** `/api/webinars/`
**Query Parameters:**
- `category`: Filter by category ID
- `instructor`: Filter by instructor ID
- `status`: Filter by status (draft, scheduled, live, completed)
- `is_featured`: Filter featured webinars
- `search`: Search in title and description
- `ordering`: Sort by (created_at, scheduled_date, price, rating)

**Response:**
\`\`\`json
{
  "count": 50,
  "next": "http://localhost:8000/api/webinars/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "instructor": {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Doe",
        "avatar": "/media/avatars/jane.jpg"
      },
      "category": {
        "id": 1,
        "name": "Web Development",
        "color": "#3B82F6"
      },
      "scheduled_date": "2024-02-15T14:00:00Z",
      "duration": 120,
      "price": "99.00",
      "status": "scheduled",
      "thumbnail": "/media/webinar_thumbnails/react.jpg",
      "is_featured": true,
      "enrolled_count": 45,
      "average_rating": 4.7
    }
  ]
}
\`\`\`

### Create Webinar (Instructor/Admin)
**POST** `/api/webinars/`
\`\`\`json
{
  "title": "Advanced Python Programming",
  "description": "Deep dive into Python advanced concepts",
  "category": 2,
  "scheduled_date": "2024-03-01T15:00:00Z",
  "duration": 180,
  "max_attendees": 100,
  "price": "149.00"
}
\`\`\`

### Get Webinar Details
**GET** `/api/webinars/{id}/`
**Response:**
\`\`\`json
{
  "id": 1,
  "title": "React Fundamentals",
  "description": "Comprehensive React course...",
  "instructor": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Doe",
    "bio": "Senior React Developer",
    "rating": 4.8
  },
  "category": {
    "id": 1,
    "name": "Web Development"
  },
  "scheduled_date": "2024-02-15T14:00:00Z",
  "duration": 120,
  "price": "99.00",
  "status": "scheduled",
  "zoom_join_url": "https://zoom.us/j/123456789",
  "resources": [
    {
      "id": 1,
      "title": "Course Materials",
      "file": "/media/resources/react-materials.pdf"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "user": "John Smith",
      "rating": 5,
      "comment": "Excellent course!",
      "created_at": "2024-01-20T10:00:00Z"
    }
  ]
}
\`\`\`

### Update Webinar (Instructor/Admin)
**PUT** `/api/webinars/{id}/`
\`\`\`json
{
  "title": "Updated Title",
  "price": "129.00",
  "status": "scheduled"
}
\`\`\`

### Delete Webinar (Instructor/Admin)
**DELETE** `/api/webinars/{id}/`

### Get Categories
**GET** `/api/webinars/categories/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "name": "Web Development",
    "description": "Frontend and Backend development",
    "color": "#3B82F6"
  }
]
\`\`\`

### Add Webinar Review
**POST** `/api/webinars/{id}/reviews/`
\`\`\`json
{
  "rating": 5,
  "comment": "Great webinar, learned a lot!"
}
\`\`\`

---

## 4. Enrollments APIs (`/api/enrollments/`)

### Enroll in Webinar
**POST** `/api/enrollments/`
\`\`\`json
{
  "webinar": 1
}
\`\`\`

### Get My Enrollments
**GET** `/api/enrollments/my/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "webinar": {
      "id": 1,
      "title": "React Fundamentals",
      "scheduled_date": "2024-02-15T14:00:00Z",
      "instructor": "Jane Doe"
    },
    "status": "enrolled",
    "enrolled_at": "2024-01-10T09:00:00Z",
    "certificate_url": null
  }
]
\`\`\`

### Cancel Enrollment
**DELETE** `/api/enrollments/{id}/`

### Submit Feedback
**POST** `/api/enrollments/{id}/feedback/`
\`\`\`json
{
  "rating": 5,
  "feedback_text": "Excellent webinar!",
  "would_recommend": true
}
\`\`\`

### Get Certificate
**GET** `/api/enrollments/{id}/certificate/`

---

## 5. Payments APIs (`/api/payments/`)

### Get Payment History
**GET** `/api/payments/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "webinar": {
      "id": 1,
      "title": "React Fundamentals"
    },
    "amount": "99.00",
    "currency": "INR",
    "status": "completed",
    "payment_method": "razorpay",
    "transaction_id": "txn_123456789",
    "created_at": "2024-01-10T09:00:00Z"
  }
]
\`\`\`

### Create Payment Intent
**POST** `/api/payments/create-intent/`
\`\`\`json
{
  "webinar": 1,
  "payment_method": "razorpay"
}
\`\`\`
**Response:**
\`\`\`json
{
  "payment_id": 1,
  "order_id": "order_123456789",
  "amount": "99.00",
  "currency": "INR",
  "key": "rzp_test_123456789"
}
\`\`\`

### Verify Payment
**POST** `/api/payments/verify/`
\`\`\`json
{
  "payment_id": "pay_123456789",
  "order_id": "order_123456789",
  "signature": "signature_hash"
}
\`\`\`

### Request Refund
**POST** `/api/payments/refunds/`
\`\`\`json
{
  "payment": 1,
  "reason": "Unable to attend",
  "refund_amount": "99.00"
}
\`\`\`

### Get Refund Requests
**GET** `/api/payments/refunds/`

---

## 6. Analytics APIs (`/api/analytics/`)

### Get Dashboard Stats
**GET** `/api/analytics/dashboard/`
**Response:**
\`\`\`json
{
  "total_webinars": 25,
  "total_enrollments": 450,
  "total_revenue": "12500.00",
  "average_rating": 4.6,
  "active_users": 120,
  "growth_rate": 15.5
}
\`\`\`

### Get Webinar Analytics (Instructor/Admin)
**GET** `/api/analytics/webinars/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "webinar_title": "React Fundamentals",
    "total_enrollments": 45,
    "total_attendees": 38,
    "average_rating": 4.7,
    "total_revenue": "4455.00",
    "completion_rate": 84.4
  }
]
\`\`\`

### Get Revenue Chart Data
**GET** `/api/analytics/revenue/chart/`
**Response:**
\`\`\`json
[
  {
    "month": "2024-01-01T00:00:00Z",
    "total_revenue": "2500.00",
    "total_enrollments": 25
  }
]
\`\`\`

### Get Platform Metrics (Admin Only)
**GET** `/api/analytics/platform/`

### Get User Activities (Admin Only)
**GET** `/api/analytics/activities/`
**Query Parameters:**
- `user_id`: Filter by user
- `activity_type`: Filter by activity type

---

## 7. Notifications APIs (`/api/notifications/`)

### Get My Notifications
**GET** `/api/notifications/`
**Response:**
\`\`\`json
[
  {
    "id": 1,
    "title": "Webinar Starting Soon",
    "message": "Your webinar 'React Fundamentals' starts in 30 minutes",
    "status": "sent",
    "priority": "high",
    "created_at": "2024-01-15T13:30:00Z",
    "read_at": null
  }
]
\`\`\`

### Mark Notification as Read
**PATCH** `/api/notifications/{id}/`
\`\`\`json
{
  "read": true
}
\`\`\`

### Mark All Notifications as Read
**POST** `/api/notifications/mark-all-read/`

### Get Unread Count
**GET** `/api/notifications/unread-count/`
**Response:**
\`\`\`json
{
  "unread_count": 5
}
\`\`\`

### Get/Update Notification Preferences
**GET/PUT** `/api/notifications/preferences/`
\`\`\`json
{
  "email_notifications": true,
  "sms_notifications": false,
  "push_notifications": true,
  "webinar_reminders": true,
  "reminder_time": 60
}
\`\`\`

### Send Bulk Notification (Admin Only)
**POST** `/api/notifications/admin/bulk-send/`
\`\`\`json
{
  "user_ids": [1, 2, 3],
  "template_id": 1,
  "title": "System Maintenance",
  "message": "Scheduled maintenance tonight"
}
\`\`\`

---

## 8. Integrations APIs (`/api/integrations/`)

### Zoom Integration
**GET/PUT** `/api/integrations/zoom/`
**Response:**
\`\`\`json
{
  "id": 1,
  "zoom_user_id": "user123",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`

### Zoom OAuth Callback
**POST** `/api/integrations/zoom/oauth-callback/`
\`\`\`json
{
  "code": "authorization_code_from_zoom"
}
\`\`\`

### Get Zoom Meetings
**GET** `/api/integrations/zoom/meetings/`

### Google Calendar Integration
**GET/PUT** `/api/integrations/google-calendar/`

### Email Providers (Admin Only)
**GET/POST** `/api/integrations/email-providers/`
\`\`\`json
{
  "name": "sendgrid",
  "api_key": "your_api_key",
  "from_email": "noreply@yoursite.com",
  "is_active": true,
  "is_default": true
}
\`\`\`

### SMS Providers (Admin Only)
**GET/POST** `/api/integrations/sms-providers/`
\`\`\`json
{
  "name": "twilio",
  "api_key": "your_account_sid",
  "api_secret": "your_auth_token",
  "sender_id": "+1234567890",
  "is_active": true
}
\`\`\`

### Webhooks (Admin Only)
**GET/POST** `/api/integrations/webhooks/`
\`\`\`json
{
  "name": "Payment Webhook",
  "url": "https://yoursite.com/webhook/payments",
  "event_types": ["payment.completed", "payment.failed"],
  "secret_key": "your_secret_key",
  "is_active": true
}
\`\`\`

### Test Webhook (Admin Only)
**POST** `/api/integrations/webhooks/{id}/test/`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Validation failed",
  "details": {
    "email": ["This field is required."],
    "password": ["Password too short."]
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "detail": "Authentication credentials were not provided."
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "detail": "You do not have permission to perform this action."
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "detail": "Not found."
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error",
  "message": "Something went wrong on our end."
}
\`\`\`

---

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

## Pagination
Most list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Response format:
\`\`\`json
{
  "count": 100,
  "next": "http://localhost:8000/api/webinars/?page=3",
  "previous": "http://localhost:8000/api/webinars/?page=1",
  "results": [...]
}
\`\`\`

## File Uploads
For endpoints that accept file uploads, use `multipart/form-data` content type:
\`\`\`bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@profile.jpg" \
  -F "bio=Updated bio" \
  http://localhost:8000/api/users/profile/
