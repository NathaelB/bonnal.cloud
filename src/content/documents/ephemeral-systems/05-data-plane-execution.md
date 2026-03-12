---
document: "ephemeral-systems"
chapter: 5
chapterTitle: "Data Plane Execution"
publishDate: 2026-03-05
estimatedReadMinutes: 8
---

## Execution model

The data plane should be optimized for deterministic behavior under churn. Instances appear and disappear constantly, so correctness cannot depend on warm memory, singleton placement, or manual intervention.

A reliable data-plane request path usually contains:

- identity validation
- policy evaluation (local or remote)
- resource action
- decision telemetry emission

Each step must have bounded latency and explicit fallback behavior.

## Local versus remote evaluation

Policy checks can run locally (embedded engine) or remotely (central PDP). Local checks reduce latency and improve availability but require disciplined distribution and freshness controls. Remote checks centralize policy consistency but introduce dependency coupling.

A hybrid model is common:

- local evaluation for hot-path authorization
- remote evaluation for sensitive or infrequent decisions
- periodic attestation to ensure local engines run approved policy versions

## Startup and readiness

Ephemeral workers should not become ready until minimal trust dependencies are in place. That includes bootstrapped identity, trusted root material, and initial policy snapshot where needed. "Ready" should mean "safe to serve," not merely "process started".

## Retry and backpressure

In transient environments, retries can become coordinated failure amplifiers. Retrying policy calls from thousands of short-lived workers can overload central systems quickly. Use bounded retry budgets, jittered schedules, and circuit-breaking linked to policy-defined risk levels.

## Idempotency requirements

Since restarts are frequent, idempotency must be default. External side effects (writes, notifications, billing events) should be keyed by deterministic operation IDs. If this is missing, ephemeral re-execution causes duplicate outcomes.

## Deployment implications

Canary and blue/green strategies remain useful, but evaluation criteria should include policy freshness and identity bootstrap success, not just HTTP error rate. A deployment is not healthy if requests succeed while authorization evidence is missing.

## Operational heuristic

When debugging a data-plane anomaly, ask three questions in order:

1. Which identity was asserted?
2. Which policy version was evaluated?
3. Which side effect was emitted and where recorded?

This sequence usually shortens mean-time-to-diagnosis in high-churn platforms.
