const test = require('ava');
const agent = require('supertest-koa-agent');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createApp = require('../../src');
const Fuq = require('../../src/models/fuq');
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

test.serial.before(
  'Should return an empty array on get random element if there are no elements in the DB 204',
  async (t) => {
    const res = await app.get('/fuq/');

    t.is(res.status, 204);
    t.deepEqual(res.body, {});
  },
);

test.serial.before(async () => {
  // applying some dummy data

  await Fuq.insertMany(
    [1, 2, 3, 4, 5].map((item) => ({
      title: `${item} Title`,
      text: `${item} text`,
    })),
  );
});

test.beforeEach((t) => {
  t.context.FAKE_ID = '123qwe123qwe';
});

test('Should return a random element that exists in the DB 200', async (t) => {
  const res = await app.get('/fuq/');

  t.is(res.status, 200);
  t.assert(res.body.title);
  t.truthy(Fuq.exists({ title: res.body.title }));
});

test('Should return a single element if ID param is provided 200', async (t) => {
  const fuqs = await Fuq.find({ title: '1 Title' });

  t.not(fuqs.legnth, 0);

  const res = await app.get(`/fuq/${fuqs[0]._id}`);

  t.is(res.status, 200);
  t.assert(res.body.title);
  t.truthy(Fuq.exists({ _id: res.body._id }));
});

test("Should return an error on get precise element if an element with provided id doesn't exist 204", async (t) => {
  const { FAKE_ID } = t.context;
  const res = await app.get(`/fuq/${FAKE_ID}`);

  t.is(res.status, 404);
  t.assert(res.body.error.message);
});

test('Should create an element in the DB 201', async (t) => {
  const FAKE_ELEMENT = {
    title: 'TEST_TITLE',
    text: 'TEST_TEXT',
  };

  const res = await app.put('/fuq/').send(FAKE_ELEMENT).set('Authorization', authLine);
  t.is(res.status, 201);
  t.is(res.body.title, FAKE_ELEMENT.title);
  t.is(res.body.text, FAKE_ELEMENT.text);
  t.truthy(Fuq.exists(FAKE_ELEMENT));
});

test('Should return an error on create if an element with the same params is presented in the DB 406', async (t) => {
  const fuqs = await Fuq.find({ title: '1 Title' });

  t.not(fuqs.legnth, 0);

  const randomFuq = fuqs[0];
  const res = await app
    .put(`/fuq/`)
    .send({ title: randomFuq.title, text: randomFuq.text })
    .set('Authorization', authLine);

  t.is(res.status, 406);
  t.assert(res.body.error.message);
});

test('Should return an error on create if there are no req params 400', async (t) => {
  const res = await app.put(`/fuq/`).set('Authorization', authLine);

  t.is(res.status, 400);
  t.assert(res.body.error.message);
});

test('Should update an element in the DB with presented params 200', async (t) => {
  const fuqs = await Fuq.find({ title: '2 Title' });

  t.not(fuqs.legnth, 0);

  const FAKE_ELEMENT = {
    title: 'title z',
    text: 'text z',
  };

  const res = await app.post(`/fuq/${fuqs[0]._id}`).send(FAKE_ELEMENT).set('Authorization', authLine);

  t.is(res.status, 200);
  t.truthy(await Fuq.exists(FAKE_ELEMENT));
});

test('Should return an error on update if there is no id parameter 405', async (t) => {
  const res = await app
    .post('/fuq/')
    .send({
      title: 'title z',
      text: 'text z',
    })
    .set('Authorization', authLine);

  t.is(res.status, 405);
});

test('Should return an error on update if there is no parameters 400', async (t) => {
  const fuqs = await Fuq.find({ title: '3 Title' });

  t.not(fuqs.legnth, 0);

  const res = await app.post(`/fuq/${fuqs[0]._id}`).set('Authorization', authLine);

  t.is(res.status, 400);
  t.assert(res.body.error.message);
});

test('Should return an error on update if there is no element with such id 404', async (t) => {
  const { FAKE_ID } = t.context;

  const res = await app.post(`/fuq/${FAKE_ID}`).set('Authorization', authLine);

  t.is(res.status, 404);
  t.assert(res.body.error.message);
});

test('Should delete an element with an id 200', async (t) => {
  const fuqs = await Fuq.find({ title: '4 Title' });

  t.not(fuqs.legnth, 0);

  const res = await app.delete(`/fuq/${fuqs[0]._id}`).set('Authorization', authLine);

  t.is(res.status, 202);
});

test('Should return an error on delete if there is no id parameter 405', async (t) => {
  const res = await app.delete('/fuq/').set('Authorization', authLine);

  t.is(res.status, 405);
});
