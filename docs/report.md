# Sandpiles

Project for the course _Applicazioni e Servizi Web_

Andrea Biagini - 0001145679 <andrea.biagini5@studio.unibo.it>

Filippo Gurioli - 0001146182 <filippo.gurioli@studio.unibo.it>

Leonardo Randacio - 0001125080 <leonardo.randacio@studio.unibo.it>

<!-- TODO PUT DELIVERY DATE HERE -->

## Introduction

_Sandpiles_ is a project designed to emulate the functionality of online board game platforms, providing an interactive and competitive environment for players of all skill levels to play _Sandpiles_. The platform offers real-time matchmaking, AI-driven opponent, statistics review and match history review.

The _Sandpiles_ game is based on the [Abelian sandpiles mathematical model](https://en.wikipedia.org/wiki/Abelian_sandpile_model). It sees two players face each other head to head in a strategic game with time constrains.

Developed with a focus on usability, performance, and scalability, _Sandpiles_ aims to demonstrate best practices in web application development while delivering an engaging and accessible game experience.

## Requirements

During project analysis the following requirements have been identified.

### Functional Requirements

#### User Functional Requirements

The user can:

1. User authentication
   1. Register a new account on the website
   1. Login to the website using an existing account
   1. Logout from the website
1. Profile
   1. View profile statistics
   1. View profile game history
      1. Review old games move by move
   1. Customize profile settings
      1. Load a custom profile picture
      1. Set the website theme
      1. Change profile name
      1. Change profile password
      1. Customize the game board style choosing from some given styling options
1. Game
   1. As a logged in user
      1. Play a ranked game against other users of similar rating
      1. Play an unranked game against an AI opponent
   1. As a guest user
      1. Play an unranked game against an AI opponent
   1. Gameplay
      1. Add a grain to a controller pile
      1. View opponents moves
      1. View personal and opponent clock time remaining
      1. Resign the current game
      1. Disconnect from the current game
1. View the website leaderboard
1. View a tutorial on _Sandpiles_ game rules
1. Developers
   1. Use the public API to access data about players and games, in an authenticated manner
   1. Find the public API documentation on the _Sandpiles_ website

#### System Functional Requirements

- usare jwt?
- gestione dati sensibili (hashing locale, salt in db, conferma e-mail)

1. Security
   1. Password hashing client side
   1. Matching double password input at registration time
   1. Matching double password input at password change time
   1. Hashed password storage with salting server side
   1. Profile confirmation with e-mail
1. User session handling
1. Badge system handling to encourage user retention

### Non-Functional Requirements

1. Responsive UI: The website interface adapts to the user's device to allow identical use across devices
1. AI opponent responds to the user's moves in under a second
1. Intuitive UI design allows users to interact with the website intuitively

### Implementation Requirements

1. MEVN
   1. MongoDB database technology
   1. Express.js backend technology
   1. Vue.js frontend technology
   1. Node.js runtime environment
1. Logical programming language for game AI

## Design

### Mockup

### Detailed Design

## Architecture

Design dell’architettura del sistema e delle interfacce utente.
Figure 1: Death Star
0.4

## Technologies

Tecnologie adottate e motivazioni.
0.5

## Code

Solo aspetti rilevanti.
0.6

## Tests

Test effettuati sul codice e test con utenti.
10.7

## Deployment

Rilascio, installazione e messa in funzione.
0.8

## Conclusioni

Conclusioni
