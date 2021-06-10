const request = require('supertest')
//const jwt = require('jsonwebtoken')
//const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')
//use supertest inside jest test function


/*THIS WILL BE MOVED TO db.js TO USE IN BOTH user and task test files
// set of one example use for testing cases, use as input of tests
const userOneId = new mongoose.Types.ObjectId()
// userOne for other test cases example: delete, logout
const userOne = {
    _id: userOneId,
    name: 'Tom Marcus',
    email: 'tom@example.com', // use different email compare to create new user test case because user model accept email as UNIQUE
    password: '56what!!',
    tokens: [{
        token: jwt.sign({_id: userOneId.toString()}, process.env.JWT_KEY)
    }]
}
// delete user of test create new user before do other test cases
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save() // create new user before each test, save() save to the database on purpose
})
*/

beforeEach(setupDatabase)


/* afterEach(() => console.log('after each')) */

// test case : create new user
test('create new user test', async () => {
        //await request(app).post('/users').send({        // request app using supertest to load app file without server up, using post http method and url /users contain call back so async await have to be used
        //    name: 'Huy Nguyen',
        //    email: 'huy.nq.791@aptechlearning.edu.vn',
        //    password: 'MyPass777!'
        //}).expect(201)

        const response = await request(app).post('/users').send({   // response will return the user
            name: 'Huy Nguyen',
            email: 'huy.nq.791@aptechlearning.edu.vn',
            password: 'MyPass777!'
        }).expect(201)

        const user = await User.findById(response.body.user._id) // dont forget await
        expect(user).not.toBeNull()

        //expect(user.name).toBe('Huy Nguyen')

        //NOTICE: token is not inside the user object because it's the way they response, see res.send(user, token) in user get router not the way it's saved in the database
        expect(response.body).toMatchObject({ // object in toMatchObject can be less sub-field than response.body, but it has to have all the main-field, example here password can be miss but user and token have to be showed
            user : {
                name: 'Huy Nguyen',
                email: 'huy.nq.791@aptechlearning.edu.vn'
        },  token: user.tokens[0].token                         // => expect() will get the result and to...() will get the value we believe is true
    })

        expect(user.password).not.toBe('MyPass777!') //test that password was hashed

})

// test case: success login user
test('login user success test', async () => {
    /* await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200) */

    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200) // we can delete .expect() here if we dont care about the response status, if we do, let it be to test the response status also

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)  // get the second argument of tokens because, when user was created, token 1 was created too, when loging in the token 2 is created after that
    // => check if the fetched token is the second token => true (of login after the first token was created when creat user) or not => test fail
})

// test case: failure login user
test('login user fail test', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '123'
    }).expect(400)
})

//test case: success get profile by using authorization
test('get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // 1. beforeEach: create authorization token with jwt and save it direct in userOne then userOne is saved in test database
        .send()                                                    // 2. test function: get the authorization token from userOne and pass it to test() to check the AUTH PROCESS BETWEEN Database and the get http header Input
})

//test case: failure get profile authorization
test('get profile fail for user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// test case: success delete account authorization
test('delete account success', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

//test case: failure delete account authorization
test('delete account fail', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
//test upload avatar
test('should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // set the authorization of header to Bearer token
        .attach('avatar', 'tests/fixtures/profile-pic.jpg') // take 2 arguments, both are string, the first is file we upload and the second is path
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // dont use toBe in this case because toBe use === operator to compare, toEgual use algorithm behind the scene, expect.any(constructor) matches
                                                    // anything that was created with the given constructor
})

//test update valid user fields
test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'John Maskus',
            age: 35
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('John Maskus')
    expect(user.age).toBe(35)
})

//test update invalid user fields
test('should not upadate invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 54,
            location: 'Stuttgart'
        }).expect(400)
})
