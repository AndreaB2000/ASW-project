# Pages flow

```mermaid
flowchart TD
    A@{ shape: circle, label: "Start" } -->|auto login| Play(Play)
    A@{ shape: circle, label: "Start" } --> Landing(Landing)
    Landing <--> Login(Login)
    Landing <--> Register(Register)
    Landing <--> Tutorial(Tutorial)
    Landing -->|play bot| Match
    Register -->|registration completed| Login
    Login --> Play
    Play <--> Tutorial(Tutorial)
    Play <-->|play online| MatchMaking(Match Making)
    Play -->|play bot| Match
    Play <--> Profile(Profile)
    Tutorial -->|play online| MatchMaking
    Tutorial -->|play bot| Match
    MatchMaking -->|opponent found| Match(Match)
    Match -->|quit| Play
    Match -->|game over| GameEnd("Game End (stats)")
    GameEnd -->|play again| Match
    GameEnd --> Play
    GameEnd --> Leaderboard
    GameEnd <--> Profile
    Leaderboard <--> Profile
    Profile <--> MatchHistory(Match History)
    MatchHistory <--> Replay(Replay)
```
