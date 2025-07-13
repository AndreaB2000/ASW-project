# SandPiles

*Place your grains. Tip the balance. In this world of unstable equilibrium, every move can trigger a chain reaction. Conquer the board one avalanche at a time.*

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=bugs)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AndreaB2000_ASW-project&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=AndreaB2000_ASW-project)

An online multiplayer turn-based strategy game based on the mathematical **[Abelian sandpile model](https://en.wikipedia.org/wiki/Abelian_sandpile_model)**, developed for "Applicazioni e Servizi Web" and "Software Process Engineering" exams at UniBo's Computer Science Master Degree courses.

## Table of Contents
- [Documentation](#-documentation)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Running the System](#-running-the-system)
- [Development](#-development)
- [License](#-license)

## Documentation

Full technical documentation and academic report available here: [Report](./docs/report.md)

## Features

- Competitive matches
- Matches against bot
- Login to save your progress
- Leaderboard to check your skill level

## Tech Stack  
**Frontend**  
- Vue.js + TypeScript
- SCSS
- MDBootstrap

**Backend**  
- Node.js + Express  
- Socket.IO  
- MongoDB
- Prolog bot

**DevOps**  
- Docker containerization
- SonarCloud
- GitHub Actions CI/CD

## Installation

1. **Prerequisites**:  
   - Node.js v20+
   - Docker (for production)
1. Install dependencies:  
   ```bash
	npm install
	```
1. Configure environment:
	- Create a `.env` file in the root directory containing: DB_NAME, DB_APP_USERNAME, DB_APP_PASSWORD, DB_ADMIN_USERNAME, DB_ADMIN_PASSWORD, JWT_SECRET, JWT_EXPIRATION.

## Running system

The system can be executed locally, using the following commands:

```sh
npm run build && npm start
```

and the client can be accessed from `http://localhost:4173`.

It can also be started using Docker, by running the following commands:

```sh
npm run build:docker && npm run start:docker
```

and accessing the client using `https://172.0.0.11`.

## Contributing

## License

MIT Licensed - See [LICENSE](./LICENSE) for details.
