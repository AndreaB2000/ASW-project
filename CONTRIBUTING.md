# Contribution Requirements

- All code must follow our ESLint rules for both [client](./src/client/eslint.config.ts) and [server](./src/server/.eslintrc.js)
- Code should be formatted using Prettier
- Write unit tests for all new server functionality
- All tests must pass (`npm test`)
- Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/)
- Pull requests must be reviewed before merge
- follow the project directory structure

```sh
project-root   # Build automation configuration files
└── src
    ├── client # Frontend code
    └── server # Backend code
```
