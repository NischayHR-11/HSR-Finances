# HSR-Finances Backend API Testing

## Testing with curl (Command Line)

### 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### 2. Register New Lender
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### 3. Login Lender
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get Profile (Replace YOUR_TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/lender/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Create New Borrower
```bash
curl -X POST http://localhost:5000/api/borrowers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "phone": "+1987654321",
    "address": "123 Main St, City",
    "amount": 25000,
    "interestRate": 8.5,
    "dueDate": "2024-12-31"
  }'
```

### 7. Get All Borrowers
```bash
curl -X GET http://localhost:5000/api/borrowers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Update Borrower (Replace BORROWER_ID with actual ID)
```bash
curl -X PUT http://localhost:5000/api/borrowers/BORROWER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "progress": 25,
    "status": "current"
  }'
```

## Testing with Postman

### Setup
1. Create a new collection named "HSR-Finances API"
2. Set base URL as `http://localhost:5000/api`
3. Create an environment variable `token` for storing JWT

### Pre-request Scripts (for authenticated routes)
```javascript
// Add this to requests that require authentication
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### Tests Script (for login endpoint)
```javascript
// Add this to the login request to automatically save token
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Token saved:", response.data.token);
    }
}
```

## Testing with Thunder Client (VS Code Extension)

### Collection Structure
```
HSR-Finances API/
├── Auth/
│   ├── Register
│   ├── Login
│   └── Get Profile
├── Dashboard/
│   └── Get Statistics
└── Borrowers/
    ├── Get All Borrowers
    ├── Create Borrower
    ├── Get Single Borrower
    ├── Update Borrower
    └── Delete Borrower
```

## Sample Test Data

### Lender Registration
```json
{
  "name": "John Doe",
  "email": "john.doe@hsrfinances.com",
  "password": "securepassword123",
  "phone": "+1-555-0123"
}
```

### Borrower Creation
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.johnson@email.com",
  "phone": "+1-555-0456",
  "address": "456 Oak Street, Springfield, IL 62701",
  "amount": 15000,
  "interestRate": 9.2,
  "dueDate": "2024-06-15"
}
```

## Expected Response Formats

### Successful Registration
```json
{
  "success": true,
  "message": "Lender registered successfully",
  "data": {
    "lender": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@hsrfinances.com",
      "phone": "+1-555-0123",
      "totalMoneyLent": 0,
      "monthlyInterest": 0,
      "activeLoans": 0,
      "onTimeRate": 0,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Dashboard Statistics
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMoneyLent": 125000,
      "monthlyInterest": 8750,
      "activeLoans": 12,
      "onTimeRate": 95
    },
    "recentBorrowers": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Sarah Johnson",
        "email": "sarah.johnson@email.com",
        "amount": 15000,
        "interestRate": 9.2,
        "monthlyInterest": 115,
        "progress": 40,
        "status": "current",
        "dueDate": "2024-06-15T00:00:00.000Z"
      }
    ]
  }
}
```

## Error Handling

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Borrower not found"
}
```
