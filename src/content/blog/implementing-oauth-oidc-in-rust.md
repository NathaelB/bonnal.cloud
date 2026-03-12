---
title: "Implementing OAuth2 & OIDC in Rust - What I learned bulding FerrisKey"
description: "A deep dive into the implementation of OAuth2 and OpenID Connect in Rust, sharing insights and lessons learned from building FerrisKey, an open-source IAM system."
publishDate: 2026-03-12
links:
  - label: "FerrisKey GitHub"
    href: "https://github.com/ferriskey/ferriskey"
  - label: "FerrisKey Website"
    href: "https://ferriskey.rs"
tags:
  - rust
  - oauth2
  - oidc
  - iam
  - security
  - architecture
  - open-source
  - ferriskey
draft: false
---
There's a moment, when you start building an IAM system from scratch, where you realize that OAuth2 is not a protocol. It's a family of protocols, loosely held together by a set of RFCs that leave a surprising amount of room for interpretation. Add OpenID Connect on top, mix in PKCE, JWT validation, and key rotation, and you quickly understand why most teams just reach for Keycloak and move on.

I didn't move on. Instead, I built FerrisKey, an open-source IAM written in Rust. This article is not a tutorial. It's an attempt to articulate why OAuth2 and OIDC are worth understanding deeply, and why Rust, in particular, is one of the most coherent choices you can make when building identity infrastructure.

## Why OAuth2 and OIDC, and why they're harder than they look

OAuth2 solves a problem that sounds simple: how do you let an application act on behalf of a user, without giving that application the user's password? The answer is delegated authorization through short-lived tokens, is elegant in principle. In practice, implementing it correctly requires getting a lot of small things right simultaneously.

The spec defines several flows, each designed for a specific trust context, The Authorization Code flow is built for user-facing applications: the user authenticates, the server issues a short-lived code, the application exchanges that code for a token. Client Credentials is built for machine-to-machine communication,: a service authenticates directly with its own credentials, no user involved. Each flow has different security properties, different attack surfaces, and different implementation requirements.

OpenID Connect builds on top of OAuth2 and adds the concepts of identity. Where OAuth2 answers "what is this client allowed to do?", OIDC answers "who is the user?". The ID token, a signed JWT carrying claims about the authenticated user, is the concrete artifact that bridges authorization and authentication. Conflating the two is one of the most common mistakes in OAuth2 implementations, and it leads to subtle security issues that are hard to detect and easy to exploit.

What makes this genuinely hard is not the cryptography or the HTTP mechanics. It's the precision required. Exact `redirect_uri` matching. The correct error codes for each failure case. The right behavior when a PKCE verifier is missing. THe semantics of `state` and `nonce`. These details exist for good reasons, each one closes a specific attack vector and gettign any of them slightly wrong can undermine the security model entirely.

Reading RFC 6749, OpenID Connect Core 1.0, and RFC 7636 before writing a single line of code is not optional. I learned this the hard way.

## Why Rust is the right language for an IAM

Security-critical infrastructure has a short list of requirements that are genuinely non-negotiable: it must be correct, it must be fast, and it must be safe. Rust addresses all three in ways that most languages simply don't.

Memory safety is the obvious one. A significant portion of historical CVEs in security software including IAM systems trace back to memory corruption bugs: buffer overflows, use-after-free, null pointer dereferences. Rust eliminates this entire class of vulnerabilities at  compile time, without relying on a garbage collector. For a system that handles authentication tokens, user credentials, and signing keys, this is not a nice-to-have. It's a fundamental property.

But what surprised me more, building FerrisKey, was how mush Rust's type system and error handling model contribute to correctness at the protocol level. OAuth2 has a precise error taxonomy, `invalid_client`, `invalid_grant`, `unsupported_grant_type`, and others each with specific semantics. Rust's enums make in natural to model this exhaustively. The compiler will tell you if you've forgotten a case. You can't accidentally return the wrong error for  the wrong reason if the type system won't let you.

The explicit error propagation model also forces you do think about every failure path. In a language where errors are implicit or silently swallowed, it's easy to miss edge cases. In Rust, every operation that can fail requires you to handle that failure explicitly. For a protocol as detail-oriented as OAuth2, this is exactly the discipline you want the language to enforce.

Performance is the third pillar. Authentication sits on the critical path of almost every request in a modern application. Every login, every token validation, every API call that requires authorization depends on the IAM layer. Rust's performance is comparable to C and C++, with none of the memory safety trade-offs. FerrisKey can handle high request throughput without the latency spikes that JVM-based systems introduce through garbage collection pauses a real concern for systems where token validation happens at the edge, under load.

## Designing FerrisKey around these constraints
Understanding why OAuth2 and OIDC are hard, and why Rust is a good fit, shaped every architectural decision in FerrisKey.

The system is built on a hexagonal architecture. The domain layer encodes the protocol rules what makes an authorization code valid, what claims an ID token must carry, what constitutes a correct PKCE verification. It knows nothing about HTTP, databases, or JWT libraries. This separation means the protocol logic can be tested in complete isolation, and it also means the strictness of the spec lives in one place, not scattered across infrastructure concerns.

Multi-tenancy was the other foundational decision. FerrisKey is built around realms isolated namespaces that each carry their own clients, users, signing keys, and configuration. Every OAuth2 and OIDC flow is scoped to a realm. This isn't a feature that was added later, it's a constraint that shaped the data model, the routing, and the token validation logic from the beginning. Multi-tenancy is the kind of requirement that, if you defer it, forces you to rewrite half your system six months in.

Signing keys are per-realm and asymmetric. FerrisKey uses RS256, RSA signatures with SHA-256 rather than the simpler HMAC-based HS256. The reason is architectural: with RS256, the private key never leaves FerrisKey. Any external service can validate tokens using the public key exposed via the JWKS endpoint, without ever touching the signing secret. The trust model stays clean even as the number of services grows.


## What building this taught me
The honest answer is that OAuth2 and OIDC reward the people who take them seriously. The specs are long, the edge cases are real, and the consequences of getting things wrong in a security-critical system are severe. But the protocols are also well-designed. Every constraint exists for a reason, and understanding those reasons makes you a better architect, not a just better implementer.

Rust turned out to be a genuine match for this domain. Not because it makes OAuth2 easy, nothing makes OAuth2 easy, but because the language's constraints align well with the problem's constraints. Exhaustive error handling, memory safety, performance without trade-offs. These properties matter everywhere, but they matter most in infrastructure that sits at the foundation of your security model.

FerrisKey is still evolving. Device Code Flow, token revocation, and deeper policy integration are all on the roadmap. But the foundation is one I understand completely and in security software, that understanding is not a luxury. It's the point.

If you're curious about the implementation, the code is open source at [github ferriskey](https://github.com/ferriskey/ferriskey). Issues, PRs, and hard questions are all welcome.

<br>
<br>

---

<br>

*Authentication is only half the story. Once you know who the user is, the harder question begings: what they actually allowed to do? In the next article, I'll explore the authorization side, how standards like AuthZen and the PDP/PEP model are reshaping the way we think about policy enforcement, and how FerrisKey fits into that picture.*
