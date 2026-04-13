---
name: interview-prep/product-sense
description: >
  Framework and answer patterns for product sense interview questions.
  Covers abstract and domain-agnostic product questions, the 5-step
  framework, VP-level add-on, and AI-infused product sense questions
  where Angshuman has real differentiation. Load this when preparing
  for or drilling product sense questions.
---

# Product Sense — Framework + Answer Patterns

## WHAT PRODUCT SENSE QUESTIONS ARE TESTING

NOT domain knowledge. NOT your experience with that industry.
They're testing:
- Taste — do you make opinionated choices or hedge everything?
- Prioritization — do you go narrow fast or try to solve everything?
- Judgment — do your tradeoffs make sense given the constraints?
- Vision — do you have a POV on where this goes?

The question could be about parking, senior citizens, theme parks,
or agriculture. The domain is irrelevant. The thinking process is everything.

---

## THE 5-STEP FRAMEWORK

**Step 1 — Clarify the goal (30 seconds)**
What does success look like for the company asking you to build this?
Is it growth, revenue, engagement, trust, new market entry?
Pick one and state it explicitly. Don't skip this.

**Step 2 — Choose one user (30 seconds)**
Not "users broadly." Pick the most interesting or highest-leverage segment.
Defend your choice in one sentence. Move on.
The more specific the user, the sharper the solution.

**Step 3 — Nail the moment (30 seconds)**
What specific situation is this user in when they need this?
Not "they want to find a contractor." More like:
"It's Saturday afternoon, their toilet is broken, they've never hired
a contractor before, and they're scared of being overcharged."
The more specific the moment, the more obvious the MVP becomes.

**Step 4 — Prioritize one problem (60 seconds)**
Out of everything this user feels in this moment, what's the one
thing worth solving first? Say explicitly what you're NOT solving and why.
This is where Director/VP candidates separate from strong PM candidates.

**Step 5 — Propose the MVP + metric (60 seconds)**
What's the smallest thing that proves the hypothesis?
One feature, one user flow, one success metric.
How do you know it worked?

Total: ~3 minutes. Then pause and let them react.

---

## THE VP-LEVEL ADD-ON (30 seconds after your answer)

After your answer, add one of these:
- "The platform play if this works is..." (shows strategic thinking)
- "The risk I'm most worried about is..." (shows honest judgment)
- "What would make me kill this in 6 months is..." (shows discipline)

This is what separates a strong PM answer from a VP-level answer.
Most candidates end when they've described the MVP. VP candidates
show they're already thinking about what happens next.

---

## QUESTION PATTERN BUCKETS

Most product sense questions reduce to one of these buckets:

**1. Vulnerable users** — seniors, people in crisis, underserved communities
Key move: deeply specific moment, safety/trust as the primary constraint,
simpler is almost always better than smarter

**2. Physical/digital hybrid** — parking, transit, home services
Key move: the friction is usually the handoff between physical and digital,
solve that handoff specifically

**3. Platform extensions** — "improve Instagram," "build a travel product for X"
Key move: understand what the platform already does well and don't replicate it,
find the adjacent need the platform creates but doesn't serve

**4. Abstract/societal** — "solve water in Africa," "design for volunteering"
Key move: ruthlessly narrow scope (one country, one user type, one moment),
refuse the temptation to solve the whole problem

**5. Marketplaces** — contractors, caregivers, local services
Key move: the hardest problem is always trust and the cold start —
start there, not at the feature list

**6. AI-infused** — "design an AI feature for X" — YOUR STRONGEST BUCKET

---

## AI-INFUSED PRODUCT SENSE — YOUR DIFFERENTIATION

This is where you win. Most candidates answer AI product sense questions
generically. You've built AI features. You know where they fail.

**The frame to use:**
"Before I design the AI feature, I want to understand what the user
is actually trying to accomplish — because AI is often the wrong answer
to what sounds like an AI question."

Then: user → moment → what they need → is AI the right tool?
Often the answer is: AI for the intelligence layer, not the interface.

**4 signature AI product sense answers:**

### "Design an AI feature for a CRM like HubSpot"

User: Sales rep with 50+ active deals
Moment: End of week, deciding which deals to focus on next week,
overwhelmed by deal count, scared of missing something
One problem: signal-to-noise — too many updates, unclear what actually
needs attention
MVP: An AI deal prioritization layer that surfaces the 3 deals most at
risk of going cold this week, with one-sentence explanation of why each
was flagged (no login required in 3 days + decision maker changed +
competitor mentioned in last call). Not a dashboard, not a score —
just three deals with explanations.
Metric: Rep response rate to AI-flagged deals vs unflagged deals
VP add-on: "The platform play is that this AI layer becomes the
authoritative source of deal context that every other HubSpot agent
consumes — the semantic layer on top of the CRM data graph."

### "Design an AI feature for an analytics product like Amplitude"

User: PM who inherited a product with 6 months of Amplitude data
Moment: Monday morning, trying to understand what happened last week,
has 4 dashboards open, doesn't know which metrics to trust
One problem: Interpretation — the data is there but the story isn't
MVP: Weekly AI narrative — a 3-paragraph summary of what changed last
week, what's anomalous, and what question to investigate first.
Grounded entirely in the customer's own event taxonomy and metrics.
No hallucination — every claim cites a specific event and time window.
Metric: Did the PM open a specific chart after reading the narrative?
(downstream engagement) — not just open rate
VP add-on: "The risk I'm most worried about is the AI confidently
explaining a metric change that was actually caused by an instrumentation
bug. The feature lives or dies on calibrated uncertainty — 'this looks
like a real change' vs 'this might be a tracking issue.'"

### "Design an AI feature for a data integration product like Fivetran"

User: Data engineer at a mid-size company, just joined
Moment: First week, trying to understand what data they have and
what's broken, no documentation exists
One problem: Discovery — they don't know what connectors exist,
what tables they produce, or what's upstream of what
MVP: An AI data catalog that auto-generates table descriptions,
infers relationships between tables, and surfaces freshness and
quality status — all from existing connector metadata and query logs.
No manual documentation required.
Metric: Time from "new data engineer joins" to "first successful
analysis using the platform"
VP add-on: "What would make me kill this in 6 months is if the AI
descriptions are wrong often enough that engineers stop trusting them.
The bar isn't comprehensive — it's trustworthy. I'd rather surface
50 tables with high-confidence descriptions than 500 tables with
unreliable ones."

### "Design an AI feature for a data clean room / identity product like LiveRamp"

User: Marketing ops manager at a retailer
Moment: Planning a campaign with a media partner, needs to understand
audience overlap without sharing raw customer data
One problem: Friction — the clean room process requires IT, legal,
and data engineering involvement, takes 2-3 weeks
MVP: Self-serve audience overlap estimation — upload a hashed audience
list, get a privacy-safe estimate of overlap percentage with the media
partner's audience within minutes. No engineering required, no data
leaving your environment.
Metric: Time-to-first-overlap-analysis for a non-technical marketing user
VP add-on: "The platform play is that this becomes the trust layer
for every AI agent that needs to operate across enterprise data siloes.
Agents need identity resolution the same way humans do — LiveRamp becomes
the passport system for the agentic data economy."

---

## THE META-POV TO WEAVE INTO ANY AI PRODUCT QUESTION

"The question I always ask before designing an AI feature is: what decision
does this data or intelligence need to enable? Because AI is not a feature —
it's an answer to a specific question about what the user needs to know
or do next. If I can't articulate that question precisely, the AI feature
will be impressive in a demo and useless in production."

---

## QUICK REFERENCE — WHAT TO DO WHEN STUCK

Domain you don't know? → Go back to the user and the moment.
The domain doesn't matter. The human moment does.

Too many good ideas? → Pick the one that proves the core hypothesis
fastest. Everything else is a future sprint.

Question feels too abstract? → Narrow it aggressively. One country,
one user type, one moment. Then go deep on that.

Being pushed to add more features? → "I'd rather go deep on one
use case that we know is real than spread across three that are
hypothetical. Once this works, we have the evidence to expand."
