let res = [
  db.createCollection('users'),
  db.createCollection('refreshTokens'),
  db.createCollection('fuqs'),
  db.users.insert({ login: 'admin', password: '$2a$10$N9afmAJx.qctOQw5wipyde4L16G6.SJKCHFB3LfVIYukV1LAD/RPO', deleted: false }),
];

printjson(res);
