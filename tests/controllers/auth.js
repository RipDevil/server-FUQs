const test = require('ava');
const agent = require('supertest-koa-agent');
const { hashSync } = require('bcryptjs');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createApp = require('../../src');
const User = require('../../src/models/user');
const RefreshToken = require('../../src/models/token');
const issueToken = require('../helpers/issueToken');

const app = agent(createApp());

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

  await User.insertMany(
    [1, 2, 3, 4, 5].map((item) => ({
      login: `${item}`,
      password: hashSync(`${item}`),
    })),
  );

  await RefreshToken.insertMany([
    ...[1, 2, 3, 4, 5, 6].map((item) => ({
      userId: `${item}`,
      token: `REFRESH_TOKEN_${item}`,
    })),
    ...[
      {
        userId: 7,
        token: '7_1',
      },
      {
        userId: 7,
        token: '7_2',
      },
      {
        userId: 7,
        token: '7_3',
      },
      {
        userId: 8,
        token: '8_1',
      },
      {
        userId: 8,
        token: '8_2',
      },
    ],
  ]);
});

test.serial('User can successfully login', async (t) => {
  const res = await app.post('/auth/login').send({
    login: '1',
    password: '1',
  });

  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');

  const refreshRes = await app.post('/auth/refresh').send({
    refreshToken: res.body.refreshToken,
  });

  t.is(refreshRes.status, 200);
  t.truthy(typeof refreshRes.body.token === 'string');
  t.truthy(typeof refreshRes.body.refreshToken === 'string');
});

test.serial('User gets 403 on invalid credentials', async (t) => {
  const res = await app.post('/auth/login').send({
    login: 'INVALID',
    password: 'INVALID',
  });

  t.is(res.status, 403);
});

test.serial('User receives 401 on expired token', async (t) => {
  const expiredToken = await issueToken({ id: 1 }, { expiresIn: '1ms' });
  const res = await app.get('/admin').set('Authorization', `Bearer ${expiredToken}`);

  t.is(res.status, 401);
});

test.serial('User can get new access token using refresh token', async (t) => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_1',
  });

  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');
});

test.serial('User get 404 on invalid refresh token', async (t) => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'INVALID',
  });

  t.is(res.status, 404);
});

test.serial('User can use refresh token only once', async (t) => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_2',
  });

  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');

  const usedTokenRes = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_2',
  });

  t.is(usedTokenRes.status, 404);
});

test.serial('Refresh tokens become invalid on logout', async (t) => {
  const token = await issueToken({ id: 7 });
  await app.post('/auth/logout').set('Authorization', `Bearer ${token}`);

  const res = await app.post('/auth/refresh').send({
    refreshToken: '7_1',
  });

  t.is(res.status, 404);

  const refreshTokens = await RefreshToken.find({ userId: 7 });

  t.is(refreshTokens.length, 0);
});

test.serial('Multiple refresh tokens are valid', async (t) => {
  const firstLogin = await app.post('/auth/login').send({
    login: '5',
    password: '5',
  });

  const secondLogin = await app.post('/auth/login').send({
    login: '5',
    password: '5',
  });

  t.is(firstLogin.status, 200);
  t.is(secondLogin.status, 200);

  const firstLoginRefresh = await app.post('/auth/refresh').send({
    refreshToken: firstLogin.body.refreshToken,
  });

  t.is(firstLoginRefresh.status, 200);
  t.truthy(typeof firstLoginRefresh.body.token === 'string');
  t.truthy(typeof firstLoginRefresh.body.refreshToken === 'string');

  const secondLoginRefresh = await app.post('/auth/refresh').send({
    refreshToken: secondLogin.body.refreshToken,
  });

  t.is(secondLoginRefresh.status, 200);
  t.truthy(typeof secondLoginRefresh.body.token === 'string');
  t.truthy(typeof secondLoginRefresh.body.refreshToken === 'string');
});

test.after.always(async (t) => {
  mongoose.disconnect()
  mongod.stop()
});