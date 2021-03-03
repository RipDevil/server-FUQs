const test = require('ava');
const agent = require('supertest-koa-agent');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { hashSync } = require('bcryptjs');

const createApp = require('../../src');
const User = require('../../src/models/user');
const issueToken = require('../helpers/issueToken');

const app = agent(createApp());
const authLine = `Bearer ${issueToken({ id: 1 })}`;

const mongod = new MongoMemoryServer();

test.serial.before(async () => {
  // Making a connection with memory-server
  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

test.serial.before(async () => {
  // applying some dummy data

  await User.insertMany([
    {
      login: 'Roman',
      password: hashSync('1'),
    },
    {
      login: 'Anastasia',
      password: hashSync('2'),
    },
    {
      login: 'Jeremy',
      password: hashSync('3'),
    },
  ]);
});

test.beforeEach((t) => {
  t.context.FAKE_ID = '123qwe123qwe';
});

test('Get 200 on users request', async (t) => {
  const res = await app.get('/users/').set('Authorization', authLine);

  t.is(res.status, 200);
  t.assert(res.body);
});

test('Get 200 on user request', async (t) => {
  const users = await User.find({ login: 'Anastasia' });

  t.not(users.legnth, 0);

  const res = await app.get(`/users/${users[0]._id}`).set('Authorization', authLine);

  t.is(res.status, 200);
  t.assert(res.body);
  t.truthy(User.findOne(res.body));
});

test('Get 404 when there is no such user', async (t) => {
  const { FAKE_ID } = t.context;

  const res = await app.get(`/users/${FAKE_ID}`).set('Authorization', authLine);

  t.is(res.status, 404);
  t.assert(res.body.error.message);
});

test('Get 200 and added user on add user', async (t) => {
  const NEW_USER = {
    login: 'Vasya',
    password: 'Zabubenskiy',
  };

  const res = await app.put('/users/').send(NEW_USER).set('Authorization', authLine);

  t.is(res.status, 201);
  t.assert(res.body);
  t.truthy(User.findOne({ login: NEW_USER.login, password: hashSync(NEW_USER.password) }));
});

test('Get 400 when no params are presented', async (t) => {
  const res = await app.put('/users/').set('Authorization', authLine);

  t.is(res.status, 400);
});

test('Get 406 if user with the same login exists', async (t) => {
  const users = await User.find({ login: 'Jeremy' });

  t.not(users.legnth, 0);

  const res = await app
    .put('/users/')
    .send({ login: users[0].login, password: 'FAKE_PASSWORD' })
    .set('Authorization', authLine);

  t.is(res.status, 406);
  t.assert(res.body.error.message);
});

test('Get 202 on successfull deletion', async (t) => {
  const users = await User.find({ login: 'Roman' });

  t.not(users.legnth, 0);

  const res = await app.delete(`/users/${users[0]._id}`).set('Authorization', authLine);

  t.is(res.status, 202);
});

test('Get 405 when there is no id parameter', async (t) => {
  const res = await app.delete('/users/').set('Authorization', authLine);

  t.is(res.status, 405);
});
