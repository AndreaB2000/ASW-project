# Architecture

```mermaid
---
config:
    class:
        hideEmptyMembersBox: true
---

classDiagram
    class MongoDB
    class Repository
    class Service
    class Controller
    class Factory
    class ValueObject
    class Entity
    class AggregateRoot

    MongoDB <|-- Repository
    Repository <|-- Service
    Service <|-- Controller
    Service <|-- Factory
    Factory <|-- ValueObject
    Factory <|-- Entity
    Factory <|-- AggregateRoot
```
