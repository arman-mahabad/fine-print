# Fine Print

A Claude skill that keeps a software project honest about what actually works.

AI agents are quick to say "done". Fine Print makes them say *where* it works, *how* that
was seen, and *what that check does not prove*. It is built for projects that run for
months across many agent sessions, where the status file is the only memory.

## What's inside

- **A six-step ladder** for every feature: `not-built`, `visual-only`, `mock-backed`,
  `live-local`, `live-hosted`, `accepted`. Nothing else is allowed.
- **An evidence ledger** with one column that matters most: *What it does NOT prove*.
  It is never empty. A chat approval proves a decision, never behaviour.
- **A stop list**: changes the agent must ask about, even when the fix looks obvious.
- **A no-silent-loss check** so a status rewrite can't quietly drop a feature or a blocker.
- **A plain-English owner report**, for owners who aren't programmers.
- **`check.mjs`**: a dependency-free Node script that checks the ledger and status files and
  exits non-zero on a problem, ready for a pre-commit hook or CI.

## Install

Copy the skill folder into your Claude skills directory:

```bash
cp -r skills/fine-print ~/.claude/skills/
```

Or into one project only: `.claude/skills/fine-print/`. Claude loads it when you ask for
status, a handover, a release note, or when it is about to claim something works.

## Use the checks

```bash
node skills/fine-print/scripts/check.mjs ledger docs/evidence.md
node skills/fine-print/scripts/check.mjs status docs/status.md
git show HEAD:docs/status.md > /tmp/old.md && node skills/fine-print/scripts/check.mjs diff /tmp/old.md docs/status.md
```

Start a project from `skills/fine-print/templates/`.

## Run the tests

```bash
node --test "tests/*.test.mjs"
```

## Origin

Fine Print comes from a real medical-education platform built by one non-programmer founder
with Claude Code. [examples/origin.md](examples/origin.md) tells that story and shows four
anonymized rows from the project's ledger, including the production 404 that local testing
never showed.

## Status

Version 0.1. The rules are the ones used in that project. Evals and a second worked example
are planned.

## License

MIT
