# EpiMax Backend Assignment 

## Technology used

- Node.js
- Express.js
- SQLite3
- jsonwebtoken
- bcrypt

## Setup Instructions

1. **Clone the Repository**: Clone this repository to your local machine.

   ```bash
   git clone https://github.com/Nampallyrohith/EpiMax-Task-API

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm.

    ```bash
    cd epimax assignment
    npm install

3. **Database Setup**: Design a database schema for task management.

**Steps:**

- **Define Tables:**
    - `Tasks` table with columns: `id` (primary key), `title`, `description`, `status`, `assignee_id`, `created_at`, `updated_at`.
    - `Users` table for handling authentication with columns: `id`, `username`, `password_hash`.
- **Relationships:** Link `Users` to `Tasks` through `assignee_id` to show which user is responsible for a task.

### 4. Backend Logic

**Objective:** Implement business logic for task management.

**Steps:**

- **Set Up Node.js Project:** Initialize a Node.js project with `npm init`.
- **Install Dependencies:** Use `npm install express sqlite3 body-parser`.
- **Implement Endpoints:** Use Express.js to setup routes that correspond to your API design.
    - For each route, connect to the SQLite database and execute the appropriate SQL query.
- **Error Handling:** Ensure your API handles errors gracefully and returns appropriate error messages.

### 5. Authentication and Authorization

**Objective:** Secure the API using authentication and role-based access control.

**Steps:**

- **Implement User Authentication:** Use JSON Web Tokens (JWT) for authentication.
    - Install JWT library: `npm install jsonwebtoken`.
    - Create login and register endpoints that handle token creation and user authentication.
- **Role-Based Access Control:** Implement middleware that checks if the authenticated user has the correct permissions to perform certain actions.


### API Documentation
#### User Endpoints
User Registration
 - URL: /register/
 - Method: POST
 - Request Body:
    ```json
    {
    "username": "rohit12",
    "password": "rohit@12"
    }

 - Description: Registers a new user with the provided details.
User Login

 - URL: /login/
 - Method: POST
 - Request Body:
    ```json
    {
    "username":"rohit12",
    "password":"rohit@12"
    }

 - Description: Logs in the user with the provided credentials and returns a JWT token for authentication.
#### Routes
Get All tasks 
 - URL: /tasks/
 - Method: GET
 - Authentication: Required
 - Description: Retrieves all tasks
Create New task
 - URL: /tasks
 - Method: POST
 - Authentication: Required
 - Request Body:
    ```json
    {
    "title" : "Deploy Application to Production",
    "description": "Launch the application for public use in a live environment.",
    "status": true,
    "assignee_id": 4576,
    "created_at" : "17/02/2024",
    "updated_at": "28/02/2024"
    }
 - Description: Creates a new task with the provided details.
Get task by ID
 - URL: /tasks/:id
 - Method: GET
 - Authentication: Required
 - Description: Retrieves details of a specific task by ID.
Update task 
 - URL: /tasks/:id/
 - Method: PUT
 - Authentication: Required
 - Request Body:
    ```json
    {
    "date": "07/02/2024"
    }
 - Description: Updates the date of a specific task by ID.
Delete task
 - URL: /tasks/:id
 - Method: DELETE
 - Authentication: Required
 - Description: Deletes a specific task by ID.



## **Note**
 - Download the extension REST client which is used to send http request