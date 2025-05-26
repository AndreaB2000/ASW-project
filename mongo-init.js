db = db.getSiblingDB(process.env.DB_NAME);

db.createUser({
  user: process.env.DB_APP_USERNAME,
  pwd: process.env.DB_APP_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.DB_NAME }],
});

// TODO REMOVE THIS
// Insert guest account for temp guest access
db.account.insertOne({
  username: 'guest',
  email: 'guest@guest.com',
  password: '$2b$10$Hvp.5Kj.YZp1mBa1agY7WuvcM8I4X.GUKFrNg6SkPJzXJMZFLuETW', // hashed version of "test"
  rating: {
    value: 1500,
  },
});

// Insert test accounts with pre-hashed passwords
// TODO ADD CORRECT HASHES
db.Account.insertMany([
  {
    username: 'test',
    email: 'test1@example.com',
    // hashed version of "test" hashes do not work couse duh
    password: '$2b$10$Hvp.5Kj.YZp1mBa1agY7WuvcM8I4X.GUKFrNg6SkPJzXJMZFLuETW',
    rating: {
      value: 1500,
    },
  },
  {
    username: 'user',
    email: 'user@example.com',
    // hashed version of "test" hashes do not work couse duh
    password: '$2b$10$Hvp.5Kj.YZp1mBa1agY7WuvcM8I4X.GUKFrNg6SkPJzXJMZFLuETW',
    rating: {
      value: 1500,
    },
  },
  {
    username: 'beginner',
    email: 'beginner@example.com',
    // hashed version of "test" hashes do not work couse duh
    password: '$2b$10$Hvp.5Kj.YZp1mBa1agY7WuvcM8I4X.GUKFrNg6SkPJzXJMZFLuETW',
    rating: {
      value: 1200,
    },
  },
  {
    username: 'expert',
    email: 'expert@example.com',
    // hashed version of "test" hashes do not work couse duh
    password: '$2b$10$Hvp.5Kj.YZp1mBa1agY7WuvcM8I4X.GUKFrNg6SkPJzXJMZFLuETW',
    rating: {
      value: 1800,
    },
  },
]);

print('Populated database with accounts');

// Insert test matches between existing accounts
db.Match.insertMany([
  {
    // A completed match where expert won against beginner
    player1: 'expert',
    player2: 'beginner',
    creationDate: new Date('2025-05-10T14:30:00Z'),
    initialState: {
      height: 9,
      width: 9,
      state: Array(9)
        .fill()
        .map((_, row) =>
          Array(9)
            .fill()
            .map((_, col) => ({
              pile:
                row === 2 && col === 2
                  ? { owner: 'expert', numberOfGrains: 3 }
                  : row === 6 && col === 6
                  ? { owner: 'beginner', numberOfGrains: 3 }
                  : null,
            }))
        ),
    },
    moves: [
      { x: 2, y: 2 }, // expert moves
      { x: 6, y: 6 }, // beginner moves
      { x: 3, y: 2 }, // expert moves
      { x: 5, y: 6 }, // beginner moves
      { x: 3, y: 3 }, // expert moves - wins by capturing all beginner's piles
    ],
  },
  {
    // An ongoing match between test and admin
    player1: 'test',
    player2: 'admin',
    creationDate: new Date('2025-05-20T09:15:00Z'),
    initialState: {
      height: 9,
      width: 9,
      state: Array(9)
        .fill()
        .map((_, row) =>
          Array(9)
            .fill()
            .map((_, col) => ({
              pile:
                row === 2 && col === 2
                  ? { owner: 'test', numberOfGrains: 3 }
                  : row === 6 && col === 6
                  ? { owner: 'admin', numberOfGrains: 3 }
                  : null,
            }))
        ),
    },
    moves: [
      { x: 2, y: 2 }, // test moves
      { x: 6, y: 6 }, // admin moves
      { x: 3, y: 2 }, // test moves - match is still in progress
    ],
  },
  {
    // A new match that just started between beginner and test
    player1: 'beginner',
    player2: 'test',
    creationDate: new Date('2025-05-22T18:45:00Z'),
    initialState: {
      height: 9,
      width: 9,
      state: Array(9)
        .fill()
        .map((_, row) =>
          Array(9)
            .fill()
            .map((_, col) => ({
              pile:
                row === 2 && col === 2
                  ? { owner: 'beginner', numberOfGrains: 3 }
                  : row === 6 && col === 6
                  ? { owner: 'test', numberOfGrains: 3 }
                  : null,
            }))
        ),
    },
    moves: [], // No moves yet - match just started
  },
]);

print('Populated database with matches');
