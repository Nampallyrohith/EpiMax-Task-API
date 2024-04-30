const express = require("express");
const bodyParser = require('body-parser');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const databasePath = path.join(__dirname, "task.db");

const initializeDbAndStartServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndStartServer();

app.post("/register/", async (request, response) => {
    const { username, password_hash} = request.body;
    // check if user already exists with the same username
    const selectUserQuery = `
        SELECT * FROM Users WHERE username = '${username}';
        `;
    const dbUser = await database.get(selectUserQuery);
    if (dbUser) {
        response.status(400);
        response.send("User already exists");
    } else if (password_hash.length < 6) {
        response.status(400);
        response.send("Password is too short");
    } else {
        // Create a new user
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const addNewUserQuery = `
            INSERT INTO Users (username, password_hash) 
            VALUES ('${username}', '${hashedPassword}');
            `;
        await database.run(addNewUserQuery);
        response.send("User created successfully");
    }
});


app.post("/login/", async (request, response) => {
const { username, password_hash } = request.body;
// check if the username exists
const selectUserQuery = `
    SELECT * FROM Users WHERE username = '${username}';
    `;
const dbUser = await database.get(selectUserQuery);
if (!dbUser) {
    response.status(400);
    response.send("Invalid users");
} else {
    const isPasswordMatched = await bcrypt.compare(password_hash, dbUser.password_hash);
    if (!isPasswordMatched) {
    response.status(400);
    response.send("Invalid password");
    } else {
    const payload = { username };
    const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
    response.send({ jwtToken });
    console.log(jwtToken)
    }
}
});
  
  // Authentication Middleware
const authenticateUser = (request, response, next) => {
let jwtToken;
const authHeader = request.headers["authorization"];
if (!authHeader) {
    response.status(401);
    response.send("Invalid JWT Token");
} else {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "MY_SECRET_KEY", (error, payload) => {
    if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
    } else {
        request.username = payload.username;
        next();
    }
    });
}
};


// Inserting a new task

app.post('/tasks', authenticateUser, async (request, response) => {
    const {title, description, status, assignee_id, created_at, updated_at} = request.body

    // checking row with respect to title if present
    const checkQuery = `
        SELECT * FROM tasks WHERE title = '${title}';
    `
    const query = await database.get(checkQuery)
    console.log(query)
    if (query !== undefined){
        response.send('Title existed in the tasks table...')
    }
    else{
        const insertQuery = `INSERT INTO Tasks(title, description, status, assignee_id, created_at, updated_at) 
                            VALUES ('${title}', '${description}', '${status}', '${assignee_id}', '${created_at}', '${updated_at}' );`;
    
        await database.run(insertQuery);
        response.status(200)
        response.send('Row inserted...')
    }  
})

// Retrive all the Tasks...
app.get('/tasks', authenticateUser, async (request, response) => {
    const query = `SELECT * FROM Tasks;`;
    const task = await database.all(query);
    response.send(task);
})



// Get details of specific task
app.get('/tasks/:id/', authenticateUser, async (request, response) => {
    const {id} = request.params;

    const getQuery = `
        SELECT * FROM Tasks WHERE id=${id};
    `;

    const query = await database.get(getQuery);
    response.send(query);
    response.status(200)
})


//Updating the Row
app.put('/tasks/:id/', authenticateUser, async (request, response) => {
    const {id} = request.params;
    const {status} = request.body;
    const checkQuery = `
        SELECT * FROM Tasks WHERE id=${id};
    `;
    const query = await database.get(checkQuery)

    if (query === undefined){
        response.send('Firstly, You have to Insert, Id Not Found...')
    } else{
        const updateQuery = `
        UPDATE Tasks
        SET
            status='${status}'
        WHERE id=${id}
        `
        await database.run(updateQuery);
        response.send("Row updated...")
        response.status(200);
    }
})




// Deleting the row
app.delete('/tasks/:id/', authenticateUser, async(request, response) => {
    const {id} = request.params;
    const checkQuery = `
        SELECT * FROM Tasks WHERE id=${id};
    `;
    const query = await database.get(checkQuery)
    console.log(query)
    if (query === undefined){
        response.send('Id not found...')
    } else{
        const deleteQuery = `
        DELETE FROM Tasks where id=${id};
        `;
        await database.run(deleteQuery);
        response.send('Row deleted....')
        response.status(200);
    }
    
})

 