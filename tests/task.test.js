const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId, userTwo, taskOne, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

// test create task
test('should test create task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'abc',
            owner : userOneId
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task.description).toEqual('abc')
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

//test get all tasks of userOne authorization
test('Should get all tasks of userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

//test the second user delete the first task
test('second user should not delete first task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})