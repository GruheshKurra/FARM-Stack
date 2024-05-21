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
- [Conclusion](#conclusion)


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

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/blog-website.git
   cd blog-website/backend
   ```

2. **Create a virtual environment and activate it:**

   ```sh
   python -m venv env
   source env/bin/activate  # On Windows use `env\\Scripts\\activate`
   ```

3. **Install the required packages:**

   ```sh
   pip install -r requirements.txt
   ```

   Ensure the \`requirements.txt\` includes:

   ```txt
   fastapi
   uvicorn[standard]
   pydantic
   motor
   ```

4. **Run the FastAPI server:**

   ```sh
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
