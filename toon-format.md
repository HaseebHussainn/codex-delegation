# TOON Format Reference

**Token-Oriented Object Notation** — a compact data format designed to minimize token usage in LLM-to-LLM communication.

## Rules

- Top-level `key: value` pairs, one per line
- Tabular arrays: `name[count]{col1,col2,...}:` followed by indented CSV rows
- No quotes, no braces, no brackets outside tabular syntax
- Minimal whitespace
- ~30-60% fewer tokens than equivalent JSON

## Example

```
status: ok
summary: Refactored auth module to use JWT tokens
files_changed: 3
tests_passing: true

changes[3]{file,action,description}:
  src/auth.ts,modified,Replaced session cookies with JWT
  src/middleware.ts,modified,Added token validation middleware
  tests/auth.test.ts,created,Added 12 unit tests for JWT flow

key_decisions[2]{decision,reason}:
  Used RS256 signing,Allows public key verification without shared secret
  30min token expiry,Balance between security and UX
```

## Why TOON?

When Claude delegates a task to Codex, the result needs to travel back as efficiently as possible. JSON wastes tokens on structural characters (`{`, `}`, `"`, `,`). TOON eliminates that overhead while remaining unambiguous and parseable.

### Token comparison (same data)

| Format | Tokens |
|--------|--------|
| JSON   | ~150   |
| YAML   | ~120   |
| TOON   | ~60    |
