const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const sendMail = require('../emails/account')

// this will be replaced by other get router under
/* router.get('/users',auth , async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
}) */

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()  // CAN NOT use req.user.tokens.save() -> does not work, tested, have to save the whole user because save method has syntax Model.prototype.save() -> it accept only instance model, not it's property
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    /* console.log(req.params) // this line will print the id value we provided after the /users/ , see more in expressjs doc at request */
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

router.post('/users', async (req, res) => {
    //console.log(req.body)  // print out the request body
    const user = new User(req.body)

    try{
        /* const token = await user.generateAuthToken() */ // create token before save , not test yet but think it works
        await user.save()
        sendMail({
            from: 'TASK MANAFER APP <pokehuy11@gmail.com>',
            to: `${user.name} <${user.email}>`,
            subject:'Wellcome to Task-manager App',
            //html: '...'
            text: 'You created an account from Task-manager App!'
        })
        const token = await user.generateAuthToken() // create token after save the user
        res.status(201).send({ user, token }) // if getPublicProfile methods is used in user model file, we have to provide res.status(201).send({ user: user.getPublicProfile(), token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        // find user in User model with the email and password provide, then pass it to next function to generate authenticator token
        const user = await User.findByCredentials(req.body.email, req.body.password)  // use User to access the set of users, use with findBy.. method to search the collections
        const token = await user.generateAuthToken()                                    // use user to access the one dividual user which is in use  // user.function here is user from function above 
        res.send({ user, token }) // use getPublicProfile only when we use user.methods.getPublicProfile instead of user.methods.toJSON in user models file
    } catch(e) {
        res.status(400).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

const upload = multer({
    /* dest: 'images/avatars', */  // THIS HAVE TO BE MOVE when we add avatar field in user router, if not the img still be saved direct inside source code
    limits: {
        fileSize :1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){   // regular expression to filter more than 1 file extension 
            return cb(new Error('Upload a jpg file'))
        }

        cb(undefined, true)
        
    }
})

// this router gonna be use to create or update avatar, no need to wipe it before use this router
// add auth() function to validate the avatar with the user, this middlerware function SHOULD stay before the upload.single() function
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => { // avatar string inside single() method must be exactly like the key value in body/formdata in postman app
    //req.user.avatar = req.file.buffer // now req.user.avatar point to the user avatar, the req.file.buffer handle the file object which is uploaded and buffer stand for binary type of it
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next ) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined // do not use {}
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png') // tested 'image/jpg' here is still work -> no effect to the program
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

// restructure update router with user authentication
/* router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)  // this code line will return all the keys value property of Object request body as an array
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))  // array.includes(a) will check if array includes a or not  // array.every(function) will check every item of the array if they right with the conditional function, if all item right, true returns, if even only 1 false, every() will false

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body , {new: true, runValidators: true}) // new: true will return to user the user AFTER update, runValidator: true will run update validator to check the validate , by default both are false (disable)
        const user = await User.findById(req.params.id) // because findByIdAndUpdate bypass the mongoose middleware, we have to use normal mongoose syntax , first use findById to find the user we gonna change

        if(!user){
            return res.status(404).send()
        }

        updates.forEach((update) => user[update] = req.body[update]) // assign each user[dynamic value] to each request body value
        await user.save() // remember to use .save() to save the change because we assign directly request body to user that we found by id in the database,

        // if(!user){                       // move to position after findById to check if 404 . if this section is not moved status code 400 return and error message automatically returns
        //    return res.status(404).send()
        //}

        res.send(user) // show the document which is just changed
    } catch(e) {
        res.status(400).send(e)
    }
}) */

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = User.findByIdAndDelete(req.user._id)
        await req.user.remove() // mongoose function Model.prototype.remove()
        sendMail({
            from: 'TASK MANAFER APP <pokehuy11@gmail.com>',
            to: `${req.user.name} <${req.user.email}>`,
            subject:'Thanks and see you soon!',
            text: 'Thanks!',
            html: '<h3>Thanks for using our task-manager app</h3>'
        })
        // when user be removed , some code to delete its own tasks can be wrote here or we can use middleware pre methods in the user model
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

// restructure delete router with user authentication
/* router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
    if(!user){                                                      // dont use this if because it already handle in auth function
            return res.status(404).send({error: 'Invalid id!'})
        }

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
}) */

module.exports = router // export the router so that it can be used in main index file