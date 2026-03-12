---
document: "ephemeral-systems"
chapter: 9
chapterTitle: "Failure Modes and Recovery"
publishDate: 2026-03-05
estimatedReadMinutes: 9
---

## Failure taxonomy

Failures in ephemeral platforms are often partial and time-dependent. A useful taxonomy separates:

- **trust failures**: invalid or missing identity, broken policy chain
- **consistency failures**: control and data planes disagree
- **capacity failures**: saturation of issuance, evaluation, or telemetry systems
- **operability failures**: inability to diagnose due to missing correlation

This taxonomy improves incident triage speed.

## Graceful degradation patterns

Not all failures should be treated equally. A policy decision dependency outage should not trigger the same behavior for a profile read and an admin privilege grant. Establish degradation classes:

1. fail closed (high-risk actions)
2. fail conditionally with compensating controls (medium risk)
3. fail open with audit marker (low-risk reads)

The class must be explicit in policy and tested regularly.

## Recovery objectives

Traditional RTO/RPO are still relevant, but ephemeral systems need additional recovery objectives:

- maximum policy freshness gap after incident
- maximum identity issuance delay
- maximum unresolved decision trace count

These metrics align recovery work with trust restoration, not only service uptime.

## Incident choreography

When an incident occurs, effective response often follows this sequence:

1. freeze risky rollout channels
2. establish known-good policy and identity baseline
3. contain tenant blast radius via scoped limits
4. restore decision path observability
5. reopen rollout channels progressively

Skipping step 4 is common and leads to recurrent incidents.

## Game days and rehearsal

Because behavior depends on many moving parts, failure drills are essential. Useful scenarios include:

- policy distribution lag in one region
- partial token issuer outage
- stale sidecar cache after forced rollout
- telemetry backend degradation during high traffic

Drills should validate both automation and human playbooks.

## Post-incident learning

A strong postmortem should answer:

- what invariant was violated
- why detection was delayed
- which contract lacked clarity
- what evidence was missing

This keeps remediation focused on architecture quality instead of individual blame.
