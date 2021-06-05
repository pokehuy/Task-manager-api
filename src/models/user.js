const mongoose = require('mongoose')
const validator = require('validator') // import validator to validate
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({        // mongoose.model() get 2 arguments : name of model and the definition of all fields we want
    name : {
        type: String,
        required: true,
        trim: true    // here people can set up type, validation , ... of the field
    }, 
    email : {
        type: String,
        required: true,
        unique: true,   // make email unique in the database
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
            /* if(validator.contains(value, 'password')){ */
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {               // avatar object can stand before tokens also, it does not matter wherever the position of the avatar field, this will replace the solution which we save the img direct to the code file
        type: Buffer        // with type Buffer, the image will be saved with binary data (base 64)
    }                       // TO SHOW THE IMAGE IN HTML we use full syntax <img src="data:image/jpg; base64, binary_image_codes_goes_here">  it does not matter if after image/ is jpg or png or jpeg.
}, {                        // OR SHORT HAND OF HTML syntax is <img src="data:; base64,binary_image_codes_goes_here"> , normally src="" take the url
    timestamps: true   // timestamp to show the create and the update time of the model, default is false
})

userSchema.virtual('myTask',{   // this will not be saved in the database
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () { // use user.methods.toJSON here instead of user.methods.getPublicProfile will effect all user objects, read about toJSON() with JSON.stringify / or read in bookmark of firefox and test3.js
    const user = this

    const userObject = user.toObject() // return user to plain old js object provide us raw profile data. toObject has to be used in order to delete password and tokens

    delete userObject.password // delete operator to delete property of object, this is syntax of js to delete object's properties
    delete userObject.tokens
    delete userObject.avatar    // this will delete the binary base64 image in the profile resonse but has no effect to the way the image was showed in the url

    return userObject
}

userSchema.methods.generateAuthToken = async function() {   // instance methods are accessible on the instance (individual object)
    const user = this

    const token = /* await */ jwt.sign({ _id: user._id.toString()}, process.env.JWT_KEY) // using keyword await also works, tested , go well
    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token   // this is cannot be deleted because it'll be used in postman advanced chapter
}

userSchema.statics.findByCredentials = async (email, password) => {  //create your own static function inside Schema by using syntax userSchema.statics.function so you can call it in another file just using User.function() when it imported User model
    const user = await User.findOne({ email })                           // static method are accessible on the model, so call model methods

    if(!user){
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login!')
    }

    return user
}

// hash the plain text password before saving
userSchema.pre('save', async function(next) {
    /* this.password = await bcrypt.hash(this.password, 8) */
    const user = this // this = document, which's being saved. This gives us access to the individual user that's about to be saved

    if(user.isModified('password')){            // check if password already hashed or not, it'll be true if user first create or is changed with the password is changed too, we dont want the password be hashed after it was already
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() //Point of that is all above code should be runned before user is saved, next() shows that the code above is done on running. it is important bcz function end will not help in an asynchronous process, after next the user is saved
    // without next, the function is going to run forever
})

// delete task when user is removed
userSchema.pre('delete', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User