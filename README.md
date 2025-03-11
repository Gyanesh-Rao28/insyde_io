# Insyde.io - Web-based CAD Viewer

Insyde.io is a full-stack web application that allows users to upload, view, and manipulate 3D CAD models. This project provides a user-friendly interface for interacting with 3D models (STL, OBJ) directly in the browser with features like rotation, zooming, and panning.

![Insyde.io](https://via.placeholder.com/800x400?text=Insyde.io+CAD+Viewer)

## Features

- **Model Upload & Management**: Upload and manage 3D models in STL and OBJ formats
- **Interactive 3D Viewer**: View and manipulate 3D models with intuitive controls
- **Model Conversion**: Convert between different 3D file formats (STL to OBJ and vice versa)
- **User Authentication**: Secure user accounts with JWT authentication
- **Default Views**: Save and load preferred model orientations
- **Model Statistics**: Track view and download counts for models
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Three.js with React Three Fiber
- TailwindCSS
- React Router
- TanStack React Query
- Vite

### Backend
- Node.js with Express
- MongoDB
- JWT Authentication
- Multer for file handling

## Project Structure

```
insyde_io/
│
├── insyde-frontend/       # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   └── README.md          # Frontend documentation
│
├── insyde_backend/        # Backend Node.js application
│   ├── src/               # Source code
│   ├── uploads/           # Uploaded model files
│   └── README.md          # Backend documentation
│
└── README.md              # Main project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB database
- Git

### Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/Gyanesh-Rao28/insyde_io.git
cd insyde_io
```

2. Set up the backend
```bash
cd insyde_backend
npm install

# Create .env file with your MongoDB connection string and JWT secret
# See backend README for details

npm run dev
```

3. Set up the frontend
```bash
cd ../insyde-frontend
npm install

# Create .env file with your backend API URL
# See frontend README for details

npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

For detailed setup instructions, please refer to the README files in the respective directories.

## Usage

1. **Register/Login**: Create an account or login to access all features
2. **Upload Models**: Use the upload form to add your 3D models
3. **View Models**: Browse and view uploaded models
4. **Manipulate Models**: Use the viewer controls to rotate, zoom, and pan
5. **Convert Models**: Convert between supported formats
6. **Save Views**: Save preferred viewing angles for later use

## Demo Video

[Watch Demo Video](https://youtu.be/your-demo-video-link)

## Screenshots

<table>
  <tr>
    <td><img src="https://via.placeholder.com/400x300?text=Home+Page" alt="Home Page" /></td>
    <td><img src="https://via.placeholder.com/400x300?text=Model+Viewer" alt="Model Viewer" /></td>
  </tr>
  <tr>
    <td><img src="https://via.placeholder.com/400x300?text=Upload+Form" alt="Upload Form" /></td>
    <td><img src="https://via.placeholder.com/400x300?text=Models+Gallery" alt="Models Gallery" /></td>
  </tr>
</table>