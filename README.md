# Codex Delegation for Claude Code

**Stop burning expensive API tokens on tasks a free model can handle.**

A simple pattern that lets Claude Code automatically delegate heavy I/O tasks — Notion reads, web research, log analysis, large diffs — to OpenAI's Codex CLI, which is **free with ChatGPT Plus**. Claude only ingests a compact summary instead of raw data, cutting token usage dramatically.

## The Problem

Claude Code (Opus) is powerful but expensive. Every time it processes a large Notion page, crawls the web, or reads a massive log file, you're paying for thousands of tokens of raw data that could have been summarized first.

## The Solution

```
You ──→ Claude Code ──→ delegates to Codex (free) ──→ compact summary back to Claude
```

Codex does the heavy lifting — reading, fetching, processing. Claude only sees the distilled result in TOON format (~30-60% fewer tokens than JSON).

### Real example

| Step | Tokens | Cost |
|------|--------|------|
| Codex reads a Notion page (raw JSON) | 21,602 | Free |
| Claude ingests TOON summary | 50 | ~$0.001 |
| **Without delegation** | 21,602 | **~$0.32** |

## When to Delegate

| Delegate to Codex | Keep in Claude |
|---|---|
| Large Notion pages/databases | Quick lookups (<2k tokens) |
| Deep web research (multi-source) | Architecture decisions |
| Log/error analysis (big files) | Complex debugging |
| Big diff/PR review (2,000+ lines) | Multi-step coding with context |
| CSV/JSON dataset processing | Latency-sensitive small tasks |
| Documentation generation | Tasks needing your MCP connections |

## Setup (5 minutes)

### 1. Install Codex CLI

```bash
npm install -g @openai/codex
```

Requires ChatGPT Plus, Pro, Business, Edu, or Enterprise.

### 2. Copy the delegation script

```bash
mkdir -p ~/bin
cp codex-delegate.js ~/bin/
chmod +x ~/bin/codex-delegate.js
```

Make sure `~/bin` is in your PATH:
```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Configure MCP servers for Codex

```bash
mkdir -p ~/.codex
cp codex-config.example.toml ~/.codex/config.toml
```

Edit `~/.codex/config.toml` and add your Notion token ([get one here](https://notion.so/my-integrations)). Verify with:

```bash
codex mcp list
```

### 4. Add delegation rules to your CLAUDE.md

Copy the contents of [`claude-md-snippet.md`](./claude-md-snippet.md) into your project's `CLAUDE.md`. This tells Claude Code when to delegate automatically.

### 5. Test it

```bash
node ~/bin/codex-delegate.js "What is 2+2? Respond in TOON format"
```

You should see Codex spin up, process the task, and return a TOON-formatted result.

## How It Works

1. Claude Code reads your `CLAUDE.md` and sees the delegation rules
2. When a task matches (heavy Notion read, web research, etc.), Claude runs:
   ```
   node ~/bin/codex-delegate.js "read the Q1 planning page from Notion and summarize it"
   ```
3. Codex CLI spins up with its own MCP servers (Notion, Playwright)
4. Codex processes the raw data and returns a compact TOON summary
5. Claude reads the small summary and responds to you

The script uses these Codex flags:
- `--dangerously-bypass-approvals-and-sandbox` — non-interactive execution
- `--ephemeral` — don't persist the session
- `--skip-git-repo-check` — run anywhere
- 5-minute timeout as safety net

## TOON Format

TOON (Token-Oriented Object Notation) is a compact format for LLM-to-LLM communication. See [`toon-format.md`](./toon-format.md) for the full spec.

```
status: ok
summary: Q1 revenue up 23%, three new hires planned

highlights[3]{metric,value,trend}:
  Revenue,2.3M,up 23%
  Users,45000,up 12%
  Churn,2.1%,down 0.3%
```

No quotes. No braces. No wasted tokens.

## Files

| File | Purpose |
|------|---------|
| `codex-delegate.js` | The delegation script — drop it in `~/bin/` |
| `codex-config.example.toml` | MCP server config template for `~/.codex/config.toml` |
| `claude-md-snippet.md` | Copy-paste rules for your project's `CLAUDE.md` |
| `toon-format.md` | TOON format reference |

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (CLI)
- [Codex CLI](https://github.com/openai/codex) (free with ChatGPT Plus/Pro/Business/Edu/Enterprise)
- Node.js 18+

## License

MIT
