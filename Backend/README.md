# HSR-Finances Backend

A Node.js Express API server for the HSR-Finances lending management application.

## Features

- **Authentication**: JWT-based authentication for lenders
- **User Management**: Complete CRUD operations for lenders and borrowers
- **Dashboard Analytics**: Real-time statistics and insights
- **Security**: Password hashing with bcrypt
- **Validation**: Request validation with express-validator
- **Database**: MongoDB with Mongoose ODM

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the environment variables as needed

3. **Start MongoDB**:
   Make sure MongoDB is running on your system

4. **Run the server**:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new lender
- `POST /api/auth/login` - Login lender
- `GET /api/auth/profile` - Get current lender profile

### Lender Management
- `PUT /api/lender/profile` - Update lender profile
- `GET /api/lender/dashboard` - Get dashboard statistics

### Borrower Management
- `GET /api/borrowers` - Get all borrowers for lender
- `GET /api/borrowers/:id` - Get single borrower
- `POST /api/borrowers` - Create new borrower
- `PUT /api/borrowers/:id` - Update borrower
- `DELETE /api/borrowers/:id` - Delete borrower

### Health Check
- `GET /api/health` - Server health status

## API Documentation

### Authentication Required
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  },
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hsr-finances
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
APP_NAME=HSR-Finances
API_VERSION=v1
```

## Database Schema

### Lender Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  totalMoneyLent: Number,
  monthlyInterest: Number,
  activeLoans: Number,
  onTimeRate: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Borrower Schema
```javascript
{
  lenderId: ObjectId (ref: Lender),
  name: String,
  email: String,
  phone: String,
  address: String,
  amount: Number,
  interestRate: Number,
  monthlyInterest: Number,
  progress: Number (0-100),
  status: String (current, due, paid, overdue),
  dueDate: Date,
  avatar: String,
  level: Number,
  streak: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Project Structure
```
Backend/
├── server.js          # Main server file with all routes
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # Documentation
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Input validation on all endpoints
- Environment variables for sensitive data
- CORS is currently disabled for development

## License

MIT License
