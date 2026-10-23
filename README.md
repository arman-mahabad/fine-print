# Fine Print

A Claude skill that keeps a software project honest about what works.

AI agents say "done" too early. Fine Print makes the agent write down where a feature works,
how someone saw it work, and what that check does not prove. It is for projects that run for
months across many agent sessions, where the status file is the only memory.

## Why I built this

I build a medical-education platform with Claude Code, one session after another, for months.
Three things kept going wrong in the status reports. A test that passed on my laptop turned
into "works on the hosted project". My "yes, ship it" in chat turned into proof that the
feature worked. A status rewrite dropped a blocker, and nobody noticed. Then one hosting setting made
every app page return 404 in production, while the local preview served all of them.

Fine Print is the set of rules I wrote after that. [examples/origin.md](examples/origin.md)
has the full story and four rows from the project's real ledger.

## Try it

```bash
node skills/fine-print/scripts/check.mjs status examples/bad-status.md
```

```
FAIL line 3: "Login" is live-hosted but names no evidence
FAIL line 4: "Search" has state "done"; use one of not-built, visual-only, mock-backed, live-local, live-hosted, accepted
2 problem(s)
```

The script exits with 1 when it finds a problem, so it can block a commit or a CI run. It needs
Node and nothing else.

## What's inside

- A six-step ladder for every feature: `not-built`, `visual-only`, `mock-backed`,
  `live-local`, `live-hosted`, `accepted`. No other states.
- An evidence ledger. Its key column is "What it does NOT prove", and it can't be empty.
  A chat approval proves a decision. It never proves behaviour.
- A stop list: changes the agent must ask about, even when the fix looks obvious.
- A diff check, so a status rewrite can't drop a feature or a blocker without anyone seeing.
- A plain-English report for owners who don't read code.
- `check.mjs`, which checks the ledger, the status file and the diff between two versions.

## Install

Copy the skill folder into your Claude skills folder:

```bash
cp -r skills/fine-print ~/.claude/skills/
```

Or put it in one project only, at `.claude/skills/fine-print/`. Claude loads it when you ask
for status, a handover or a release note, and before it claims something works.

Start a new project from the files in `skills/fine-print/templates/`.

## More checks

```bash
node skills/fine-print/scripts/check.mjs ledger docs/evidence.md
node skills/fine-print/scripts/check.mjs status docs/status.md
git show HEAD:docs/status.md > /tmp/old.md && node skills/fine-print/scripts/check.mjs diff /tmp/old.md docs/status.md
```

## Tests

```bash
node --test "tests/*.test.mjs"
```

The tests cover `check.mjs`. The skill's written rules have no evals yet.

## Status

Version 0.1. The rules are the ones I use on that platform. Evals and a second worked example
come next.

## License

MIT
