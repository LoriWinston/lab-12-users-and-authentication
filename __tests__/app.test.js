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
      'id': 3,
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
            'todos': 'TEST',
            'completed': false,
            'userId': 1,
          };
  
      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(todos)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.text).toEqual(dbTodos);
    });
  
  
  
    test('returns todo for one user', async() => {
  
      const data = await fakeRequest(app)
        .get('/api/todo')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual([dbTodo]);
    });
  
    test.only('returns todo for one user with an ID', async() => {
  
      const data = await fakeRequest(app)
        .get('/api/todos/3')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body);
      expect(data.text).toEqual(dbTodos);
      const nothing = await fakeRequest(app)
        .get('/api/todos/1')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(nothing.text).toEqual('');
    });
  
  
  });
});
