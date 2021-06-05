//THIS FILE IS NO NEED FOR THE TASK-MANAGER APP, IS FOR STUDY PURPOSE


// CRUD create read update delete

/* const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID */

const {MongoClient, ObjectID} = require('mongodb')      // insert 2 module of mongodb and objectid

const id = new ObjectID()                   // objectID object to handle object value id 
/* console.log(id)
console.log(id.getTimestamp())
console.log(id.id)
console.log(id.id.length)
console.log(id.toHexString()) */

const connectionURL = 'mongodb://127.0.0.1:27017'   // url link to db 
const databaseName = 'task-manager'                 // db name

 MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {       //connect to db
    if(error){
        return console.log('Unable to connect to database!')            // if connect wrong -> print the message 
    }

    const db = client.db(databaseName)      // connect to db name from above


//--------------DELETE-------------------
    // using deleteOne() to delete one
    db.collection('tasks').deleteOne({
        description: 'buy milk'
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

    /* // using deleteMany() to delete many :)
    db.collection('users').deleteMany({
        age: 27
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    }) */


// --------------UPDATE-------------------
    /* //update users name with specific id using updateOne() and $set update operator
    db.collection('users').updateOne({
        _id : new ObjectID('60944aa6b00b5506dc4b20e2')
    },{
        $set:{
            name : 'Thu'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    }) */

    //update completed tasks from false to true using updateMany() and $set update operator
    /* db.collection('tasks').updateMany({
        completed: false
    },{
        $set:{
            completed: true
        }
    }).then((result) => {                           // using promise to handle result and error
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    }) */


//--------------READ-------------------
    /* //read task with specific id using findOne() and ObjectID
    db.collection('tasks').findOne({ _id: new ObjectID("6097c7d0ba0f7e12bb9d29b5")}, (error, task) => {
        if(error){
            return console.log('Unable to fetch last task')
        }

        console.log(task)
    })

    // read tasks which is not completed with completed: false using find()
    db.collection('tasks').find( {completed: false} ).toArray((error, tasks) => {
        if(error){
            return console.log('Unable to fetch tasks')
        }

        console.log(tasks)
    }) */


//--------------SEARCH-------------------
    // search 1 item, the program will return the first result match if there are more than 1 result
    /* db.collection('users').findOne({ name: 'Huy' }, (error, user) => {          // search thing with smt without id
        if(error){
            return console.log('Unable to fetch')
        }

        console.log(user)
    })

    db.collection('users').findOne({ _id: new ObjectID("6096dbf7c133ee0e14ebc642") }, (error, user) => {        // search with id , id have to be placed inside new ObjectID("")
        if(error){
            return onsole.log('Unable to fetch')
        }

        console.log(user)
    }) */

    /* db.collection('users').find({ age: 27 }).toArray((error, users) => {        // find() doesn't get callback function, it uses cursor and we have tons of methods can go with it
        if(error){
            return console.log('Unable to fetch datas')
        }

        console.log(users)
    })

    db.collection('users').find({ age: 27 }).count((error, count) => {
        if(error){
            return console.log('Unable to count the fields')
        }

        console.log(count)
    }) */


//--------------INSERT-------------------
    /* db.collection('users').insertOne({               // insert 1 field
        _id: id, // if we provide no _id here, the database will create it automatically
        name: 'Huy',
        age: 27
    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user')
        }

        console.log(result.ops)
    }) */

   /*  db.collection('users').insertMany([              // insert many fields
        {
            name: 'John',
            age: 29
        },{
            name: 'Tom',
            age: 31
        }
    ], (error, result) => {
        if(error){
            return console.log('Unable to insert documents')
        }

        console.log(result.ops)
    }) */

    /* db.collection('tasks').insertMany([
        {
            description: 'buy house',
            completed: false
        }, {
            description: 'sign contract',
            completed: true
        }, {
            description: 'buy place',
            completed: true
        }
    ], (error, result) => {
        if(error){
            return console.log('Unable to insert tasks')
        }

        console.log(result.ops)
    }) */
})