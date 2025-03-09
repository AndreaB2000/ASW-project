# Pages flow

```mermaid
flowchart TD
    A@{ shape: circle, label: "Start" } --> Home(Home)
    Home <--> Register(Register)
    Home <--> Login(Login)
    Home <--> Tutorial(Tutorial)
    Tutorial --> MatchMaking
    Tutorial -->|play bot| Match
    Home <-->|play online| MatchMaking(Match Making)
    Home <--> Leaderboard(Leaderboard)
    Home -->|play bot| Match
    MatchMaking -->|opponent found| Match(Match)
    Match -->|quit| Home
    Match -->|game over| GameEnd("Game End (stats)")
    GameEnd -->|play again| Match
    GameEnd --> Home
    GameEnd --> Leaderboard
    Home <--> Profile(Profile)
    Leaderboard <--> Profile
    GameEnd <--> Profile
    Profile <--> MatchHistory(Match History)
    MatchHistory <--> Replay(Replay)
```
