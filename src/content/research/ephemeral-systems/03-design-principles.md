---
document: "ephemeral-systems"
chapter: 3
chapterTitle: "Design Principles"
publishDate: 2026-03-05
estimatedReadMinutes: 8
---

## Principle 1: Separate intent from execution

The control plane should represent durable intent, while workers execute transiently. This seems obvious but is frequently violated when runtime instances become accidental sources of truth. Any value needed for future correctness must be persisted in a system with explicit durability guarantees.

## Principle 2: Treat freshness as a first-class contract

Ephemeral systems fail when components disagree on how recent data must be. Freshness should be described with measurable windows (for example, policy cache TTL, token lifetime, and reconciliation intervals). A design without explicit freshness budgets is effectively undefined.

## Principle 3: Prefer verifiable joins over local certainty

A single service may believe a request is valid, but platform trust depends on cross-system verifiability. Every major decision should emit references that can be joined later: request IDs, principal IDs, policy version IDs, and timestamp boundaries. This enables forensic reconstruction without relying on memory or best effort logs.

## Principle 4: Build for replacement, not recovery

In host-centric systems, recovery often means repairing the host. In ephemeral systems, repairing is usually slower and riskier than replacing. Design components so replacement is safe and cheap. Recovery should focus on data and control continuity, not process longevity.

## Principle 5: Enforce bounded autonomy

Teams need autonomy, but unrestricted autonomy creates policy fragmentation. Platform contracts should define what teams can vary locally (timeouts, retry budgets, optional claims) and what must remain globally consistent (identity anchors, audit formats, tenant boundaries).

## Principle 6: Make degradation policy-driven

When dependencies fail, behavior should follow explicit degradation policies: fail closed for privileged actions, fail open only for low-risk read paths with traceable exceptions, and always emit markers for deferred review. Silent fallback is not resilience; it is hidden risk.

## Principle 7: Design for human operability

Systems are operated by people under pressure. Error surfaces must map to actionable ownership domains. If an on-call engineer cannot answer "who owns this decision path" within minutes, the architecture is operationally expensive, regardless of theoretical elegance.

These principles are used in later chapters to evaluate control-plane contracts, data-plane execution patterns, and trust boundaries.
