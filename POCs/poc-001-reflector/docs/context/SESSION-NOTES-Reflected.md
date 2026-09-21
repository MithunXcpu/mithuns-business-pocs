# Session Notes — Reflected (Full Recap)

## Product
**Reflected: A New AI Consultancy** — show a company its own business reflected back.

## Jev
Decision model from TypeSafe AI. Returns one of: score, choice among options, or null/yes-no — each with probabilities + confidence. Faster/cheaper than full LLM for classification.

## How it works
1. Ingest chat/email (Teams, Slack, etc.)
2. Sonnet (or similar) writes a rubric (e.g. tribal knowledge, repeated workflows)
3. Jev scores/classifies messages against rubric cheaply at scale
4. Second LLM pass organizes high-confidence hits into structured storage

## Business model
Discovery = loss-leader / sales artifact. Paid product = automations from findings.
Six fix categories → three themes: **Risk & Compliance**, **Efficiency**, **Cost**.

## ICP
Operationally-intensive / service-delivery: logistics, facilities, field services, staffing, property management, healthcare delivery, moving/relocation. Tech is cost center not differentiator. ~300–10,000 employees (napkin: 200k–400k US cos). Examples: Piece of Cake (moving, NYC), OpenExchange.

## Engagement
Contractor in → prove value on concrete win (cost/dup work) → expand to harder problems.

## Thesis
A major AI model maker goes open source in next couple years → costs drop further.

## Deck
5 slides: Cover → Current State → How It Works → Beliefs → Future State. Green #1F7A4D on cream. File: Reflected_Pitch_Deck.pptx

## Hype video
8-beat looping HTML artifact (not encoded video). Screen-record to export.

## Claude Code note
Transient model-picker bug; resolved. Update via `claude update`.
