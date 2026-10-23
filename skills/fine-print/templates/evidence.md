# Evidence

Every claim this project relies on: **claim | date | how observed | what it does NOT prove.**
Rows are appended, never edited. A wrong row is marked `SUPERSEDED` and kept.

Classes for "How observed": `local`, `hosted`, `production`, `reported`, `chat`, `tooling`.
`chat` proves a decision only.

| Claim | Date | How observed | What it does NOT prove |
| --- | --- | --- | --- |
| Sign-in form renders and validates email format | 2026-01-15 | local: unit tests, auth disabled, mock adapter | that sign-in works against the real auth server |
