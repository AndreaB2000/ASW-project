# DevOps TODO

- generate the html doc file using typedoc

## Interesting things for express

- use ssl certificate enabling https

### Helmet Security https headers (DONE)

use helmet for security (<https://github.com/helmetjs/helmet>):

```js
import helmet from 'helmet';

const app = express();

app.use(helmet());
```

### Application-level middleware (DONE)

parses body of the request as json and makes it available in the req.body property

```typescript
app.use(express.json());
```

### Router-level middleware

```typescript
app.get('/users', (req, res, next) => {
  console.log('This runs for /users route');
  next(); // Pass to next middleware/route handler
});
```

### Error-handling middleware (DONE)

```typescript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

### Request validation

Exploits a library called `express-validator`

```typescript
const { body, validationResult } = require('express-validator');

router.post(
  '/users',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('age').isInt({ min: 18 }).withMessage('Age must be at least 18'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue with saving the user
  }
);
```

### CORS policies

Exploits the `cors` library

```typescript
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

// or

app.use(
  cors({
    origin: 'http://example.com', // Enable CORS for a specific origin
  })
);
```

### Static field serving (DONE)

If your Express app needs to serve static files (like images, CSS, JavaScript), you can use Express’s built-in middleware to handle this.

```typescript
app.use(express.static('public')); // Serve files from the "public" directory
```

### Logging (DONE)

Exploit `morgan` library

```typescript
const morgan = require('morgan');
app.use(morgan('tiny')); // Logs a concise output
```

### Rate limiting (DONE)

Exploit `express-rate-limit` library

```typescript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

## Remember To

- remove template README.md files around the project, or at least evaluate if they are needed.
- remove all "TODOS" from report.md

## Others

- Add catchy phrase in landing page: "Ogni granello conta: fai cadere la sabbia con strategia, osserva le cascate di reazioni a catena e scopri pattern sorprendenti!"
