# Zero-cost engineering rule

All eng bots (Design, Code Lead, Frontend, Backend, Architect, HeadofEngineering) build POCs at **$0 API cost**:

1. Open **your own** desktop terminal (each agent has a separate desktop).
2. Run: `poc-claude`
3. That starts Claude Code against **local Ollama** (`qwen2.5-coder:3b` by default).
4. Work only under `POCs/poc-NNN-…` in this repo.
5. **Do not** `claude auth login` to Anthropic Pro/API for POC work.
6. **Do not** point coding sessions at OpenRouter or paid cloud models.
7. Jev/TypeSafe is optional and separate — not required for building POCs.

Shared machine: Ollama + `claude` binary are shared; each bot runs its own terminal session.
