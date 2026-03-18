# Job Search OS — Angshuman Rudra

Director of Product · AI + Data + MarTech · $250K+ · Target: May 31

---

## What's in this repo

| File | Purpose |
|------|---------|
| `dashboard_v3.jsx` | The full React dashboard — paste into v0.dev to deploy |
| `pm_jobs.py` | ATS scraper — scans 200 company career pages for open PM roles |

---

## Using the dashboard

The dashboard is deployed at your Vercel URL via v0.dev.

To update it after making changes to `dashboard_v3.jsx`:
1. Go to [v0.dev](https://v0.dev) and open your project
2. Open the code editor (`<>` icon)
3. Navigate to `components/dashboard.tsx`
4. Select all, paste the new contents of `dashboard_v3.jsx`
5. Hit **Publish**

---

## Using the job scraper

```bash
# Install dependency
pip install requests

# Run the scraper
python pm_jobs.py
```

This scans Greenhouse, Lever, Ashby, and Workday across ~200 companies.

**Output:**
- `pm_jobs.json` — upload this to the Job Scanner tab in your dashboard
- `pm_jobs.csv` — open in Excel or Google Sheets

**Run this weekly** to get fresh data. Add it to a cron job if you want it automated:
```bash
# Run every Monday at 8am (add to crontab)
0 8 * * 1 cd /path/to/job-search-os && python pm_jobs.py
```

---

## Pushing updates to GitHub

```bash
git add .
git commit -m "Update dashboard / scraper"
git push
```

---

## Pipeline summary

200 companies across 8 buckets:

| # | Bucket | Companies |
|---|--------|-----------|
| 1 | MarTech / AdTech / Data Activation | 35 |
| 2 | AI Platform & Agents | 25 |
| 3 | Data Platform & Infrastructure | 25 |
| 4 | High-Growth Series B–D | 15 |
| 5 | Enterprise LLM & Foundation Models | 25 |
| 6 | AI Observability / LLMOps / MLOps | 25 |
| 7 | Vector DB / RAG / AI Search Infra | 25 |
| 8 | Vertical AI — Enterprise Workflows | 25 |

---

## North star

**1 signed offer ≥ $250K base · H1B transfer · by May 31**
