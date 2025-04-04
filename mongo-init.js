db = db.getSiblingDB(process.env.DB_NAME);

db.createUser({
  user: process.env.DB_APP_USERNAME,
  pwd: process.env.DB_APP_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.DB_NAME }],
});
