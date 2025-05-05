Creator Dashboard
This is a web application that allows users to view, save, and interact with content feeds (Reddit). It includes both a user dashboard and an admin dashboard for managing users and their saved feeds.

Features
User Dashboard:

View Reddit feed posts

Save feed posts for later viewing

Earn credit points for daily logins and interactions

Admin Dashboard:

Admin login and registration system

View all registered users and their saved feeds

Update user credits

Technologies Used
Frontend:

React

React Router

Axios for API calls

Backend:

Node.js

Express.js

MongoDB (using Mongoose)

JSON Web Tokens (JWT) for authentication

Additional Tools:

dotenv for managing environment variables

bcryptjs for hashing passwords

Getting Started
Prerequisites
Node.js and npm installed on your machine.

MongoDB Atlas account (or local MongoDB instance).

Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/creator-dashboard.git
cd creator-dashboard
Frontend Setup
Navigate to the frontend directory:

bash
Copy
Edit
cd frontend
Install the dependencies:

bash
Copy
Edit
npm install
Run the frontend:

bash
Copy
Edit
npm start
Backend Setup
Navigate to the backend directory:

bash
Copy
Edit
cd backend
Install the dependencies:

bash
Copy
Edit
npm install
Create a .env file in the backend directory and add the following variables:

env
Copy
Edit
MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-jwt-secret-key
PORT=5000
Start the backend server:

bash
Copy
Edit
npm start
Testing
Visit http://localhost:3000 for the frontend.

The backend API runs on http://localhost:5000.

API Endpoints
User Routes
POST /api/users/login: User login (returns JWT token).

POST /api/users/register: User registration.

GET /api/users/dashboard: Fetch user dashboard data (requires JWT token).

GET /api/users/saved-feeds: Fetch user's saved feeds (requires JWT token).

Admin Routes
POST /api/admin/register: Admin registration.

POST /api/admin/login: Admin login (returns JWT token).

GET /api/admin/users: Fetch all users (requires admin JWT token).

POST /api/admin/update-credits: Update user's credits (requires admin JWT token).

Folder Structure
bash
Copy
Edit
/frontend                # React app (frontend)
  /src
    /components          # Reusable components like Navbar, FeedAggregator, etc.
    /pages               # Page components (Dashboard, Login, etc.)
    /App.jsx             # Main App component

/backend                 # Node.js backend
  /models                # Mongoose models (User, Admin, etc.)
  /routes                # API route handlers (userRoutes, adminRoutes, etc.)
  /controllers           # Business logic for routes
  /middleware            # Authentication and authorization middleware
  /config                # Config files (DB connection, JWT secret, etc.)
  /server.js             # Main server file

Contributing
Contributions are welcome! Feel free to open an issue or create a pull request.

Fork the repository.

Create a new branch (git checkout -b feature-branch).

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature-branch).

Create a new pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

