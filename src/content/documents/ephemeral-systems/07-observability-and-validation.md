---
document: "ephemeral-systems"
chapter: 7
chapterTitle: "Observability and Validation"
publishDate: 2026-03-05
estimatedReadMinutes: 8
---

## Observability goals

In high-churn systems, observability is not only for performance tuning. It is the main mechanism to validate trust and control assumptions. The target is not collecting more data, but collecting the _right correlated evidence_.

## Core telemetry dimensions

At minimum, each critical request should be traceable across:

- principal identity
- tenant scope
- policy version
- decision outcome
- side effect status

Missing one of these fields creates blind spots during incident analysis.

## Metrics that matter

Traditional availability metrics remain necessary, but ephemeral systems need additional metrics:

- policy freshness lag
- token issuance latency and error rate
- authorization fallback rate
- unresolved decision traces
- control-plane to data-plane convergence delay

These indicators reveal trust degradation before user-visible outages appear.

## Distributed tracing strategy

Trace sampling should be adaptive. For routine requests, low sampling is acceptable. For denied decisions, privileged operations, and fallback paths, sampling should increase or become mandatory. This supports forensic depth without uncontrolled telemetry costs.

## Continuous validation loops

Validation should run continuously, not only in pre-production. Useful loops include:

1. synthetic authorization probes per tenant class
2. policy shadow evaluations against live traffic
3. periodic replay of recent decision traces against current policy versions

Replay analysis is particularly valuable to detect semantic drift after policy refactors.

## Reporting for humans

Dashboards should map to ownership domains. A product team needs service-level decision health; a platform team needs control-plane distribution health; a security team needs cross-tenant anomaly views. One dashboard for all audiences generally serves none.

## Evidence retention

Ephemeral execution demands thoughtful retention strategy. Raw telemetry may be short-lived, but decision evidence for compliance-critical paths should be retained longer with immutable storage controls. Retention policy should follow risk tier, not default storage limits.

## Validation outcome

A system is considered observable when teams can answer, with evidence, why a specific action was allowed or denied, which policy version influenced the decision, and how quickly that policy reached all relevant execution nodes.
