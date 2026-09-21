# Standing instructions for this repo

You are working in **MithunXcpu/mithuns-business-pocs**.

## Where to put work
- ALL new builds, apps, prototypes, and experiments go under `POCs/` only.
- Naming: `POCs/poc-NNN-short-kebab-name/` (next free number; start at `poc-001-` if empty).
- Copy structure from `templates/poc-template/` (README.md, src/, docs/, tests/).
- Do NOT create projects at the repo root, in `/workspace` outside this clone, or in random folders.
- Do NOT modify other agents' unrelated scratch under `/workspace` except this repo.

## Git / GitHub
- Remote: `https://github.com/MithunXcpu/mithuns-business-pocs.git`
- Branch: `main` (or a short feature branch per POC if asked).
- After meaningful progress: commit with a clear message and push to GitHub.
- Never commit secrets, `.env`, or `api_keys.env`.

## Models
- Prefer free/local Ollama models already configured for Claude Code (default `qwen2.5-coder:3b`).

## Zero cost
See `ZERO_COST.md`. Always launch with `poc-claude` (Ollama). No paid Anthropic/OpenRouter for POC builds.
