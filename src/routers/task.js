const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const taskRouter = new express.Router()  // instead of using just router we can use taskRouter to clarify the name, just fine cuz router is not fixed


// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', auth, async (req, res) => {
    const match = {} // set the match object variable to null so if we do not provide the true or false value, all tasks will be fetched
    const sort = {}
    try {
        //const results = await Task.find({ owner: req.user._id }) // solution 1
        //res.send(results)

        //await req.user.populate('myTask').execPopulate() //solution 2
        if(req.query.completed){  // if we provide the true/false value, set that value into the match object
            match.completed = req.query.completed === 'true' // true in the url is not boolean value, it's a string value, so we have to set boolean value here
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')  // split function have to be used because after sortBy is String, not hardcode so we can not immediately set sort.createdAt or sort.completed etc
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1  // USE sort[...] , sort. NOT WORK!!!
        }

        //use req.user in auth instead of use Task and use populate to fetch Task by user, we can handle limit, skip, sort, filter inside populate
        await req.user.populate({  // solution 2 but add filter option: completed tasks or not
            path: 'myTask',         // path must have exact name of virtual Schema in user model
            match,
            //match: { // filter
            //  completed: true
            //}
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                //sort: {   // sort
                    //createdAt: 1 // ascending is 1, descending is -1
                    //completed : -1
                //}
            }
        }).execPopulate()  
        res.send(req.user.myTask)
    } catch (error) {
        res.status(500).send()
    }
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id }) // find 1 task by its _id and the id of the person who creates it

        if(!task){
            return res.status(404).send()   // when check the http request example like using postman, be sure that the id provide will have 12 bytes or 24 hex characters long when 404 comes out, otherwise 500 comes out
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

taskRouter.post('/tasks', auth, async (req, res) => {
    /* const task = new Task(req.body) */
    const task = new Task({
        ...req.body,   // using spread operator 
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
})

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if(!isValidOperation){
            return res.status(400).send({error: 'Invalid updates!'})
        }
    
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}) // findByIdAndUpdate bypass some mongoose middleware features ,that why we have to use options like new and runValidator

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }) // 1.line change
        // const task = await Task.findById(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])  // DONT USE updates.[update] because updates is array, meanwhile task and req.body are Objects
        await task.save()

        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})



taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = taskRouter