import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkLedger, checkStatus, checkDiff } from '../skills/fine-print/scripts/check.mjs';

const template = (name) => readFileSync(new URL(`../skills/fine-print/templates/${name}`, import.meta.url), 'utf8');
const ledger = (rows) => `| Claim | Date | How observed | What it does NOT prove |\n| --- | --- | --- | --- |\n${rows}\n`;
const status = (rows) => `| Feature | State | Evidence | Note |\n| --- | --- | --- | --- |\n${rows}\n`;

test('the shipped templates pass', () => {
  assert.deepEqual(checkLedger(template('evidence.md')), []);
  assert.deepEqual(checkStatus(template('status.md')), []);
});

test('ledger: a row with no limit fails', () => {
  assert.equal(checkLedger(ledger('| Login works | 2026-01-01 | local: tests | none |')).length, 1);
  assert.equal(checkLedger(ledger('| Login works | 2026-01-01 | local: tests |  |')).length, 1);
});

test('ledger: unknown evidence class and bad date fail', () => {
  const p = checkLedger(ledger('| Login works | last week | vibes | that it scales |'));
  assert.equal(p.length, 2);
});

test('ledger: chat and tooling rows are accepted', () => {
  const rows = ['| Owner chose the blue theme | 2026-01-02 | chat: "go with blue" | that blue renders on phones |',
    '| Push was refused | 2026-01-03 | tooling: harness refusal | anything about the code |'].join('\n');
  assert.deepEqual(checkLedger(ledger(rows)), []);
});

test('status: off-ladder state and unevidenced live state fail', () => {
  assert.equal(checkStatus(status('| Search | done | | |')).length, 1);
  assert.equal(checkStatus(status('| Search | live-hosted | | |')).length, 1);
  assert.deepEqual(checkStatus(status('| Search | live-hosted | row 4 | |')), []);
});

test('diff: a lost row and an unexplained downgrade fail', () => {
  const before = status('| Search | live-local | row 2 | |\n| Export | mock-backed | | |');
  assert.deepEqual(checkDiff(before, status('| Search | live-local | row 2 | |\n| Export | mock-backed | | |')), []);
  assert.equal(checkDiff(before, status('| Search | live-local | row 2 | |')).length, 1);
  assert.equal(checkDiff(before, status('| Search | mock-backed | | |\n| Export | mock-backed | | |')).length, 1);
  assert.deepEqual(checkDiff(before, status('| Search | mock-backed | | API key expired |\n| Export | mock-backed | | |')), []);
});
