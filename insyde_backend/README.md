# Insyde.io Backend

This is the backend server for the Insyde.io CAD Viewer application. It provides API endpoints for user authentication, 3D model uploads, model conversions, and other model-related operations.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (for file uploads)

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gyanesh-Rao28/insyde_io.git
cd insyde_io/insyde_backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
JWT_EXPIRY=7d
JWT_SECRET=your_secret_key_here
MONGO_URL=your_mongodb_connection_string
```

4. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## API Routes

### Testing Route
- `GET /api/v1/test` - Test if the API is working

### User Routes
- `POST /api/v1/users` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/me` - Get current user (requires authentication)
- `GET /api/v1/users/search` - Search users (requires authentication)
- `GET /api/v1/users/allUsers` - Get all users

### Model Routes
- `POST /api/v1/models` - Upload a new 3D model (requires authentication)
- `GET /api/v1/models` - Get all 3D models
- `GET /api/v1/models/:id` - Get a specific 3D model by ID
- `PUT /api/v1/models/:id` - Update a 3D model (requires authentication)
- `DELETE /api/v1/models/:id` - Delete a 3D model (requires authentication)

### Model Manipulation Routes
- `POST /api/v1/models/:id/convert` - Convert a model to a different format (requires authentication)
- `POST /api/v1/models/:id/download` - Increment the download count of a model
- `GET /api/v1/models/:id/download-file` - Download a model file (requires authentication)

### View Settings Routes
- `POST /api/v1/models/:id/defaultView` - Save default view settings for a model (requires authentication)
- `GET /api/v1/models/:id/defaultView` - Get default view settings for a model

### User-Specific Model Routes
- `GET /api/v1/models/user/:userId` - Get all models uploaded by a specific user

## File Structure

The backend follows a modular architecture:
- `src/app.js` - Main Express application setup
- `src/routes/` - API route definitions
- `src/controllers/` - Request handlers
- `src/middlewares/` - Custom middleware (auth, file upload, etc.)
- `src/models/` - MongoDB schema definitions
- `uploads/` - Directory for storing uploaded 3D models

## Authentication

The backend uses JWT (JSON Web Token) for authentication. Protected routes require a valid JWT token to be included in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## File Uploads

3D model files are handled using the Multer middleware. Supported file formats include:
- STL (.stl)
- OBJ (.obj)
- (Other formats supported by your application)

Uploaded files are stored in the `uploads` directory and can be accessed via `/uploads/<filename>`.