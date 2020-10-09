module.exports = {
  development: {
    username: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_NAME'] || 'easyline',
    host: process.env['DB_HOST'] || 'easyline.cxwmdgol7owi.us-east-2.rds.amazonaws.com',
    dialect: process.env['DB_DIALECT'] || 'postgres',
    schema: process.env['DB_SCHEMA'] || 'public',
  }
}
