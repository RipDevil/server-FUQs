const test = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src');

const app = agent(createApp());

test('App works', async t => {
  const res = await app.get('/');
  t.is(res.status, 400);
});
