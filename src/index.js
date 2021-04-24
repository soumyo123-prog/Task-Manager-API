const express = require('express');

// Importing database related files and models
require('./db/mongoose');

// Importing the routers
const userRouter = require('./routers/user/user'); 
const taskRouter = require('./routers/task/task');

//Setting up the express app and ports
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Starting the server 
app.listen(port, () => {
    console.log("Server is running on "+port);
})