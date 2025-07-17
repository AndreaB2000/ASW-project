---
title: Sandpiles
subtitle: Project for Software Process Engineering
author:
- Filippo Gurioli
- Andrea Biagini
---

# The project

Sandpiles is a multiplayer online game based on the [**abelian sandpiles math model**](https://en.wikipedia.org/wiki/Abelian_sandpile_model).

The system consists of a **frontend** written in TypeScript (using Vue.js), and a **backend** written in TypeScript, which uses a Prolog ruleset.

Components can be hosted locally for debug purposes, or they can be launched through Docker Compose.

---

# Main concepts

- **DevOps** approach
- **Domain Driven Design**
- Multi platforms exploitation
- Use of **Docker**
- **Git** configuration

---

# DevOps approach

- Build automation
- Quality control
- License
- CI/CD
- Software versioning

---

# DevOps approach
## Build automation

Given the nature of the project, it has been chosen to use NPM, which serves as dependency manager, build, test, and run tool.

The main NPM project is divided into the two subprojects *backend* and *frontend*.

## Quality control

Quality control has been done using SonarCube, a platform that calculates coverage and detects critical aspects of the code, such as bugs, code smells, duplicated lines and technical debt.

The quality check is performed after a push on the main branch.

The ESLint tool has also been used to check the code style.

### Code testing

The *backend* part has been widely unit-tested, to make sure good stability and reliability of the code.

## License

The project is covered by the **MIT license**, granting free redistribution under any other license.

---

# Build automation
## CI/CD

Continuous integration and continuous delivery have been achieved using GitHub actions.

### Pipeline

- build + test
- coverage (SonarCube)
- sign + release (NPM, Docker, GitHub)
    - only for the main branch
- send notification

### Automated evolution

- renovate Bot has been used to automatically update dependencies.

### Issue reporting

- It has been created a template for:
    - bug reports
    - feature requests
    - pull requests

---

# Domain Driven Design

- Domain glossary
- Context map
- Ubiquitous language
- Hexagonal architecture

---

# Multiplatform exploitation

Prolog has been used to model the bot playing against the user through a set of rules.

Rules are parsed and interpreted by the *Tau Prolog* TypeScript library.

---

# Use of Docker

Docker has been used to execute the system for production purposes. The project generates two Docker images, one serving the client and one serving the server.

Docker Compose is also used to orchestrate the execution: 4 services are instantiated as containers: *nginx*, *database*, *server* and *client*.

In particular, the client Dockerfile is based on a multi-stage build.

---

# Git configuration
## Branches
The project adheres to the [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) with a little customization. Repository contains:

- a **main** branch, for releases
- a **dev** branch, to test implemented features
- some secondary **feat** or **refactor** branches, to handle single functionalities

Every secondary branch is merged into the *dev* branch first, to check the integration between them. If all tests pass, the work-in-progress version on the *dev* branch is merged on the *main* branch.

The "rebase" strategy has been used.

## Commits

Commits has to adhere to [**conventional commits**](https://www.conventionalcommits.org/en/v1.0.0/) rules. This concept is guaranteed by two git hook checking the commit message and changing the automatic merge message.

