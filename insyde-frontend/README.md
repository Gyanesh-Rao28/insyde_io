# Insyde.io Frontend

This is the frontend application for Insyde.io - a web-based CAD viewer that allows users to upload, view, and manipulate 3D models.

## Technologies Used

- React 19
- Three.js with React Three Fiber and Drei
- Vite 6.2.0 (build tool)
- Tailwind CSS 4.0.12
- React Router 7.3.0
- Axios 1.8.2
- React Query (TanStack Query)
- JWT for authentication
- React Hot Toast for notifications

## Features

- 3D model viewer with support for STL and OBJ files
- Rotation, zooming, and panning controls
- Model upload and management
- User authentication
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- NPM or Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gyanesh-Rao28/insyde_io.git
cd insyde_io/insyde-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run lint` - Lint the code
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── api/              # API related files
├── components/       # Reusable UI components
│   ├── forms/        # Form components including UploadModelForm
│   └── layout/       # Layout components (MainLayout, DownloadModal, etc.)
├── context/          # React context providers
│   └── AuthContext.jsx # Authentication context
├── pages/            # Page components
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── ModelsPage.jsx
│   ├── ModelViewer.jsx
│   ├── NotFound.jsx
│   └── Register.jsx
├── App.css           # Global styles
├── App.jsx           # Main application component
├── index.css         # Global CSS
├── main.jsx          # Application entry point
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── eslint.config.js  # ESLint configuration
├── index.html        # HTML template
├── package.json      # Project dependencies
└── vite.config.js    # Vite configuration
```

## Key Components

### Model Viewer (ModelViewer.jsx)

The main 3D viewer component uses Three.js with React Three Fiber to render and manipulate 3D models. It supports:

- Loading STL and OBJ file formats
- Camera controls via Drei's OrbitControls
- Model manipulation
- Default view saving

### Authentication (AuthContext.jsx)

User authentication is handled through a context provider that:
- Manages login/register functionality
- Handles JWT token storage and validation
- Provides authentication state to the application
- Protects routes via ProtectedRoute.jsx

### Layout

- MainLayout.jsx - Provides consistent layout across pages
- DownloadModal.jsx - Modal for downloading models

### Forms

- UploadModelForm.jsx - Handles model upload with validation

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | URL of the backend API (default: http://localhost:3000) |
