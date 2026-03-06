---
title: "Building FerrisKey: Why I Started an Open Source IAM in Rust"
description: "The story behind FerrisKey, an open-source Identity and Access Management system built in Rust, and the motivations that led to its creation."
publishDate: 2026-03-06
links:
  - label: "FerrisKey GitHub"
    href: "https://github.com/ferriskey/ferriskey"
  - label: "FerrisKey Website"
    href: "https://ferriskey.rs"
tags:
  - rust
  - iam
  - security
  - architecture
  - open-source
  - ferriskey
draft: false
---

## Introduction
Identity and Access Management systems are everywhere.
From SaaS platforms to internal enterprise tools, authentication and authorization have become critical
building blocks of modern software.

Yet, despite their importance, IAM solutions often feel heavy, complex, or difficult to extend.

After working extensively with authentication systems and cloud architectures, I started asking myself a
simple question:

> What would a modern IAM look like if we built it today ?

That question eventually led to the creation of **FerrisKey**, an open-source Identity and Access Management system written in Rust.

This article tells the story behind the project: the motivations, the architectural decisions, and the vision for a new generation of IAM systems.


## The Problem with Existing IAM Solutions

Many organizations rely on solutions such as:
- Keycloak
- Auth0
- Okta
- Ory
- Authentik
- and many others

These tools are powerful and battle-tested. However, in practice they often present several challenges.

### 1. Operational complexity

Running IAM systems at scale can quickly become complicated.

- heavy deployments
- difficult horizontal scaling
- complex configuration management
- dependency on large Java runtimes

For example, running a large IAM cluster often requries careful tuning and dedicated operational knowledge.

### 2. Limited extensibility
Customization is frequently needed in authentication systems.
Exemple include:

- custom login flows
- integration with external APIs
- context-based authentication
- advanced policy enforcement

In some systems, extending behavior requires writing plugins or extensions, sometimes in languages that are not commonly used by the engineering team.

### 3. Performance considerrations
Authentication systems sit on the critical path of most applications.
Every login, every token validation, every API call may depend on the IAM layer.

Even small inefficiencies can have a large impact at scale.


## Why Rust?

When designing FerrisKey, the choice of Rust was trivial.

Rust offers several advantages that make it particularly well suited for infrastructure software like IAM systems.

### Memory safety

Rust guarantees memory safety without relying on a garbage collector. This significantly reduces the risk of common security issues such as:
- memory corruption
- buffer overflows
- use-after-free bugs
For security-critical software like an IAM, this property is extremely valuable.

### Performance

Rust provides performance comparable to low-level languages like C or C++, while offering much stronger safety guarantees.

This allows FerrisKey to handle:
- high request throughput
- effciient token validation
- scalable authentication flows

### Reliability
Rust's type system encourages explicit error handling and robust design.
This leads to system that are more predictable and easier to reason about.



## Designing a Modern IAM

Rather than simply recreating an existing IAM, FerrisKey aims to explore what a modern architecture could look like.

Several principles guided the design:

### Hexagonal architecture
FerrisKey follows a hexagonale architecture, separating the system into distinct layers:
- Domain
- Application
- Infrastructure
This architecture helps maintain a clear separation between business logic and technical implementation details.

For example:
- the domain layer define identity concepts
- the application layer orchestrates use cases
- the infrastructure layer handles databases, HTTP APIs and integrations
This makes the system easier to test, evolve, and extend.


### Event-driven extensibility
Customization is a key requirement for IAM systems.

FerrisKey embraces an event-driven model, allowing external systems to react to authentication events.

Examples of events include:
- user created
- login attempt
- token issued
- password reset

This approach allows developers to build extensions without modifying the core system.


### Policy-driven authentication
Modern access control increasingly relies on policy engines.

FerrisKey explores the integration of policy-based authorization systems such as:
- OPA (Open Policy Agent)
- attribute-based access control (ABAC)
- contextual authentication rules
This allows authentication flows to adapt dynamically based on context.

## Building FerrisKey
FerrisKey started as an experimental project exploring IAM arhcitecture in Rust.

Over time, it evolved into a full platform including:
- authentication flows
- OAuth2 and OpenID Connect support
- Identity management
- extensibility mechanisms
- cloud-native deployment

The project also focuses heavily on modern infrastructure practices such as:
- containerized deployment
- Kubernetes integration
- cloud-native observability


## Open Source and Community
From the beginning, FerrisKey has been developed as an open-source project.

Open source plays a critical role in security software:
- transparency builds trust
- community contributions improve robustness
- shared knowledge accelerates innovation

The project has already attracted a growing community of contributors and users interested in exploring a Rust-based IAM solution.

## What's Next

FerrisKey is still evolving.

Future work includes:
- improved multi-tenant architecture
- advanced authentication mechanisms
- stronger policy engines
- better developer tooling
- cloud-native scalability improvements

The long-term goal is to build an IAM platform that is:
- secure
- extensible
- performant
- developer-friendly


## Conclusion
Identity and access management is one of the most critical components of modern software systems.

At the same time, it remains one of the most complex.

FerrisKey is an attempt to rethink how IAM systems can be designed using modern technologies and architectural principles.

By combining Rust, cloud-native design, and extensible authentication flows, the project explores what the next generation of IAM infrastructure could look like.

If you are interested in identity systems, cloud architecture, or Rust infrastructure projects, FerrisKey might be worth exploring.
