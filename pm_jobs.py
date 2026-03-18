"""
pm_jobs.py — ATS Job Scraper
Scans Greenhouse, Lever, Ashby, and Workday for open PM roles
across your 200-company pipeline.

Usage:
    pip install requests
    python pm_jobs.py

Output:
    pm_jobs.json  — upload to Job Scanner tab in your dashboard
    pm_jobs.csv   — spreadsheet version
"""

import requests
import json
from datetime import datetime

KEYWORDS = [
    "product manager", "director of product", "head of product",
    "vp of product", "senior pm", "staff pm", "group pm",
    "principal pm", "product lead", "vp product"
]

GREENHOUSE = [
    "klaviyo", "braze", "amplitude", "attentive", "iterable",
    "bloomreach", "mparticle", "movableink", "doubleverify", "zetainc",
    "smartly", "sproutsocial", "contentsquare", "liftoff", "hubspot",
    "mutinyhq", "northbeam", "rockerbox", "improvado", "liveramp",
    "databricks", "snowflake", "dbtlabs", "fivetran", "airbyte",
    "astronomer", "montecarlo", "atlan", "collibra", "grafana",
    "mixpanel", "statsig", "sigmacomputing", "hex", "rippling",
    "ramp", "notion", "miro", "glean", "writer",
    "scaleai", "snorkelai", "observeai", "cresta", "clay",
    "demandbase", "gong", "outreach", "apolloio", "retool",
    "cohere", "perplexity", "togetherai", "baseten", "replicate",
    "arizeai", "wandb", "fiddler", "galileoai", "braintrust",
    "humanloop", "dominodatalab", "datarobot", "pinecone", "weaviate",
    "elastic", "algolia", "coveo", "unstructured", "llamaindex",
    "moveworks", "zendesk", "intercom", "freshworks", "assembled",
    "ironclad", "harvey", "veeva", "servicenow", "workday",
    "groq", "mistral", "fireworksai", "elevenlabs", "deepgram",
    "assemblyai", "contextualai", "vectara", "modal",
]

LEVER = [
    "hightouch", "census", "growthloop", "tealium", "simon-data",
    "insider", "treasure-data", "redpoint", "cordial", "ometria",
    "triple-whale", "dbt-labs", "prefect", "acceldata", "metaplane",
    "starburst", "materialize", "estuary", "heap", "omni",
    "pocus", "enterpret", "syncari", "narrator", "recurly",
    "fireworks-ai", "together-ai", "reka", "whylabs", "comet",
    "neptune-ai", "arthur-ai", "truera", "clearml", "future-agi",
    "qdrant", "credal", "ragie", "jina-ai", "decagon",
    "siena-ai", "parloa", "11x", "artisan-ai", "tonkean",
    "ema", "kustomer", "leena-ai", "bland-ai", "vapi", "pipefy",
    "cerebras", "inflection", "adept",
]

ASHBY = [
    "langchain", "relevance-ai", "dust", "qualified", "6sense",
    "forethought", "cognigy", "kore-ai", "chroma", "guru",
    "langfuse", "helicone", "portkey", "maxim-ai", "evidently",
    "zenml", "superwise", "voyage-ai", "aisera", "cohere",
    "mistral", "groq", "perplexity", "weights-biases",
    "galileo", "braintrust-data",
]

WORKDAY = [
    {"company": "Adobe",      "tenant": "adobe",      "id": "adobe"},
    {"company": "Salesforce", "tenant": "salesforce", "id": "salesforce"},
    {"company": "Databricks", "tenant": "databricks", "id": "databricks"},
    {"company": "Snowflake",  "tenant": "snowflake",  "id": "snowflake"},
    {"company": "ServiceNow", "tenant": "servicenow", "id": "servicenow"},
    {"company": "Zendesk",    "tenant": "zendesk",    "id": "zendesk"},
    {"company": "HubSpot",    "tenant": "hubspot",    "id": "hubspot"},
    {"company": "Veeva",      "tenant": "veeva",      "id": "veeva"},
]

results = []

def matches(title):
    return any(k in title.lower() for k in KEYWORDS)

def ts():
    return datetime.now().strftime("%H:%M:%S")

def to_name(slug):
    return slug.replace("-", " ").replace("_", " ").title()


print(f"\n[{ts()}] Greenhouse — {len(GREENHOUSE)} companies")
for slug in GREENHOUSE:
    try:
        r = requests.get(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true", timeout=10)
        if r.status_code != 200: continue
        for job in r.json().get("jobs", []):
            if matches(job.get("title", "")):
                results.append({
                    "company": to_name(slug), "ats": "Greenhouse",
                    "title": job.get("title", ""),
                    "location": job.get("location", {}).get("name", ""),
                    "url": job.get("absolute_url", ""),
                    "posted": job.get("updated_at", "")[:10],
                })
    except Exception as e:
        print(f"  ✗ {slug}: {e}")
print(f"  → {len([r for r in results if r['ats']=='Greenhouse'])} roles")


print(f"\n[{ts()}] Lever — {len(LEVER)} companies")
lever_start = len(results)
for slug in LEVER:
    try:
        r = requests.get(f"https://api.lever.co/v0/postings/{slug}?mode=json", timeout=10)
        if r.status_code != 200: continue
        for job in r.json():
            if matches(job.get("text", "")):
                ts_ms = job.get("createdAt", 0)
                results.append({
                    "company": to_name(slug), "ats": "Lever",
                    "title": job.get("text", ""),
                    "location": job.get("categories", {}).get("location", ""),
                    "url": job.get("hostedUrl", ""),
                    "posted": datetime.fromtimestamp(ts_ms / 1000).strftime("%Y-%m-%d") if ts_ms else "",
                })
    except Exception as e:
        print(f"  ✗ {slug}: {e}")
print(f"  → {len(results) - lever_start} roles")


print(f"\n[{ts()}] Ashby — {len(ASHBY)} companies")
ashby_start = len(results)
for slug in ASHBY:
    try:
        payload = {
            "operationName": "ApiJobBoardWithTeams",
            "variables": {"organizationHostedJobsPageName": slug},
            "query": "query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) { jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) { jobPostings { id title locationName jobUrl publishedDate } } }"
        }
        r = requests.post("https://jobs.ashbyhq.com/api/non-user-graphql", json=payload, timeout=10)
        if r.status_code != 200: continue
        for job in ((r.json().get("data") or {}).get("jobBoard") or {}).get("jobPostings", []):
            if matches(job.get("title", "")):
                results.append({
                    "company": to_name(slug), "ats": "Ashby",
                    "title": job.get("title", ""),
                    "location": job.get("locationName", ""),
                    "url": job.get("jobUrl", ""),
                    "posted": (job.get("publishedDate") or "")[:10],
                })
    except Exception as e:
        print(f"  ✗ {slug}: {e}")
print(f"  → {len(results) - ashby_start} roles")


print(f"\n[{ts()}] Workday — {len(WORKDAY)} companies")
workday_start = len(results)
for co in WORKDAY:
    try:
        url = f"https://{co['tenant']}.wd5.myworkdayjobs.com/wday/cxs/{co['tenant']}/{co['id']}/jobs"
        r = requests.post(url, json={"appliedFacets": {}, "limit": 20, "offset": 0, "searchText": "product manager"},
                          headers={"Content-Type": "application/json"}, timeout=10)
        if r.status_code != 200: continue
        for job in r.json().get("jobPostings", []):
            if matches(job.get("title", "")):
                results.append({
                    "company": co["company"], "ats": "Workday",
                    "title": job.get("title", ""),
                    "location": job.get("locationsText", ""),
                    "url": f"https://{co['tenant']}.wd5.myworkdayjobs.com/en-US/{co['id']}/job/{job.get('externalPath', '')}",
                    "posted": job.get("postedOn", ""),
                })
    except Exception as e:
        print(f"  ✗ {co['company']}: {e}")
print(f"  → {len(results) - workday_start} roles")


print(f"\n{'='*55}")
print(f"TOTAL OPEN PM ROLES: {len(results)}")
print(f"{'='*55}\n")
for r in sorted(results, key=lambda x: x["company"]):
    print(f"  {r['company']:28} {r['title']:38} {r['location']}")

with open("pm_jobs.json", "w") as f:
    json.dump(results, f, indent=2)

with open("pm_jobs.csv", "w") as f:
    f.write("Company,ATS,Title,Location,Posted,URL\n")
    for r in results:
        f.write(f'"{r["company"]}","{r["ats"]}","{r["title"]}","{r["location"]}","{r["posted"]}","{r["url"]}"\n')

print(f"\nSaved → pm_jobs.json  (upload to dashboard Job Scanner tab)")
print(f"      → pm_jobs.csv   (open in Excel/Sheets)")
