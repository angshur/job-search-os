---
name: interview-prep/technical-depth
description: >
  War story answers for the 11 technical interview questions targeting
  Director/VP PM and FDE roles. Covers Q3-Q5 and Q9-Q10 specifically.
  Load this when drilling specific technical interview questions.
  Includes fully drafted answers grounded in real TapClicks experience.
---

# Technical Depth — Interview Question War Stories

## THE META-PATTERN FOR TECHNICAL QUESTIONS

These questions test two things simultaneously:
1. Do you actually understand the technical domain?
2. Can you layer product judgment on top of technical decisions?

Every answer needs both. Technical accuracy without PM judgment = engineer.
PM judgment without technical accuracy = hand-waving. You need both.

Structure: Technical reality (what it is, how it works) →
Your specific decision (what you chose and why) →
The tradeoff you made (what you gave up) →
The outcome (what happened) →
The lesson (what you'd do differently or carry forward).

---

## Q3 — BATCH VS REAL-TIME PIPELINE TRADEOFFS

**What they're testing:** Do you understand the architectural spectrum?
Can you make the right call based on business need, not just technical
preference?

### Base Answer (when not pushed on real-time)

"The core question I always ask first is: what decision does this data
need to enable, and how quickly does that decision need to happen?
That determines everything downstream.

At TapClicks, we made a deliberate architectural choice to stay batch-first
for most of our 200+ connector pipelines. The reason wasn't technical —
it was business. Our customers were agencies running daily and weekly
performance reviews. A dashboard that refreshed every 15 minutes versus
every night had zero impact on their workflow. So the cost of real-time
infrastructure — operational complexity, failure modes, consumer lag
management — wasn't justified by the value.

But we ran into a class of problems where that decision created tension.
Customers would log in mid-morning, see yesterday's data, and assume
something was broken. That's not a freshness problem — that's a trust
problem. So we introduced micro-batch syncs for high-value connectors
— Google Ads, Meta — not because we needed real-time, but because
perceived freshness was driving churn.

The tradeoffs I think about are three-dimensional. Latency versus cost
is the obvious one. But the two that matter more in practice are:
operational complexity (real-time systems fail in ways batch systems
don't, and your on-call burden increases dramatically) and data
correctness (batch lets data settle — real-time captures data before
it's finalized, and in advertising platforms retroactively adjust numbers.
A click you captured in real-time at 9am may be revised by midnight).

My framework: real-time for decisions that need to happen in seconds.
Micro-batch for freshness that affects trust but not decisions. Batch
for everything where settling time improves correctness. And always ask:
what's the cost of being wrong about this choice?"

### Extension — When Pushed on Real-Time (Campaign Management War Story)

"Actually we did have a real-time use case and it's a good example of
where the business need forced the architecture.

Our agency customers were coming in every morning, reviewing campaign
performance, and manually making calls — pause this tactic, cut the budget
here. By the time they logged in, they'd already burned hours of spend on
something that wasn't working. The lag between what was happening in the
ad platforms and what they could see and act on was costing them real money.

So we built a closed-loop campaign management engine — a near real-time
performance monitoring layer that ingested campaign data as it came in,
ran detection logic against their KPIs, and pushed actions downstream.
Initially alerting, then automated actions.

On the ingestion side: hybrid model — REST API polling for platforms that
didn't support push, webhooks for those that did. We also explored
clickstream ingestion for behavioral signals. The ingestion layer sat on
Kafka — used both as message bus and buffer to handle rate limits and quota
constraints of upstream platforms. 200+ connectors means you can blow
through API quotas fast. So we built a queuing and throttling layer that
managed fetch scheduling intelligently — prioritizing high-value accounts,
backing off on rate limit responses, ensuring no data loss during backpressure.

The detection logic was hybrid: rule-based for clear threshold violations
(if CPA exceeds target by X% over Y impressions, flag it), ML-based for
subtler patterns — campaigns trending toward failure before crossing a hard
threshold. The ML layer gave earlier signal but introduced a confidence
problem. A campaign that looks bad at 8am on 500 impressions might be
statistically meaningless. So we built confidence thresholds into detection:
minimum impression volume, minimum time window, statistical significance
checks before any action was triggered.

The action layer was where things got hard. We pushed decisions back to
DSPs and ad platforms — pause a campaign, reduce a budget. Different
platforms supported different mechanisms: some had webhook receivers, some
required API calls, some had specific recommended patterns for budget
modifications. We built an abstraction layer normalizing these into a
consistent action interface regardless of downstream platform.

But the hardest problem was irreversibility. Pausing and resuming is
recoverable. Cutting a budget mid-flight can lose you auction position
that's hard to recover. So we built two things: a human-in-the-loop
checkpoint for high-impact actions above a spend threshold requiring human
approval before execution, and a full audit log of every system decision —
what signal triggered it, confidence level, action taken, outcome.

We used Redis for the action queue and state management — tracking which
actions were pending, in-flight, or completed, handling retries when
platform API calls failed. Retry logic had to be idempotent — if we sent
a pause request and didn't get confirmation, we couldn't fire it again
without checking current state first.

What broke in production: a feedback loop we didn't anticipate. The system
would detect underperformance, pause a campaign, resume it, detect
underperformance again because new data looked bad relative to the historical
baseline that included the paused period, and pause it again. We had to build
state awareness into the detection logic so it understood that a campaign
coming out of a pause has a cold-start period and shouldn't be evaluated
against normal baselines for the first N impressions.

The deeper lesson: real-time closed-loop systems fail in ways batch systems
never do because every component is stateful and the system's own actions
affect the data it's observing. You're not just processing data — you're
in a feedback loop with the real world."

### The Audience + Creative Layer (When Pushed Further)

"We also built a more ambitious layer on top of this — an audience selector
and creative management system that could recommend which audiences and
creatives to deploy based on performance data across channels. The vision
was a fully closed-loop programmatic platform.

We started rule-based — if audience X has CPA below threshold, expand it.
Then tried ML-based algorithms to scale the intelligence.

That's where we hit the wall, and honestly it's where I learned the most.
We hit all four ML scaling failure modes simultaneously: cold start (new
audiences/channels had no historical data), data volume (mid-market agencies
don't have the impression volumes that make ML reliable), model drift
(ad market conditions change faster than we could retrain), and latency
(ML inference couldn't consistently hit sub-second for real-time decisions).

On the identity side — we wanted to do cross-channel audience intersection,
understanding that the same user appearing on Facebook and display and CTV
shouldn't be counted three times. We struggled with identity matching because
client first-party data was messy. Inconsistent naming, duplicate records,
missing fields, different ID schemas across platforms. We needed LiveRamp-style
identity resolution and ran out of runway to build it.

We also ran into first-party data governance nervousness. Agencies were
protective of client audience data. Even when we had the technical capability
to do more with it, customers were reluctant to give us the permissions we
needed. GDPR and CCPA created a compliance layer that made sophisticated
cross-client audience work essentially impossible without legal infrastructure
we didn't have.

What I'd do differently: start with data quality as a product, not a
prerequisite. We treated data cleaning as something customers needed to do
before using our features. We should have built self-service data quality
tooling as a first-class product — that's where the real value was and it
would have unblocked everything downstream. ML last, not first. Rules to
baseline, rules plus simple statistical models to improve, ML only once
you have volume and stability. And on identity — either partner with a
LiveRamp or build a lightweight first-party ID graph early. The cross-channel
problem is fundamentally an identity problem and you cannot engineer your
way around it without solving identity first."

---

## Q4 — INFERENCE COST MANAGEMENT

**What they're testing:** Do you understand the economics of LLM deployment?
Can you make cost/quality tradeoffs as a product decision?

### Answer Framework

"Inference cost is a product decision, not just an infrastructure one.
The question I always start with is: what's the minimum quality threshold
that still delivers value to the user? Because that determines which model
you actually need.

At TapClicks with SmartSuite, we had a clear quality bar — the insights
had to be accurate enough that a non-technical user could share them with
a client without second-guessing them. Below that bar the feature was
actively harmful (wrong insights are worse than no insights). Above that
bar, incremental quality improvement didn't drive more value.

Tactics I used:

Prompt compression — every token costs money. We systematically trimmed
system prompts, removed redundant context, and compressed retrieved chunks.
Going from a 4,000 token prompt to 2,000 with the same output quality
halves your inference cost immediately.

Model routing — not all queries are equal. For SmartSuite, simple
summarization queries went to a smaller, cheaper model. Complex cross-metric
analysis went to the larger model. Routing by query complexity gave us
80% of the quality at 40% of the cost.

Caching — identical or near-identical prompts produce identical outputs.
We cached outputs for common query patterns and served from cache before
hitting the model. High cache hit rate on the most frequent queries
dramatically reduced cost.

Structured output — constraining the model to produce JSON within a defined
schema rather than free-form text reduces output tokens, improves consistency,
and makes validation trivial. Shorter, more consistent outputs cost less.

Batching — for non-real-time use cases like SmartEmail, we batched inference
jobs during off-peak hours instead of running them synchronously. Same
model, lower cost because you're not paying for low-latency serving.

The tradeoff I navigate constantly: latency vs cost. Caching and batching
reduce cost but add latency. For interactive features that's unacceptable.
For async features (nightly email insights, scheduled reports) it's the
right call. Matching the cost optimization strategy to the latency requirement
of the use case is the PM judgment layer here."

---

## Q5 — MODEL SELECTION BY USE CASE

**What they're testing:** Do you have a principled framework for choosing
models, or do you just use the newest/biggest one?

### Answer Framework

"My model selection framework has three dimensions: capability requirement,
latency requirement, and cost constraint. The interaction of those three
determines the right model for a given use case.

Capability: what's the minimum intelligence needed for this task? SQL
generation requires strong reasoning and code understanding. Sentiment
classification doesn't. Matching capability to task avoids paying for
intelligence you don't need.

Latency: is this synchronous (user is waiting) or async (background job)?
Synchronous features need sub-2-second response — that limits you to
certain model sizes and providers. Async features can use larger, slower,
cheaper models.

Cost: what's the acceptable cost per query at scale? At TapClicks SmartSuite,
we ran cost modeling at our expected query volume before choosing a model.
A model that costs 5x more but is 20% better in quality may not be worth
it if the baseline model already exceeds the quality threshold.

In practice at TapClicks we ran three model tiers:
- Fast/cheap for classification and routing (intent detection, query type
  classification) — small models, sub-100ms, fraction of a cent
- Mid-tier for structured generation (SQL generation, insight summarization)
  — medium models, good reasoning, predictable output format
- Premium for complex reasoning (cross-metric analysis, ambiguous natural
  language queries requiring interpretation) — frontier models, used sparingly

As models converge in capability (which they are — DeepSeek, Gemini, Claude,
GPT-4o are all within striking distance of each other on most benchmarks),
the differentiation shifts from raw capability to: latency SLAs, pricing
structure, context window, tool use quality, structured output reliability,
and vendor trust/compliance posture. For enterprise customers asking about
data governance, the model vendor's data handling policies matter as much
as the benchmark scores."

---

## Q9 — RAG VS FINE-TUNING FOR HALLUCINATIONS

**What they're testing:** Do you understand when to use which technique?
Can you articulate the hallucination problem precisely?

### Answer Framework

"Hallucination is fundamentally a knowledge problem — the model generates
plausible-sounding content that isn't grounded in facts. The solution depends
on why the model doesn't have the right knowledge.

RAG is the right answer when: the knowledge is private/proprietary (model
can't have been trained on it), the knowledge changes frequently (can't
keep fine-tuning), or you need citations and grounding (users need to
verify answers). At TapClicks, Ask Your Dashboard was a pure RAG use case —
the model needed to know the customer's specific campaign data, metric
definitions, and schema. That data changes daily and is proprietary.
Fine-tuning would be wrong because you'd need to retrain every time the
schema changes.

Fine-tuning is the right answer when: the problem is behavioral rather
than factual (model knows the facts but applies them in the wrong format
or style), you need consistent output structure (JSON schema that never
deviates), you have thousands of high-quality labeled examples, and the
knowledge is stable (doesn't change weekly).

At TapClicks SmartSuite, we had a hallucination problem that was partially
RAG and partially behavioral. The model would generate insights that were
technically accurate but framed in ways that were misleading for non-technical
users. RAG gave it the right data. Prompt engineering gave it behavioral
guardrails (always ground claims in the displayed metrics, never infer
causation from correlation, flag when data is insufficient). We considered
fine-tuning for the style/behavioral dimension but the labeled dataset we'd
have needed was too small and the format requirements changed as the product
evolved.

The underrated third option: structured output validation. Before RAG or
fine-tuning, constrain the model's output format so it cannot hallucinate
structural elements. If your model must return a JSON with specific fields
and those fields are validated against your data before display, you've
eliminated an entire class of hallucinations. We caught most SmartSuite
hallucinations this way — the model would try to reference a metric that
didn't exist in the dashboard, the validation layer would catch it and
trigger a retry with the valid metric list injected."

---

## Q10 — AUTHORITATIVE SOURCES FOR OUTPUTS

**What they're testing:** Do you have a governance mindset for AI outputs?
Do you understand retrieval quality as a product concern?

### Answer Framework

"This is fundamentally a data governance problem applied to AI systems.
The question is: how do you know that what the model retrieved and cited
is actually the ground truth?

At TapClicks Ask Your Dashboard, we had a clear answer to this: the only
authoritative source was the data in the customer's own dashboard — the
same data they could see with their eyes. We explicitly scoped the system
to only answer questions about data the customer had already ingested and
verified. No external knowledge, no model inference beyond the visible data.
That constraint eliminated a huge class of hallucination risk.

Three layers we built:

Source scoping — at query time, we injected only the customer's own schema
and data as context. The model could not fabricate a metric that wasn't
in their data model because it was never given the opportunity.

Citation requirements — every generated insight had to cite the specific
metric and time period it was derived from. If the model couldn't cite a
source from the injected context, the validation layer rejected the output.

Human review checkpoints — for high-stakes outputs (insights that would
be sent directly to a client), we added a review step. The agency could
see the AI-generated insight and the data that grounded it before sharing.

The broader principle: authoritative sources in AI systems aren't just
about what data you retrieve — they're about what data you explicitly
exclude. The scope boundary is as important as the retrieval quality."

---

## QUICK REFERENCE

Q3 — Batch vs real-time: start with "what decision does this enable
and how fast?" → batch-first default → micro-batch for trust →
real-time for autonomous action → campaign management war story
Q4 — Inference cost: prompt compression, model routing, caching,
structured output, batching → match cost strategy to latency requirement
Q5 — Model selection: capability × latency × cost → three-tier model
architecture → as models converge, differentiation shifts to latency/pricing/compliance
Q9 — RAG vs fine-tuning: RAG for proprietary/changing knowledge,
fine-tuning for behavioral/structural consistency → structured output
validation is the underrated third option
Q10 — Authoritative sources: source scoping, citation requirements,
human review checkpoints → exclusion boundary as important as retrieval quality
