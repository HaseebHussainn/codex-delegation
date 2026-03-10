#!/usr/bin/env node

/**
 * codex-delegate.js — Delegate heavy tasks from Claude Code to Codex CLI
 *
 * Usage: node codex-delegate.js "task description"
 *
 * Codex processes bulk data (Notion pages, web research, large files)
 * and returns a compact TOON summary. Claude Code only ingests the
 * small result instead of burning expensive tokens on raw data.
 *
 * Requires: Codex CLI (free with ChatGPT Plus/Pro/Business/Edu/Enterprise)
 * Install: npm install -g @openai/codex
 */

const { spawn } = require("child_process");
const fs = require("fs");

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const OUTPUT_FILE = "/tmp/codex-result.txt";

const task = process.argv.slice(2).join(" ");
if (!task) {
  console.error("Usage: node codex-delegate.js <task description>");
  process.exit(1);
}

const prompt = `TASK: ${task}

IMPORTANT: Return your response in TOON format (Token-Oriented Object Notation).
Rules:
- Top-level key:value pairs, one per line
- Tabular arrays use name[count]{col1,col2,...}: then indented CSV rows
- No quotes, no braces, no brackets outside tabular syntax
- Minimal whitespace

Example:
status: ok
summary: Did the thing

files[2]{path,action,desc}:
  foo.py,created,Does X
  bar.py,modified,Updated Y`;

// Clean up previous result
if (fs.existsSync(OUTPUT_FILE)) fs.unlinkSync(OUTPUT_FILE);

const args = [
  "exec",
  "--dangerously-bypass-approvals-and-sandbox",
  "--ephemeral",
  "--skip-git-repo-check",
  "-o", OUTPUT_FILE,
  prompt,
];

const child = spawn("codex", args, {
  stdio: ["ignore", "pipe", "inherit"], // stderr streams live
});

let stdout = "";
child.stdout.on("data", (d) => (stdout += d));

const timer = setTimeout(() => {
  child.kill();
  console.error("Codex timed out after 5 minutes");
  process.exit(1);
}, TIMEOUT_MS);

child.on("close", (code) => {
  clearTimeout(timer);
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log(fs.readFileSync(OUTPUT_FILE, "utf8").trim());
  } else if (stdout.trim()) {
    console.log(stdout.trim());
  } else {
    console.error("No output produced. Exit code:", code);
    process.exit(1);
  }
});
