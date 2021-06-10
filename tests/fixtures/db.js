const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const jwt = require('jsonwebtoken')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Tom Marcus',
    email: 'tom@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({_id: userOneId.toString()}, process.env.JWT_KEY)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'John Mathias',
    email: 'john@example.com',
    password: 'console89$',
    tokens: [{
        token: jwt.sign({_id: userTwoId.toString()}, process.env.JWT_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my first test',
    completed: false,
    owner: userOneId // or userOne._id  is also true
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my second test',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my third test',
    completed: false,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports= {
    userOneId,
    userTwo,
    taskOne,
    userOne,
    setupDatabase
}