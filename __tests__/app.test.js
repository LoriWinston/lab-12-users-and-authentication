require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    const todos = {
      'id': 4,
      'task': 'TEST',
      'completed': false,
      'user_id': 2 
    };

    const dbTodos = {
      ...todos,
      user_id: 2 };

    test('create a todos', async() => {

      const todos = 
          {
            'task': 'TEST',
            'completed': false,
            'userId': 1,
          };
  
      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(todos)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual(dbTodos);
    });
  
  
  
    test('returns todo for one user', async() => {
  
      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual([dbTodos]);
    });
  
    test('returns todo for one user with an ID', async() => {
  
      const data = await fakeRequest(app)
        .get('/api/todos/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body);
      expect(data.body).toEqual(dbTodos);
      const nothing = await fakeRequest(app)
        .get('/api/todos/1')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(nothing.body).toEqual('');
    });

    
    test('updates todos 4', async() => {

      const updatedTodo = 
          {
            'task': 'TEST',
            'completed': true,
            'user_id': 2,
          };
      const updatedDbTodos = {
        ...updatedTodo,
        user_id: 2,
        'id': 4
      };
  
      const data = await fakeRequest(app)
        .put('/api/todos/4')
        .send(updatedTodo)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual(updatedDbTodos);
    });
  
  
  });
});
