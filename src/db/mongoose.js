const mongoose = require('mongoose')
const validator = require('validator') // import validator to validate

mongoose.connect(process.env.MONGODB_URL,{   // set up database url and the name of the data in 1 url
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

/* const User = mongoose.model('User',{        // mongoose.model() get 2 arguments : name of model and the definition of all fields we want
    name : {
        type: String,
        required: true,
        trim: true    // here people can set up type, validation , ... of the field
    }, 
    email : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('This is an invalid email')
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim: true,
        minlength: 7,      // set the minimum length to 7 > 6
        validate(value){
            // if(validator.contains(value, 'password')){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password is not allow to have string password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive number')
            }
        }
    }
}) */

/* const me = new User({
    name: '   Tom Cane  ',
    email: 'TohmNG@GMAIL.COM',
    password: '223p',
    age: 29             // change number of age to string will cause error bcs mongoose have basic validator and type here is number
})

me.save().then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
}) */

/* // other type 
me.save().then(() => {
    console.log(me)
}).catch((e) => {
    console.log(e)
}) */

/* const Task = mongoose.model('Task',{
    description: {
        type: String,
        required: true,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description: '  Buy Porsche   ',
})

task.save().then((result) => {    
    console.log(result)             // result parameter can be used instead of task parameter
}).catch((error) => {
    console.log(error)
}) */