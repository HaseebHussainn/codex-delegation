## Codex Delegation (Token Savings)

Delegate heavy I/O tasks to OpenAI Codex CLI (free with ChatGPT Plus) to save tokens. Codex processes the bulk data; you only ingest the compact TOON summary.

**Script**: `node ~/bin/codex-delegate.js "task description"`

### Always Delegate
- **Large Notion ingestion** — reading big pages, databases with many rows, multi-page fetches
- **Deep web research** — multi-source browsing, synthesis, anything needing Playwright navigation
- **Large log/error analysis** — feed Codex a big log file, get back a summary
- **Big diff/PR review** — Codex reads a 2,000+ line diff, returns structured summary
- **Large API response processing** — any response > ~5k tokens, Codex distills it
- **Documentation generation** — point Codex at code, get back structured docs
- **CSV/JSON dataset processing** — summarize, filter, or transform large data files

### Do NOT Delegate
- Anything under ~2k tokens of work
- Tasks requiring your own MCP connections that Codex doesn't have
- Multi-step coding needing codebase context
- Latency-sensitive tasks where spawning Codex would be slower

### How It Works
Codex returns TOON format (Token-Oriented Object Notation) — key:value pairs, tabular arrays, no JSON overhead. ~30-60% fewer tokens than JSON. You only ingest the distilled result.
