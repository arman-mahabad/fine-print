#!/usr/bin/env node
// Fine Print checks. No dependencies.
//   node check.mjs ledger FILE        evidence ledger rows
//   node check.mjs status FILE        feature states on the ladder
//   node check.mjs diff OLD NEW       no feature row lost in a status rewrite
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const LADDER = ['not-built', 'visual-only', 'mock-backed', 'live-local', 'live-hosted', 'accepted'];
export const CLASSES = ['local', 'hosted', 'production', 'reported', 'chat', 'tooling'];
const EMPTY_LIMITS = new Set(['', 'none', 'n/a', 'na', '-', '—', 'nothing', 'tbd']);

// Rows of every markdown table whose header contains all the given words.
export function tables(text, headerWords) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const head = cells(lines[i]);
    if (!head) continue;
    const lower = head.map((c) => c.toLowerCase());
    if (!headerWords.every((w) => lower.some((c) => c.includes(w)))) continue;
    if (!/^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? '')) continue;
    for (let j = i + 2; j < lines.length; j++) {
      const row = cells(lines[j]);
      if (!row) break;
      out.push({ line: j + 1, head: lower, row });
    }
  }
  return out;
}

function cells(line) {
  if (!line || !line.trim().startsWith('|')) return null;
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

const col = (head, word) => head.findIndex((c) => c.includes(word));

export function checkLedger(text) {
  const problems = [];
  const rows = tables(text, ['claim', 'date', 'observed', 'not prove']);
  if (rows.length === 0) problems.push('no ledger table found (header: Claim | Date | How observed | What it does NOT prove)');
  for (const { line, head, row } of rows) {
    const [claim, date, how, limit] = ['claim', 'date', 'observed', 'not prove'].map((w) => row[col(head, w)] ?? '');
    if (!claim) problems.push(`line ${line}: empty claim`);
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) problems.push(`line ${line}: date "${date}" is not YYYY-MM-DD`);
    const cls = how.toLowerCase().replace(/[*_`]/g, '').split(/[\s—–:,-]/)[0];
    if (!CLASSES.includes(cls)) problems.push(`line ${line}: "How observed" must start with one of ${CLASSES.join(', ')}`);
    if (EMPTY_LIMITS.has(limit.toLowerCase().replace(/[*_`.]/g, '').trim()) && !/superseded/i.test(claim + limit)) {
      problems.push(`line ${line}: "What it does NOT prove" is empty or "none"; every claim has a limit`);
    }
  }
  return problems;
}

export function statusRows(text) {
  return tables(text, ['feature', 'state']).map(({ line, head, row }) => ({
    line,
    feature: row[col(head, 'feature')] ?? '',
    state: (row[col(head, 'state')] ?? '').replace(/[`*]/g, '').trim(),
    evidence: col(head, 'evidence') >= 0 ? row[col(head, 'evidence')] : '',
    note: col(head, 'note') >= 0 ? row[col(head, 'note')] : '',
  }));
}

export function checkStatus(text) {
  const problems = [];
  const rows = statusRows(text);
  if (rows.length === 0) problems.push('no status table found (header: Feature | State | Evidence | Note)');
  for (const r of rows) {
    if (!LADDER.includes(r.state)) problems.push(`line ${r.line}: "${r.feature}" has state "${r.state}"; use one of ${LADDER.join(', ')}`);
    else if (LADDER.indexOf(r.state) >= LADDER.indexOf('live-local') && !r.evidence.trim()) {
      problems.push(`line ${r.line}: "${r.feature}" is ${r.state} but names no evidence`);
    }
  }
  return problems;
}

export function checkDiff(oldText, newText) {
  const problems = [];
  const after = new Map(statusRows(newText).map((r) => [r.feature.toLowerCase(), r]));
  for (const before of statusRows(oldText)) {
    const now = after.get(before.feature.toLowerCase());
    if (!now) { problems.push(`"${before.feature}" disappeared from the status file`); continue; }
    const drop = LADDER.indexOf(now.state) < LADDER.indexOf(before.state);
    if (drop && !now.note.trim()) problems.push(`"${before.feature}" went from ${before.state} to ${now.state} with no note saying why`);
  }
  return problems;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [mode, a, b] = process.argv.slice(2);
  const read = (p) => readFileSync(p, 'utf8');
  let problems;
  if (mode === 'ledger' && a) problems = checkLedger(read(a));
  else if (mode === 'status' && a) problems = checkStatus(read(a));
  else if (mode === 'diff' && a && b) problems = checkDiff(read(a), read(b));
  else { console.error('usage: check.mjs ledger FILE | status FILE | diff OLD NEW'); process.exit(2); }
  for (const p of problems) console.log(`FAIL ${p}`);
  console.log(problems.length ? `${problems.length} problem(s)` : 'ok');
  process.exit(problems.length ? 1 : 0);
}
