# MBSE Backend

This is the backend for the MBSE (Model-Based Systems Engineering) web application built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- **Authentication**: JWT-based authentication with registration, login, and user management
- **Models**: CRUD operations for diagram models with JSON storage
- **Requirements**: Requirements management system
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Request validation with Joi
- **TypeScript**: Full TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy the `.env` file and update the values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mbse_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Run database migrations
   npm run migrate
   ```

## Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3001` with hot reload enabled.

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires authentication)

### Models
- `GET /api/models` - Get all models for authenticated user
- `GET /api/models/:id` - Get specific model
- `POST /api/models` - Create new model
- `PUT /api/models/:id` - Update model
- `DELETE /api/models/:id` - Delete model

### Requirements
- `GET /api/requirements` - Get all requirements for authenticated user
- `POST /api/requirements` - Create new requirement
- `PUT /api/requirements/:id` - Update requirement
- `DELETE /api/requirements/:id` - Delete requirement

### Health Check
- `GET /health` - Server health status

## Project Structure

```
src/
├── config/         # Configuration files (database, environment)
├── controllers/    # Business logic for each route
├── models/         # Database models (handled by Prisma)
├── routes/         # Route definitions
├── middlewares/    # Authentication, validation, error handling
├── services/       # Service layer for business logic
└── app.ts         # Express app entry point

prisma/
└── schema.prisma  # Database schema
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client

## Database Schema

The application uses the following main entities:
- **Users**: User accounts with authentication
- **Models**: Diagram models with JSON data storage
- **Requirements**: Requirements management
- **Links**: Relationships between models and requirements
- **ModelShares**: Model sharing and permissions

## Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Request validation
- Security headers with Helmet

## Development Guidelines

- All endpoints include proper error handling
- Request validation using Joi schemas
- TypeScript strict mode enabled
- Clean separation of concerns (controllers, services, routes)
- Consistent error response format

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT token signing | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | 7d |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | 900000 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |
