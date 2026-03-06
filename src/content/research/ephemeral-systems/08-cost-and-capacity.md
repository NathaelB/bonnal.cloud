---
document: "ephemeral-systems"
chapter: 8
chapterTitle: "Cost and Capacity"
publishDate: 2026-03-05
estimatedReadMinutes: 7
---

## Cost model shift

Ephemeral systems change the cost profile from stable baseline to burst-heavy variability. Compute may appear cheaper per unit, but control-plane load, identity issuance, telemetry, and cache invalidation can dominate operational costs if unbounded.

## Capacity planning dimensions

Capacity planning should include at least four independent curves:

1. request throughput
2. identity issuance/refresh volume
3. policy distribution fan-out
4. telemetry ingestion and query load

Ignoring any one curve creates hidden saturation points.

## Hot-path budgeting

Every request path should have a "trust budget" in milliseconds. Example allocation:

- identity verification: 5-15 ms
- authorization check: 3-10 ms local or 10-40 ms remote
- telemetry emission (async): near-zero blocking

These budgets force explicit tradeoffs between strictness and latency.

## Caching economics

Caching reduces cost but introduces staleness risk. A useful approach is tiered cache policy:

- short TTL for high-risk privileges
- medium TTL for standard tenant actions
- longer TTL for low-risk read-only paths

Cache invalidation events should be measured as first-class platform traffic, not side effects.

## Multi-tenant fairness

Autoscaling can hide noisy-neighbor problems temporarily, but fairness requires policy. Rate and concurrency limits should be tenant-aware and service-aware. Otherwise, one tenant's burst can consume shared policy evaluation or identity issuance capacity.

## Spend observability

Link cost metrics to engineering domains:

- cost per decision type
- cost per tenant tier
- cost per policy rollout
- cost of degraded mode events

These views help teams optimize architecture, not only cloud invoices.

## Practical optimization order

When reducing costs, the best order is:

1. remove redundant decision calls
2. reduce high-cardinality telemetry where not needed
3. optimize token refresh cadence
4. right-size control-plane fan-out and polling intervals

Premature micro-optimizations in worker code rarely produce the largest gains.
