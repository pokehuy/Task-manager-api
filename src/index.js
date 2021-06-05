const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// without middleware :  new request ---> run router handler
// with middleware :     new request ---> do something ---> run router handler

/* app.use((req, res, next) => {       // this middleware has to stand before others app.use()
    //console.log(req.method)
    //console.log(req.path)
    if(req.method === 'GET'){
        res.send('GET method is disable!')
    } else {
        next() // run next activities
    }
}) */

/* app.use((req,res,next) => {  
    res.status(503).send('Website is under maintance')
}) */

// test router, how to use it in index file
/* const router = new express.Router()
router.get('/test', (req,res) => {
    res.send('This is test file')
})

app.use(router)                 // without this line, router cannot be run
*/

//EXAMPLE OF MULTER FILE UPLOAD
/* const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits: {
        fieldSize: 1000000 // 1000000 bytes = 1MB
    },
    fileFilter(req, file, cb) {
        //if(!file.filename.match(/\.(doc|docx)$/)){
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Upload pdf file '))
        }

        cb(undefined, true)
        //cb(new Error('Please upload pdf file')) // callback function , in case print error message
        //cb(undefined,false)                     // callback function , in case false 
        //cb(undefined, true)                     // callback function , undefined means that nothing goes wrong, boolean in this case true means upload is expected
    }
})

app.post('/upload', upload.single('upload'), (req, res) => { // upload.single() function will throw an error 'throw new Error()' when smt goes wrong, it is a long html message , we have to have a new function to catch that error by creating one at the end
    res.send()
}, (error, req, res, next) => { // must have all 4 parameters so that express can recognize that this is a function to handle error
    res.status(400).send({ error: error.message })
}) */

// app.use() to customize server
app.use(express.json())         // this will automatic parse incomming json to an object so we can access it in our request
app.use(userRouter)
app.use(taskRouter)


/* // THIS WILL BE MOVED TO user.js IN ROUTERS FILE

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    // console.log(req.params) // this line will print the id value we provided after the /users/ , see more in expressjs doc at request
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){                              // if the wrong id was added , user parameter will be none 
            return res.status(404).send()
        }

        res.send(user)
    } catch(e){
        res.status(500).send( )
    }
})

app.post('/users', async (req, res) => {
    //console.log(req.body)  // print out the request body
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)  // this code line will return all the keys value property of Object request body as an array
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))  // array.includes(a) will check if array includes a or not  // array.every(function) will check every item of the array if they right with the conditional function, if all item right, true returns, if even only 1 false, every() will false

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body , {new: true, runValidators: true}) // new: true will return to user the user AFTER update, runValidator: true will run update validator to check the validate , by default both are false (disable)
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send({error: 'Invalid id!'})
        }

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
}) */



/*

// THIS WILL BE MOVED TO task.js IN ROUTERS FILE

app.get('/tasks', async (req, res) => {
    try {
        const results = await Task.find({})
        res.send(results)
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)

        if(!task){
            return res.status(404).send()   // when check the http request example like using postman, be sure that the id provide will have 12 bytes or 24 hex characters long when 404 comes out, otherwise 500 comes out
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
})

app.patch('/tasks/:id', async (req, res) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if(!isValidOperation){
            return res.status(400).send({error: 'Invalid updates!'})
        }
    
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})



app.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
}) */

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})


//change normal function to async function, so old function will be commented
/* app.get('/tasks',(req, res) => {
    Task.find({}).then((results) => {
        res.send(results)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users/:id',(req, res) => {
    // console.log(req.params) // this line will print the id value we provided after the /users/ , see more in expressjs doc at request 
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user){                              // if the wrong id was added , user parameter will be none 
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.post('/users', (req, res) => {
    //console.log(req.body)  // print out the request body
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)  // status() method must initial BEFORE send() method
    })
})

app.post('/tasks',(req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
}) */


//test bcryptjs to hash password
/* const bcrypt = require('bcryptjs')

const hashPassword = async () => {
    const password = 'Bacon!'
    const hashpwd = await bcrypt.hash(password, 8) // 8 is the number of rounds the algorithm will run to hash the password

    console.log(password)
    console.log(hashpwd)

    const isMatch = await bcrypt.compare('Bacon!', hashpwd) // bcryptjs compare() will compare the password typed in and the pwd hash no matter how many times it was hashed
    console.log(isMatch)
}

hashPassword() */

// test jsonwebtoken to authenticate user
/* const jwt = require('jsonwebtoken')

const myFunction = () => {
    const token = jwt.sign({ _id: 'huyhandsome123'}, 'huydeptrai' , {expiresIn : '7 days'})
    console.log(token)

    const authToken = jwt.verify(token, 'huydeptrai') // private key huydeptrai on both sign and verify must exactly be the same
    console.log(authToken) // expected output : { _id: 'huyhandsome123', iat: 1621536604 } // The iat (issued at) claim identifies the time at which the JWT was issued
}

myFunction() */

// TEST POPULATE
//const Task = require('./models/task')
/* const User = require('./models/user')
const main = async () => {
    // 1. solution: print full the owner information through the task model
    // const task = await Task.findById('60b3646915a1c90ca3fb12d0')
    //await task.populate('owner').execPopulate()
    //console.log(task.owner) // print out the id of task

    // 2. solution: print the task information through the user who create it
    const user = await User.findById('60b3645a15a1c90ca3fb12ce')
    await user.populate('myTask').execPopulate()
    console.log(user.myTask)
}

main() */