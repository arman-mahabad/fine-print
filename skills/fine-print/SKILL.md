---
name: fine-print
description: Keep a software project honest about what actually works. Use when reporting project status, claiming a feature is done, writing a handover or release note, reviewing an AI agent's "it works" claim, or keeping a status file over weeks or months. Gives a six-step state ladder, an evidence ledger whose key column is "what it does NOT prove", a stop list, a no-silent-loss check for status rewrites, and a plain-English owner report.
---

# Fine Print

A page that renders is not a finished feature. A test that passed on your laptop says
nothing about production. A chat message where the owner says "looks good" proves a
decision, not behaviour. Fine Print is a small set of habits that keep those differences
written down, so a project's status file stays true across many sessions and many agents.

It came from a medical-education platform built almost entirely with Claude Code over
several months (see `examples/origin.md` in the repository).

## 1. Classify every feature on the ladder

Use these six states and no others:

| State | Means | Does NOT mean |
| --- | --- | --- |
| `not-built` | nothing exists | |
| `visual-only` | it renders, nothing behind it | that any data flows |
| `mock-backed` | works against fake or fixture data | that the real backend agrees |
| `live-local` | works against a real backend on the dev machine | hosted, concurrent or fast |
| `live-hosted` | works on the deployed system, checked there | that a real user has used it |
| `accepted` | the owner used it and said yes, recorded | that it is bug-free |

Rules:

- A feature climbs one step only with evidence for that step (section 2).
- When in doubt, pick the lower state. Downgrading is cheap; a false `live-hosted` costs weeks.
- Every claim about live behaviour names the configuration that produced it
  (for example "auth disabled, mock adapter").
- "In history" is not a feature. A migration that was applied, a component that was
  merged or a route that exists does not move a feature up by itself.

## 2. Keep an evidence ledger

One table, append only (`templates/evidence.md`):

```text
| Claim | Date | How observed | What it does NOT prove |
```

- **Date** is when it was observed, not when it was written down.
- **How observed** starts with an evidence class, then the transport and the identity:
  - `local`: tests or scripts on the dev machine
  - `hosted`: against a staging or hosted environment
  - `production`: against the public deployment, through its own client
  - `reported`: the owner saw it in a real session and told you
  - `chat`: the owner's own words, quoted. Proves a **decision** and nothing else
  - `tooling`: the agent harness allowed or refused something. Says nothing about the product
- **What it does NOT prove** is the point of the file. It is never empty and never
  "none". If a claim has no limit worth stating, it is too vague to be a row.
- Rows are never edited. A wrong row is marked `SUPERSEDED` and a new row is added.

Before repeating any claim from an earlier session, find its row and read its limit.

## 3. Respect the stop list

Some changes look obviously right and are exactly the ones that break proven work.
Keep a short, exact list (`templates/status.md` has a slot). Typical entries:

- changing an existing security or access policy
- changing a write contract other code depends on
- changing an approved visual baseline or snapshot
- anything that touches production data, deploys, pushes or rewrites history

On a stop item: **stop and ask the owner**, even when the fix is obvious, especially then.
Everything else that is additive (new files, new tests, new nullable fields) may proceed.

## 4. Guard registry

Invariants that must never break get one registry test that names each invariant and the
assertions that prove it. If an assertion moves, update the registry in the same commit.
Never silence it by deleting an entry.

## 5. No silent loss when rewriting status

Status files get rewritten and compressed. Facts disappear. Before committing a rewrite,
run:

```bash
node scripts/check.mjs diff OLD_STATUS.md NEW_STATUS.md
```

Every feature row in the old file must still exist in the new one, and any state that
went down must say why in its note. Get the old version with
`git show HEAD:path/to/status.md > old.md`.

## 6. Check the files

```bash
node scripts/check.mjs ledger docs/evidence.md   # classes, dates, limit column
node scripts/check.mjs status docs/status.md     # ladder states, evidence on high states
```

Both exit non-zero on a problem, so they fit a pre-commit hook or CI. No dependencies.

## 7. Report to the owner in plain English

The owner may not be a programmer. End every chunk of work with `templates/owner-report.md`:

1. What changed, in one or two plain sentences.
2. Which files changed.
3. What proved it, and that proof's limit.
4. Anything done on hosted or production systems, or "none".
5. What is still mocked, unverified or blocked.
6. One decision the owner needs to make next.

No jargon without a plain gloss. No "it works" without saying where and how it was seen.

## Habits for the agent

- Read the status file first. Git and the code outrank it; fix it when they disagree.
- Never claim hosted behaviour from local tests, concurrency from sequential tests, or
  performance from guesses.
- A screenshot proves what one screen showed once. Say which screen and which data.
- When you cannot verify something, write that in the report. Do not soften it.
