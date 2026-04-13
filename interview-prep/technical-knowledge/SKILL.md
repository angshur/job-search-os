---
name: interview-prep/technical-knowledge
description: >
  Angshuman's durable technical knowledge base covering the three core
  modules: System Design, Data Engineering Depth, and AI/ML POV.
  Load this when being quizzed on technical concepts, system design
  questions, or when needing to demonstrate deep technical credibility.
  References content.json (55 topics) as the primary knowledge source.
---

# Technical Knowledge — Modules 1, 2, 3

## HOW TO USE THIS SKILL

This skill covers what you know, not how you answer interview questions
about what you've done (that's technical-depth/SKILL.md).

When an interviewer asks "walk me through how Kafka works" or "design
a real-time analytics system" or "what's your take on RAG vs fine-tuning"
— this is the knowledge base that backs those answers.

The content.json file (55 topics) is the detailed reference.
This skill provides the altitude map — how topics connect, which ones
to lead with, and the engineering blog POVs that elevate answers.

---

## MODULE 1 — SYSTEM DESIGN

### What "Ready" Looks Like
Can walk through a system design for a data-heavy product in 35 minutes.
Knows the canonical patterns cold. Adapts to the domain in the room.

### The 3 Canonical Designs to Know Cold

**1. Real-Time Marketing Analytics Platform (your TapClicks story)**
- Ingestion: Kafka (message bus + rate limit buffer), hybrid API/webhook
- Batch path: Spark jobs → S3/GCS → Parquet → dbt transformations
- Speed path: Flink → ClickHouse for sub-second dashboard queries
- Serving: ClickHouse for real-time, Trino for ad-hoc, REST API for customers
- Observability: freshness SLAs per connector, volume anomaly detection,
  schema validation on ingest
- Key decision: not all 200+ sources need real-time — batch for long-tail,
  streaming for high-value platforms only

**2. ML Platform (Uber Michelangelo pattern)**
- Data layer: feature store (offline in S3/warehouse, online in Redis/Cassandra)
- Training: distributed Spark/Ray, experiment tracking (MLflow), model registry
- Serving: online (REST/gRPC, low-latency), batch (scheduled Spark scoring)
- Monitoring: data drift detection (Evidently), prediction drift, hourly
  ground truth comparison
- Key insight: feature store is the most important investment — eliminates
  training-serving skew which is the #1 silent production failure

**3. Agentic AI System (Ask Your Dashboard pattern)**
- Intent classification → query planning → SQL generation → validation
  → result synthesis → response
- Reliability: structured output at every LLM step, query validation before
  execution, result sanity checks, human escalation path
- Memory: in-context for current session, vector DB for schema/metric
  definitions, Redis for action state
- Key failure modes: ambiguity (explicit disambiguation before querying),
  error compounding (validate at each step), context window exhaustion
  (compress aggressively)

### Lambda vs Kappa — The Core Architecture Decision
Lambda: batch layer (accuracy) + speed layer (latency) + serving layer
(merge). Uber's model at exabyte scale. Right for: heterogeneous needs,
batch and streaming genuinely different.
Kappa: single streaming path for everything. Simpler. Right for: streaming
dominates, Kafka tiered storage enables reprocessing, small team.

### Engineering Blog POVs to Reference
- Uber: Lambda architecture at 1.5 exabyte scale, Pinot for sub-second
  product analytics, DataMesh GCS migration (path translation service)
- Airbnb: Riverbed streaming platform for personalization, Zipline feature
  store, Druid for real-time analytics
- Netflix: Metaflow for ML lifecycle (human-centric, laptop→production),
  Maestro for production orchestration, Iceberg + Spark data lake

---

## MODULE 2 — DATA ENGINEERING DEPTH

### What "Ready" Looks Like
Can discuss any data engineering topic with enough depth to be credible
with a Staff engineer. Can connect technical decisions to product outcomes.
Has real war stories for the hardest problems.

### The Core Topics (from content.json)

**Data Infrastructure**
- dbt: transformation framework, staging→intermediate→marts, semantic layer
  as the key PM insight (define metrics once, used everywhere)
- Spark vs Flink: batch-first vs stream-first, when each wins
- Delta Lake / Iceberg: ACID transactions on data lakes, time travel,
  schema evolution — the table format that enables all modern data stacks
- ELT / Reverse ETL: modern pattern (load then transform), Hightouch/Census
  for syncing warehouse back to operational tools
- CDC (Debezium): log-based CDC from Postgres WAL/MySQL binlog, zero
  additional load on production DB, exactly-once via transactions
- Pipeline Orchestration: Airflow (incumbent, task-centric, ecosystem),
  Dagster (asset-centric, best for complex data stacks), Prefect (developer-friendly)

**Data Quality & Observability**
- Five pillars: freshness, volume, schema, distribution, lineage
- Your story: Data Load Status feature eliminated data-matching as primary
  churn driver — observability restores trust faster than correctness
- Tools: Monte Carlo (ML-based anomaly detection), Great Expectations
  (rule-based), dbt tests (transformation-layer quality gates)

**Data Contracts**
- Formal, versioned agreement between producer and consumer
- Schema registry (Confluent) for enforcement at the Kafka layer
- The friction is the feature — breaking changes require coordination
  that should have happened anyway
- Your story: 200+ integrations, API schema drift was a constant pain —
  data contracts would have inverted the detection model

**Query Engines**
- ClickHouse: best for B2B SaaS analytics at moderate scale, SQL-native,
  excellent compression, materialized views
- Pinot: user-facing analytics at Uber/LinkedIn scale, sub-second at
  millions of QPS, more operationally complex
- Trino/Presto: ad-hoc SQL over object storage, federated queries

**Distributed Systems**
- Kafka deep: partitions, consumer groups, offsets, exactly-once semantics,
  replication slots, tiered storage
- CAP theorem, consistency models, distributed transactions

### Your Differentiating War Stories for Data Engineering
1. Real-time campaign management — Kafka + Redis, closed-loop system,
   feedback loop failure and fix
2. 200+ connector integrations — quota management, schema drift, idempotent
   retries, audit logs
3. Data quality as churn prevention — Data Load Status story
4. Transformation layer persona discovery — instrumentation revealed wrong
   user model, pivoted to non-technical users

---

## MODULE 3 — AI/ML POINT OF VIEW

### What "Ready" Looks Like
Can speak credibly about the full ML/AI pipeline. Has a strong POV on
where the market is going. Has real war stories from shipping AI features.
Can discuss technical tradeoffs (RAG vs fine-tuning, cost vs quality) with
precision.

### The Core Topics (from content.json)

**Agentic Systems**
- Core loop: perceive → plan → act → observe → iterate
- Planning patterns: ReAct (reason + act), Plan-and-Execute, Tree-of-Thoughts
- Memory: in-context (fast, limited), external semantic (vector DB, unlimited),
  external episodic (structured DB, accurate lookups)
- Multi-agent: orchestrator + workers, parallel specialists, sequential pipeline
- Reliability: structured output, retry with reflection, human-in-the-loop,
  graceful degradation
- Your story: Ask Your Dashboard (full agentic loop), AI Operator Agents
  (actions inside the application from natural language)

**LLM Evaluation**
- Eval types: functional, safety, behavioral, performance, regression
- LLM-as-judge: scalable, needs calibration against human labels
- RAGAS: faithfulness, answer relevancy, context recall, context precision
- Golden dataset: 50-100 representative queries with expected outputs,
  run on every prompt change — treated like a test suite
- Your story: SmartSuite reliability framework — informal evals practice
  (prompt versioning, output validation, feedback loops)

**Fine-tuning vs RAG vs Prompt Engineering**
- Always start with prompt engineering — free and instant
- Add RAG when model lacks the knowledge (private data, recent events)
- Fine-tune only when behavior is the problem, not knowledge, and you have
  thousands of labeled examples
- Your story: Ask Your Dashboard → prompt + RAG (schema changes too frequently
  to fine-tune); SmartSuite → prompt engineering only (task well-specified)

**ML Pipeline End-to-End**
- Feature store: offline (S3/warehouse, training) + online (Redis/Cassandra,
  serving) — same definition, two paths
- Training-serving skew: the #1 silent production failure — shared feature
  computation eliminates it
- Drift monitoring: data drift (input distribution shift), concept drift
  (label relationship change), prediction drift (output distribution shift)
- Model serving: quantization, distillation, batching for async workloads

**LLM Reliability in Production**
- Four failure modes: hallucination, inconsistency, latency variance,
  context window exhaustion
- Structured output: single highest-leverage reliability improvement
- GenAI Gateway pattern (Uber): PII redaction, cost tracking, rate limiting,
  audit logging, model routing — enterprise AI governance standard
- Your story: SmartSuite — structured output constraints, retry with reflection,
  human-in-the-loop feedback, hallucination mitigation

### Your Strong POV on AI/ML — Deploy in Any Interview

"The shift I've seen most clearly from building AI features in production:
the hard problem is never the model. The hard problem is the data layer
underneath it and the reliability engineering around it.

SmartSuite worked not because we found a better model — it worked because
we constrained the output format, validated against source data, built
a feedback loop, and gave users a way to correct the system. That's
reliability engineering, not AI research.

And the thing I see most companies still getting wrong: they treat
fine-tuning as the first resort and RAG as the second. It should be
the opposite. Start with prompt engineering. Add RAG when the model
lacks the knowledge. Fine-tune only when you have thousands of labeled
examples and the problem is behavioral consistency, not knowledge."

### The Semantic Layer Gap — Your Differentiated POV

"Nadella says SaaS business logic moves to AI agents. Huang says the
factory wins when intelligence is a commodity. Both are right. But neither
is asking the harder question: who gives the agent the map of the data
that used to be hard-coded in software?

When business logic lived in code, the code knew what the data meant.
When you move it to an agent, the agent is stateless — it doesn't know
what your data means, how entities relate, or what the business rules are.
Someone has to give it that semantic context.

That's the unsexy infrastructure gap that nobody has fully solved yet.
Data contracts, semantic layers, knowledge graphs, RAG pipelines — they're
all partial answers. The company that solves this owns the agentic enterprise."

---

## CONNECTING MODULES 1, 2, 3

The three modules aren't separate — they're layers of the same stack:

Data Engineering (Module 2) → feeds → System Design (Module 1)
→ which enables → AI/ML features (Module 3)

In interviews, connect them: "The reason our AI features at TapClicks could
work is because we had a reliable data layer underneath them. The Ask Your
Dashboard agent could only answer questions about data the customer had
already ingested and validated. The data engineering infrastructure was the
prerequisite for the AI product — not the other way around."

That connection is what separates Director/VP candidates from PM candidates
who understand AI in isolation.
