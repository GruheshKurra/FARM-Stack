# Blog Website with React, FastAPI, and MongoDB

This project is a blog website built using React for the frontend, FastAPI for the backend, and MongoDB for the database. The website supports CRUD operations for blog posts, including real-time updates using WebSockets.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Frontend Code](#frontend-code)
- [Backend Code](#backend-code)
- [Screenshots](#screenshots)

## Features

- Add, edit, delete, and view blog posts
- Real-time updates using WebSockets
- Responsive UI with React and Bootstrap

## Technologies Used

- **Frontend:** React, Axios, Bootstrap, React-Toastify
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Database:** MongoDB
- **WebSockets:** FastAPI WebSocket

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm
- Python 3.7+
- MongoDB

## Installation

### Backend

   ```sh
   cd blog-website/backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend


   ```sh
   cd blog-website/frontend
   npm start
   ```
