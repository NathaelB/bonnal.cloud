---
document: "ephemeral-systems"
chapter: 2
chapterTitle: "Problem Definition"
publishDate: 2026-03-05
estimatedReadMinutes: 8
---

## The central contradiction

Teams often want both rapid change and strong guarantees. Rapid change favors replacing components frequently. Strong guarantees require continuity, traceability, and clear ownership. The contradiction appears when a short-lived runtime must still satisfy long-lived obligations: compliance evidence, tenant isolation, reproducibility, and incident explainability.

In practice, incidents in ephemeral architectures are rarely caused by one catastrophic fault. They emerge from _coordination failures_: stale policy caches, drift between desired and observed state, missing causal traces, and ambiguous ownership between platform and product teams.

## Observed failure patterns

From postmortems in high-churn environments, several patterns repeat:

- **Identity drift**: runtime identity no longer matches policy assumptions due to stale issuance paths.
- **Configuration ghosting**: old configuration remains active in sidecars or local caches after control-plane updates.
- **Unbounded retries**: ephemeral workers retry independently, creating overload amplification.
- **Fragmented evidence**: logs exist but cannot be joined reliably across instances and time windows.
- **Policy ambiguity**: teams cannot tell whether a denied request was due to authn, authz, quota, or dependency failures.

Each pattern is a symptom of weak contracts between layers.

## Research objective

The objective of this document is not to propose one framework. Instead, it introduces a set of invariants and decision criteria. A solution is considered strong if it makes the following properties explicit:

1. Which states are authoritative.
2. How freshness is measured.
3. Where decisions are made and recorded.
4. How failures degrade safely.

## Non-goals

This text does not attempt to:

- prescribe a specific vendor stack
- optimize for single-service simplicity
- replace formal threat modeling

The target is multi-service platforms where teams independently ship software but depend on shared security and policy controls.

## Evaluation questions

To evaluate an architecture, we ask:

- Can a request decision be reconstructed after 30 days?
- Can credentials be rotated without synchronized deploys?
- Can one tenant's hot path degrade without cascading globally?
- Can policy changes be rolled out with bounded blast radius?

If the answer to any question is unclear, the architecture is likely under-specified for ephemeral operation.
