# Where Fine Print came from

Fine Print grew out of a medical-education platform for university students, built over
several months by one founder working with Claude Code across hundreds of sessions. The
founder is not a programmer. Every status report had to be true in plain English, because
there was no one else to catch a wrong "it's done".

Three things kept going wrong before these rules existed:

- **Local passes became production facts.** Tests passed against an in-memory database and
  a session later wrote "works on the hosted project". Nobody had checked there.
- **Approval became proof.** The owner said "yes, ship it" in chat. A later session read
  that as evidence the feature behaved correctly on real accounts.
- **Status rewrites dropped facts.** A status file was compressed to stay readable, and a
  blocker quietly vanished with it.

The ladder, the ledger's fourth column, the stop list and the diff check each answer one of
those. Below are four anonymized rows from the project's real ledger.

| Claim | Date | How observed | What it does NOT prove |
| --- | --- | --- | --- |
| All database migrations are applied to the hosted project and unchanged | 2026-09-03 | hosted: paired local and remote list, file hashes pinned | that any of them is exercised by a user, or that the objects behave under load |
| Owner approved the new quick-check wording | 2026-10-22 | chat: owner's own words, quoted | that the text renders correctly on a phone, or that any student has seen it |
| Every app address returned 404 after a hosting config change | 2026-10-22 | production: public origin, signed-out browser | which other config options behave differently in production than in local preview |
| The agent's attempt to push was refused | 2026-10-17 | tooling: harness refusal message | anything about the code, the hosted project or the owner's intent |

The third row is the one that made the case for the whole method. The local preview server
served every page. The production host, with one extra config option switched on, served
404s for every app address. Only a `production` row would have caught it, and the ladder
kept that feature at `live-local` until one was written.
