module.exports = {
  mode: process.env.NODE_ENV,
  port: process.env.PORT || 80000,
  mongoUri: process.env.DATABASE_URI || '',
  secret: process.env.SECRET || 'ZnVja2JpZGVu',
};
