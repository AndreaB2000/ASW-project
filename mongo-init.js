db = db.getSiblingDB(process.env.DB_NAME);

db.createUser({
  user: process.env.DB_APP_USERNAME,
  pwd: process.env.DB_APP_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.DB_NAME }],
});

// TODO REMOVE THIS
// Insert guest account for temp guest access
db.accounts.insertOne({
  username: 'guest',
  email: 'guest@guest.com',
  password: '$2b$10$iMJk4DNZpa4iN0ZLUmmcaeTE4lz2YK8HjSCm9nR4zi9I2KbvgSSfC', // hashed version of "test"
  rating: {
    value: 1500,
  },
});

// Insert test accounts with pre-hashed passwords
db.accounts.insertMany([
  {
    username: 'test',
    email: 'test1@example.com',
    password: '$2b$10$iMJk4DNZpa4iN0ZLUmmcaeTE4lz2YK8HjSCm9nR4zi9I2KbvgSSfC', // hashed version of "test"
    rating: {
      value: 1500,
    },
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: '$2b$10$iMJk4DNZpa4iN0ZLUmmcaeTE4lz2YK8HjSCm9nR4zi9I2KbvgSSfC', // hashed version of "test"
    rating: {
      value: 1500,
    },
  },
  {
    username: 'beginner',
    email: 'beginner@example.com',
    password: '$2b$10$iMJk4DNZpa4iN0ZLUmmcaeTE4lz2YK8HjSCm9nR4zi9I2KbvgSSfC', // hashed version of "test"
    rating: {
      value: 1200,
    },
  },
  {
    username: 'expert',
    email: 'expert@example.com',
    password: '$2b$10$iMJk4DNZpa4iN0ZLUmmcaeTE4lz2YK8HjSCm9nR4zi9I2KbvgSSfC', // hashed version of "test"
    rating: {
      value: 1800,
    },
  },
]);

print('Populated database with accounts');

// Insert test matches between existing accounts
db.matches.insertMany([
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
              pile: row === 2 && col === 2 ? { owner: 'beginner', numberOfGrains: 3 } : {},
            }))
        ),
    },
    moves: [],
  },
  {
    // A completed match where expert won against beginner
    player1: 'expert',
    player2: 'beginner',
    creationDate: new Date('2025-05-11T14:30:00Z'),
    initialState: {
      height: 9,
      width: 9,
      state: Array(9)
        .fill()
        .map((_, row) =>
          Array(9)
            .fill()
            .map((_, col) => ({
              pile: row === 2 && col === 2 ? { owner: 'expert', numberOfGrains: 3 } : {},
            }))
        ),
    },
    moves: [],
  },
  {
    // A completed match where expert won against beginner
    player1: 'expert',
    player2: 'beginner',
    creationDate: new Date('2025-05-12T14:30:00Z'),
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
    // An ongoing match between test and user
    player1: 'test',
    player2: 'user',
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
                  ? { owner: 'user', numberOfGrains: 3 }
                  : null,
            }))
        ),
    },
    moves: [
      { x: 2, y: 2 }, // test moves
      { x: 6, y: 6 }, // user moves
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
