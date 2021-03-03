const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');

const { secret } = require('../lib/config');
const RefreshToken = require('../models/token');

async function issueTokenPair(userId) {
  const newRefreshToken = v4();

  await new RefreshToken({
    token: newRefreshToken,
    userId
  }).save();

  return {
    token: jwt.sign({ id: userId }, secret, { expiresIn: '10m' }),
    refreshToken: newRefreshToken,
  };
}

module.exports = issueTokenPair;
