# DobbyAds API

A RESTful API for image management with nested folders built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login, logout)
- Nested folder creation and management
- Image upload and storage
- Image search functionality
- User-specific access control
- Cloud storage integration
- Responsive image serving

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- Multer (file handling)
- Cloudinary (image storage)
- bcrypt (password hashing)

## Prerequisites

- Node.js (v16.x or later)
- MongoDB
- npm or yarn
- Cloudinary account

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/image-vault.git DobbyAds
   cd DobbyAds
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment Variables

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   CORS_ORIGIN=*
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imagevault
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the server
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

#### 1. Register User
Creates a new user account.

- **URL**: `/api/v1/users`
- **Method**: `POST`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

##### Success Response
- **Code**: 201 CREATED
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2023-02-20T18:22:10.558Z"
  },
  "message": "User registered successfully"
}
```

#### 2. User Login
Authenticates a user and returns a JWT token.

- **URL**: `/api/v1/users/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully"
}
```

### Folders

#### 1. Create Folder
Creates a new folder (root folder or nested folder).

- **URL**: `/api/v1/folders`
- **Method**: `POST`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`
- **Content-Type**: `application/json`

##### Request Body
For root folder:
```json
{
  "name": "My Photos"
}
```

For nested folder:
```json
{
  "name": "Vacation 2024",
  "parentId": "60d21b4667d0d8992e610c85"
}
```

##### Success Response
- **Code**: 201 CREATED
- **Content**:
```json
{
  "success": true,
  "folder": {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "My Photos",
    "userId": "60d21b4667d0d8992e610c85",
    "parentId": null,
    "path": [],
    "isRoot": true,
    "createdAt": "2023-02-20T18:30:10.558Z",
    "updatedAt": "2023-02-20T18:30:10.558Z"
  },
  "message": "Folder created successfully"
}
```

#### 2. Get Root Folders
Retrieves all root folders for the authenticated user.

- **URL**: `/api/v1/folders/root`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "folders": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "My Photos",
      "userId": "60d21b4667d0d8992e610c85",
      "parentId": null,
      "path": [],
      "isRoot": true,
      "createdAt": "2023-02-20T18:30:10.558Z",
      "updatedAt": "2023-02-20T18:30:10.558Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Work Documents",
      "userId": "60d21b4667d0d8992e610c85",
      "parentId": null,
      "path": [],
      "isRoot": true,
      "createdAt": "2023-02-20T18:35:10.558Z",
      "updatedAt": "2023-02-20T18:35:10.558Z"
    }
  ]
}
```

#### 3. Get Folder Contents
Retrieves the contents of a specific folder (subfolders and images).

- **URL**: `/api/v1/folders/:folderId`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "currentFolder": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "My Photos",
      "userId": "60d21b4667d0d8992e610c85",
      "parentId": null,
      "path": [],
      "isRoot": true,
      "createdAt": "2023-02-20T18:30:10.558Z",
      "updatedAt": "2023-02-20T18:30:10.558Z"
    },
    "subfolders": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Vacation 2024",
        "userId": "60d21b4667d0d8992e610c85",
        "parentId": "60d21b4667d0d8992e610c86",
        "path": ["60d21b4667d0d8992e610c86"],
        "isRoot": false,
        "createdAt": "2023-02-20T18:40:10.558Z",
        "updatedAt": "2023-02-20T18:40:10.558Z"
      }
    ],
    "images": [
      {
        "_id": "60d21b4667d0d8992e610c89",
        "name": "Beach Sunset.jpg",
        "folderId": "60d21b4667d0d8992e610c86",
        "userId": "60d21b4667d0d8992e610c85",
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921411/app-uploads/beach_sunset.jpg",
        "fileSize": 1205437,
        "mimeType": "image/jpeg",
        "createdAt": "2023-02-20T18:45:10.558Z",
        "updatedAt": "2023-02-20T18:45:10.558Z"
      }
    ]
  }
}
```

#### 4. Get Folder Path
Retrieves the full path of a folder for breadcrumb navigation.

- **URL**: `/api/v1/folders/:folderId/path`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "path": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "My Photos"
    },
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Vacation 2024"
    }
  ]
}
```

#### 5. Update Folder
Updates a folder's name.

- **URL**: `/api/v1/folders/:folderId`
- **Method**: `PUT`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "name": "New Folder Name"
}
```

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "folder": {
    "_id": "60d21b4667d0d8992e610c88",
    "name": "New Folder Name",
    "userId": "60d21b4667d0d8992e610c85",
    "parentId": "60d21b4667d0d8992e610c86",
    "path": ["60d21b4667d0d8992e610c86"],
    "isRoot": false,
    "updatedAt": "2023-02-20T19:00:10.558Z"
  },
  "message": "Folder updated successfully"
}
```

#### 6. Delete Folder
Deletes a folder and all its contents (subfolders and images).

- **URL**: `/api/v1/folders/:folderId`
- **Method**: `DELETE`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Folder and its contents deleted successfully"
}
```

### Images

#### 1. Upload Image
Uploads an image to a specified folder.

- **URL**: `/api/v1/images`
- **Method**: `POST`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`
  - `Content-Type: multipart/form-data`

##### Request Body
```
FormData:
- image: [file]
- name: "Beach Sunset"
- folderId: "60d21b4667d0d8992e610c86"
```

##### Success Response
- **Code**: 201 CREATED
- **Content**:
```json
{
  "success": true,
  "image": {
    "_id": "60d21b4667d0d8992e610c89",
    "name": "Beach Sunset.jpg",
    "folderId": "60d21b4667d0d8992e610c86",
    "userId": "60d21b4667d0d8992e610c85",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921411/app-uploads/beach_sunset.jpg",
    "fileSize": 1205437,
    "mimeType": "image/jpeg",
    "createdAt": "2023-02-20T18:45:10.558Z",
    "updatedAt": "2023-02-20T18:45:10.558Z"
  },
  "message": "Image uploaded successfully"
}
```

#### 2. Get Image Details
Retrieves details about a specific image.

- **URL**: `/api/v1/images/:imageId`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "image": {
    "_id": "60d21b4667d0d8992e610c89",
    "name": "Beach Sunset.jpg",
    "folderId": "60d21b4667d0d8992e610c86",
    "userId": "60d21b4667d0d8992e610c85",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921411/app-uploads/beach_sunset.jpg",
    "fileSize": 1205437,
    "mimeType": "image/jpeg",
    "createdAt": "2023-02-20T18:45:10.558Z",
    "updatedAt": "2023-02-20T18:45:10.558Z"
  }
}
```

#### 3. Update Image
Updates an image's name.

- **URL**: `/api/v1/images/:imageId`
- **Method**: `PUT`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "name": "Beautiful Beach Sunset"
}
```

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "image": {
    "_id": "60d21b4667d0d8992e610c89",
    "name": "Beautiful Beach Sunset.jpg",
    "folderId": "60d21b4667d0d8992e610c86",
    "userId": "60d21b4667d0d8992e610c85",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921411/app-uploads/beach_sunset.jpg",
    "fileSize": 1205437,
    "mimeType": "image/jpeg",
    "updatedAt": "2023-02-20T19:15:10.558Z"
  },
  "message": "Image updated successfully"
}
```

#### 4. Delete Image
Deletes an image.

- **URL**: `/api/v1/images/:imageId`
- **Method**: `DELETE`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

#### 5. Search Images
Searches for images by name.

- **URL**: `/api/v1/images/search?query=beach`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`

##### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "images": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "Beautiful Beach Sunset.jpg",
      "folderId": "60d21b4667d0d8992e610c86",
      "userId": "60d21b4667d0d8992e610c85",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921411/app-uploads/beach_sunset.jpg",
      "fileSize": 1205437,
      "mimeType": "image/jpeg",
      "createdAt": "2023-02-20T18:45:10.558Z",
      "updatedAt": "2023-02-20T19:15:10.558Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Beach Waves.jpg",
      "folderId": "60d21b4667d0d8992e610c86",
      "userId": "60d21b4667d0d8992e610c85",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1676921510/app-uploads/beach_waves.jpg",
      "fileSize": 987654,
      "mimeType": "image/jpeg",
      "createdAt": "2023-02-20T18:50:10.558Z",
      "updatedAt": "2023-02-20T18:50:10.558Z"
    }
  ]
}
```

## Error Responses

### Authentication errors
- **Code**: 401 UNAUTHORIZED
```json
{
  "success": false,
  "message": "Unauthorized request"
}
```

### Resource not found
- **Code**: 404 NOT FOUND
```json
{
  "success": false,
  "message": "Folder not found" 
}
```

### Validation errors
- **Code**: 400 BAD REQUEST
```json
{
  "success": false,
  "message": "Name is required for update"
}
```

### Server errors
- **Code**: 500 INTERNAL SERVER ERROR
```json
{
  "success": false,
  "message": "Error uploading image"
}
```

