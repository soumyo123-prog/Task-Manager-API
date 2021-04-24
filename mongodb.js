//Importing the mongodb connector
const {MongoClient, ObjectID} = require('mongodb');

// Generating a new id
// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

//Setting up URL and name of database
const databaseURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-app";

//Connecting the node js app to the database
MongoClient.connect(databaseURL, {useNewUrlParser : true}, (error,client) => {
    if (error) {
        return console.log("Could not connect to database!");
    }
    
    //Get a referance to the database we want to manipulate
    //Simply by naming and using it as argument in client.db()
    //MongoDb will automatically create the database for us
    //if it does not exist
    
    const db = client.db(databaseName);

    db.collection('tasks').deleteOne({
        description : "Complete the styling of front-end"
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
})