import { useState, useEffect } from "react";

const BUCKETS = [
  { id: 1, label: "MarTech / AdTech / Data Activation",  color: "#0D7A5F", bg: "#EDFAF5", target: 35 },
  { id: 2, label: "AI Platform & Agents",                 color: "#1D5FA8", bg: "#EBF3FF", target: 25 },
  { id: 3, label: "Data Platform & Infrastructure",       color: "#A0640A", bg: "#FFF8EB", target: 25 },
  { id: 4, label: "High-Growth Series B–D",               color: "#B03A2E", bg: "#FFF0EE", target: 15 },
  { id: 5, label: "Enterprise LLM & Foundation Models",   color: "#6B3FA0", bg: "#F5F0FF", target: 25 },
  { id: 6, label: "AI Observability / LLMOps / MLOps",   color: "#B5377A", bg: "#FFF0F7", target: 25 },
  { id: 7, label: "Vector DB / RAG / AI Search Infra",   color: "#0E7490", bg: "#EDFAFD", target: 25 },
  { id: 8, label: "Vertical AI — Enterprise Workflows",  color: "#8B4513", bg: "#FFF4ED", target: 25 },
];

const STAGES = ["Tracking", "Applied", "Recruiter Screen", "HM Interview", "Panel/Loop", "Offer"];
const STAGE_COLORS = {
  "Tracking": "#9CA3AF", "Applied": "#1D5FA8", "Recruiter Screen": "#6B3FA0",
  "HM Interview": "#A0640A", "Panel/Loop": "#B03A2E", "Offer": "#0D7A5F",
};
const FUNNEL_TARGETS = { "Tracking": 200, "Applied": 60, "Recruiter Screen": 30, "HM Interview": 15, "Panel/Loop": 7, "Offer": 1 };
const WEEKLY_TARGETS = { applications: 7, networking: 10, recruiterOutreach: 5 };

const mk = (id, name, bucket, priority, openRoles = 0) => ({ id, name, bucket, stage: "Tracking", notes: "", priority, openRoles });

const INITIAL_COMPANIES = [
  mk(1,"Klaviyo",1,"high",3), mk(2,"Braze",1,"high",2), mk(3,"Attentive",1,"high",1),
  mk(4,"Iterable",1,"high",2), mk(5,"Bloomreach",1,"high",1), mk(6,"Insider",1,"high",2),
  mk(7,"Simon Data",1,"high",1), mk(8,"Tealium",1,"high",0), mk(9,"mParticle",1,"high",1),
  mk(10,"Treasure Data",1,"high",0), mk(11,"Redpoint Global",1,"medium",0), mk(12,"Ometria",1,"medium",1),
  mk(13,"Cordial",1,"medium",0), mk(14,"Movable Ink",1,"medium",1), mk(15,"Zeta Global",1,"medium",2),
  mk(16,"Amplitude",1,"high",3), mk(17,"Mixpanel",1,"high",2), mk(18,"Contentsquare",1,"high",2),
  mk(19,"DoubleVerify",1,"medium",1), mk(20,"Northbeam",1,"medium",0), mk(21,"Triple Whale",1,"medium",1),
  mk(22,"Rockerbox",1,"medium",0), mk(23,"Hightouch",1,"high",2), mk(24,"Census",1,"high",1),
  mk(25,"GrowthLoop",1,"high",1), mk(26,"HubSpot",1,"medium",5), mk(27,"Metadata.io",1,"medium",1),
  mk(28,"Mutiny",1,"medium",0), mk(29,"Smartly",1,"medium",1), mk(30,"Sprout Social",1,"medium",2),
  mk(31,"LiveRamp",1,"high",2), mk(32,"Funnel.io",1,"medium",0), mk(33,"Improvado",1,"medium",1),
  mk(34,"Adobe",1,"high",8), mk(35,"Salesforce",1,"medium",12),
  mk(36,"Glean",2,"high",2), mk(37,"Writer",2,"high",2), mk(38,"Cohere",2,"high",3),
  mk(39,"Jasper",2,"high",1), mk(40,"Clay",2,"high",2), mk(41,"6sense",2,"high",3),
  mk(42,"Gong",2,"high",4), mk(43,"Qualified",2,"medium",1), mk(44,"Demandbase",2,"medium",2),
  mk(45,"Apollo.io",2,"medium",3), mk(46,"Outreach",2,"medium",2), mk(47,"Observe.AI",2,"medium",1),
  mk(48,"Cresta",2,"medium",1), mk(49,"Snorkel AI",2,"medium",1), mk(50,"Scale AI",2,"medium",3),
  mk(51,"Relevance AI",2,"medium",0), mk(52,"Forethought",2,"medium",1), mk(53,"Unify",2,"medium",0),
  mk(54,"Pocus",2,"high",1), mk(55,"Enterpret",2,"medium",0), mk(56,"Retool",2,"medium",2),
  mk(57,"LangChain",2,"medium",1), mk(58,"AI21 Labs",2,"medium",1), mk(59,"Cognigy",2,"low",0),
  mk(60,"Kore.ai",2,"low",0),
  mk(61,"Databricks",3,"high",6), mk(62,"Snowflake",3,"high",8), mk(63,"dbt Labs",3,"high",2),
  mk(64,"Fivetran",3,"high",2), mk(65,"Airbyte",3,"high",2), mk(66,"Segment (Twilio)",3,"high",3),
  mk(67,"Astronomer",3,"high",1), mk(68,"Prefect",3,"medium",0), mk(69,"Monte Carlo",3,"high",2),
  mk(70,"Acceldata",3,"medium",0), mk(71,"Atlan",3,"medium",1), mk(72,"Alation",3,"medium",2),
  mk(73,"Collibra",3,"medium",2), mk(74,"Starburst",3,"medium",1), mk(75,"Materialize",3,"medium",0),
  mk(76,"Estuary",3,"medium",0), mk(77,"Grafana Labs",3,"medium",3), mk(78,"Statsig",3,"high",1),
  mk(79,"Heap",3,"medium",1), mk(80,"Metaplane",3,"medium",0), mk(81,"Qlik",3,"medium",2),
  mk(82,"ThoughtSpot",3,"medium",2), mk(83,"Sigma Computing",3,"high",1), mk(84,"Omni",3,"high",1),
  mk(85,"Hex",3,"high",1),
  mk(86,"Rippling",4,"high",4), mk(87,"Ramp",4,"medium",3), mk(88,"Notion",4,"medium",2),
  mk(89,"Miro",4,"medium",3), mk(90,"Mosaic",4,"medium",1), mk(91,"Viable",4,"medium",0),
  mk(92,"Syncari",4,"medium",0), mk(93,"Narrator",4,"medium",0), mk(94,"Endgame",4,"medium",0),
  mk(95,"Coefficient",4,"low",0), mk(96,"Liftoff",4,"medium",1), mk(97,"Taboola",4,"low",2),
  mk(98,"Recurly",4,"medium",1), mk(99,"Enterpret",4,"medium",0), mk(100,"Pipefy",4,"low",1),
  mk(101,"Cohere",5,"high",3), mk(102,"Mistral AI",5,"high",2), mk(103,"AI21 Labs",5,"medium",1),
  mk(104,"Together AI",5,"high",2), mk(105,"Fireworks AI",5,"high",1), mk(106,"Groq",5,"high",2),
  mk(107,"Cerebras Systems",5,"medium",1), mk(108,"Perplexity AI",5,"high",3), mk(109,"Inflection AI",5,"medium",0),
  mk(110,"Adept AI",5,"medium",0), mk(111,"ElevenLabs",5,"medium",2), mk(112,"Deepgram",5,"medium",1),
  mk(113,"AssemblyAI",5,"medium",1), mk(114,"Reka AI",5,"medium",0), mk(115,"Contextual AI",5,"high",1),
  mk(116,"Vectara",5,"high",1), mk(117,"OctoAI",5,"medium",0), mk(118,"Baseten",5,"medium",1),
  mk(119,"Modal",5,"medium",1), mk(120,"Replicate",5,"medium",1), mk(121,"Imbue",5,"medium",0),
  mk(122,"Runway",5,"low",1), mk(123,"Ideogram",5,"low",0), mk(124,"Character AI",5,"low",1),
  mk(125,"Prem AI",5,"low",0),
  mk(126,"Arize AI",6,"high",2), mk(127,"Weights & Biases",6,"high",3), mk(128,"Fiddler AI",6,"high",1),
  mk(129,"WhyLabs",6,"medium",0), mk(130,"Galileo AI",6,"high",2), mk(131,"Braintrust",6,"high",1),
  mk(132,"Humanloop",6,"high",1), mk(133,"Langfuse",6,"medium",0), mk(134,"Helicone",6,"medium",0),
  mk(135,"Portkey AI",6,"medium",0), mk(136,"Maxim AI",6,"high",1), mk(137,"Comet ML",6,"medium",1),
  mk(138,"Neptune AI",6,"medium",0), mk(139,"Domino Data Lab",6,"high",2), mk(140,"DataRobot",6,"high",3),
  mk(141,"H2O.ai",6,"medium",1), mk(142,"Evidently AI",6,"medium",0), mk(143,"Arthur AI",6,"medium",1),
  mk(144,"Truera",6,"medium",0), mk(145,"ClearML",6,"medium",1), mk(146,"Future AGI",6,"medium",0),
  mk(147,"Censius",6,"low",0), mk(148,"Valohai",6,"low",0), mk(149,"ZenML",6,"low",0),
  mk(150,"Superwise",6,"low",0),
  mk(151,"Pinecone",7,"high",2), mk(152,"Weaviate",7,"high",1), mk(153,"Qdrant",7,"medium",1),
  mk(154,"Chroma",7,"medium",0), mk(155,"Milvus / Zilliz",7,"medium",1), mk(156,"Marqo",7,"medium",0),
  mk(157,"Vectara",7,"high",1), mk(158,"Contextual AI",7,"high",1), mk(159,"Elastic",7,"high",4),
  mk(160,"Algolia",7,"high",3), mk(161,"Coveo",7,"medium",2), mk(162,"Glean",7,"high",2),
  mk(163,"Aisera",7,"medium",1), mk(164,"Guru",7,"medium",1), mk(165,"Dust",7,"medium",0),
  mk(166,"Credal AI",7,"medium",0), mk(167,"Ragie",7,"medium",0), mk(168,"LlamaIndex",7,"medium",1),
  mk(169,"Unstructured",7,"high",1), mk(170,"Jina AI",7,"medium",0), mk(171,"Voyage AI",7,"medium",0),
  mk(172,"Firecrawl",7,"low",0), mk(173,"Apify",7,"low",0), mk(174,"Notion AI",7,"medium",2),
  mk(175,"Cohere Embed",7,"high",0),
  mk(176,"Moveworks",8,"high",2), mk(177,"ServiceNow AI",8,"high",6), mk(178,"Zendesk AI",8,"high",4),
  mk(179,"Intercom AI",8,"high",3), mk(180,"Decagon",8,"high",1), mk(181,"Harvey AI",8,"medium",1),
  mk(182,"Salesforce Einstein",8,"high",5), mk(183,"Workday AI",8,"medium",3), mk(184,"Freshworks AI",8,"medium",2),
  mk(185,"Kustomer",8,"medium",1), mk(186,"Assembled",8,"medium",1), mk(187,"Leena AI",8,"medium",0),
  mk(188,"Ema",8,"high",1), mk(189,"Siena AI",8,"medium",0), mk(190,"Parloa",8,"medium",0),
  mk(191,"Bland AI",8,"medium",0), mk(192,"Vapi",8,"medium",1), mk(193,"11x AI",8,"medium",1),
  mk(194,"Artisan AI",8,"medium",1), mk(195,"Ironclad",8,"medium",1), mk(196,"Veeva Systems",8,"medium",3),
  mk(197,"Pipefy",8,"low",0), mk(198,"Tonkean",8,"low",0), mk(199,"Kyber",8,"low",0),
  mk(200,"Ema",8,"high",1),
];

function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

export default function Dashboard() {
  const [companies, setCompanies] = useState(() => {
    try { const s = localStorage.getItem("jsp3_co"); return s ? JSON.parse(s) : INITIAL_COMPANIES; }
    catch { return INITIAL_COMPANIES; }
  });
  const [weekly, setWeekly] = useState(() => {
    try { const s = localStorage.getItem("jsp3_wk"); return s ? JSON.parse(s) : { applications: 0, networking: 0, recruiterOutreach: 0, week: getCurrentWeek() }; }
    catch { return { applications: 0, networking: 0, recruiterOutreach: 0, week: getCurrentWeek() }; }
  });
  const [tab, setTab] = useState("funnel");
  const [bucketFilter, setBucketFilter] = useState(0);
  const [stageFilter, setStageFilter] = useState("All");
  const [prioFilter, setPrioFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingRolesId, setEditingRolesId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCo, setNewCo] = useState({ name: "", bucket: 1, priority: "medium" });
  const [scanResults, setScanResults] = useState([]);
  const [scanMeta, setScanMeta] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { try { localStorage.setItem("jsp3_co", JSON.stringify(companies)); } catch {} }, [companies]);
  useEffect(() => { try { localStorage.setItem("jsp3_wk", JSON.stringify(weekly)); } catch {} }, [weekly]);

  const updateStage = (id, stage) => setCompanies(p => p.map(c => c.id === id ? { ...c, stage } : c));
  const updateNotes = (id, notes) => setCompanies(p => p.map(c => c.id === id ? { ...c, notes } : c));
  const updateRoles = (id, val) => setCompanies(p => p.map(c => c.id === id ? { ...c, openRoles: parseInt(val) || 0 } : c));
  const removeCompany = (id) => setCompanies(p => p.filter(c => c.id !== id));
  const addCompany = () => {
    if (!newCo.name.trim()) return;
    const id = Math.max(...companies.map(c => c.id), 200) + 1;
    setCompanies(p => [...p, { ...newCo, id, stage: "Tracking", notes: "", openRoles: 0 }]);
    setNewCo({ name: "", bucket: 1, priority: "medium" });
    setShowAdd(false);
  };

  const funnelCounts = STAGES.reduce((a, s) => ({ ...a, [s]: companies.filter(c => c.stage === s).length }), {});
  const totalActive = companies.filter(c => c.stage !== "Tracking").length;
  const highPri = companies.filter(c => c.priority === "high").length;
  const totalRoles = companies.reduce((s, c) => s + (c.openRoles || 0), 0);
  const pct = (v, m) => Math.min(100, Math.round((v / m) * 100));

  const filtered = companies
    .filter(c => bucketFilter === 0 || c.bucket === bucketFilter)
    .filter(c => stageFilter === "All" || c.stage === stageFilter)
    .filter(c => prioFilter === "All" || c.priority === prioFilter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const processJobFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jobs = JSON.parse(e.target.result);
        if (!Array.isArray(jobs)) throw new Error("Expected JSON array");
        setScanResults(jobs);
        setScanMeta({ filename: file.name, date: new Date().toLocaleDateString(), count: jobs.length });
        // Update open roles counts in pipeline
        const counts = {};
        jobs.forEach(j => {
          const coName = (j.company || "").toLowerCase();
          const match = companies.find(c =>
            c.name.toLowerCase().includes(coName) || coName.includes(c.name.toLowerCase())
          );
          if (match) counts[match.id] = (counts[match.id] || 0) + 1;
        });
        if (Object.keys(counts).length) {
          setCompanies(p => p.map(c => counts[c.id] !== undefined ? { ...c, openRoles: counts[c.id] } : c));
        }
      } catch {
        alert("Could not parse file. Make sure it's the pm_jobs.json output from the Python script.");
      }
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e) => processJobFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processJobFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const S = { bg:"#F7F4EF", card:"#FFFFFF", border:"#E5E0D8", borderL:"#EDE9E2", text:"#1C1917", mid:"#6B6560", light:"#9C9590", accent:"#0D7A5F" };

  return (
    <div style={{ fontFamily:"'DM Mono','Courier New',monospace", background:S.bg, minHeight:"100vh", color:S.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#EDE9E2}::-webkit-scrollbar-thumb{background:#C8C0B8;border-radius:2px}
        .tb{background:none;border:none;cursor:pointer;transition:all .2s;font-family:inherit}
        .sel{background:#F7F4EF;border:1px solid #DDD8CF;color:#1C1917;padding:4px 8px;border-radius:4px;font-family:inherit;font-size:11px;cursor:pointer}
        .sel:focus{outline:none;border-color:#0D7A5F}
        .xb{background:none;border:1px solid #E5E0D8;color:#9C9590;cursor:pointer;padding:3px 8px;border-radius:4px;font-size:11px;font-family:inherit;transition:all .2s}
        .xb:hover{border-color:#B03A2E;color:#B03A2E}
        .ab{background:#0D7A5F;border:none;color:#fff;cursor:pointer;padding:8px 16px;border-radius:6px;font-size:12px;font-family:inherit;font-weight:500}
        .ab:hover{background:#0A6350}
        .sb{background:#1D5FA8;border:none;color:#fff;cursor:pointer;padding:9px 20px;border-radius:6px;font-size:12px;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:8px}
        .sb:hover{background:#174E8C}
        .sb:disabled{background:#9BB8D8;cursor:not-allowed}
        .ib{background:#F0EDE8;border:1px solid #DDD8CF;color:#1C1917;cursor:pointer;width:28px;height:28px;border-radius:4px;font-size:16px;display:flex;align-items:center;justify-content:center}
        .ib:hover{border-color:#0D7A5F;color:#0D7A5F}
        .fs{background:#fff;border:1px solid #DDD8CF;color:#6B6560;padding:6px 10px;border-radius:4px;font-family:inherit;font-size:11px;cursor:pointer}
        .fs:focus{outline:none;border-color:#0D7A5F}
        .si{background:#fff;border:1px solid #DDD8CF;color:#1C1917;padding:6px 12px;border-radius:4px;font-family:inherit;font-size:12px;width:200px}
        .si:focus{outline:none;border-color:#0D7A5F}
        .mi{background:#F7F4EF;border:1px solid #DDD8CF;color:#1C1917;padding:8px 12px;border-radius:6px;font-family:inherit;font-size:13px;width:100%}
        .mi:focus{outline:none;border-color:#0D7A5F}
        .ms{background:#F7F4EF;border:1px solid #DDD8CF;color:#1C1917;padding:8px 12px;border-radius:6px;font-family:inherit;font-size:13px;width:100%}
        .nt{background:transparent;border:none;color:#6B6560;font-family:inherit;font-size:11px;width:100%;resize:none}
        .nt:focus{outline:none;color:#1C1917}
        .ri{background:transparent;border:none;border-bottom:1px solid #1D5FA8;color:#1D5FA8;font-family:inherit;font-size:12px;width:44px;text-align:center;font-weight:600}
        .ri:focus{outline:none}
        .rh:hover{background:#FAF8F5!important}
        .pb{padding:2px 7px;border-radius:3px;font-size:10px;font-weight:500;letter-spacing:.05em;text-transform:uppercase}
        @keyframes spin{to{transform:rotate(360deg)}}
        .sp{animation:spin 1s linear infinite;display:inline-block}
        @keyframes fi{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
        .fi{animation:fi .25s ease forwards}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${S.border}`, padding:"16px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:800, letterSpacing:"-0.02em" }}>JOB SEARCH OS</div>
          <div style={{ fontSize:"10px", color:S.light, marginTop:"2px", letterSpacing:".08em" }}>DIRECTOR OF PRODUCT · AI + DATA + MARTECH · $250K+ · MAY 31</div>
        </div>
        <div style={{ display:"flex", gap:"24px" }}>
          {[[companies.length,"COMPANIES","#0D7A5F"],[totalActive,"IN PIPELINE","#1D5FA8"],[highPri,"HIGH PRIORITY","#6B3FA0"],[totalRoles,"OPEN ROLES","#A0640A"],[funnelCounts["Offer"],"OFFERS","#B03A2E"]].map(([v,l,c])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"20px", fontWeight:500, color:c }}>{v}</div>
              <div style={{ fontSize:"9px", color:S.light, letterSpacing:".08em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${S.border}`, padding:"0 28px", display:"flex" }}>
        {[["funnel","FUNNEL"],["pipeline","PIPELINE"],["scanner","JOB SCANNER"],["weekly","WEEKLY"]].map(([id,label])=>(
          <button key={id} className="tb" onClick={()=>setTab(id)} style={{ padding:"12px 18px", fontSize:"11px", letterSpacing:".1em", color:tab===id?"#0D7A5F":S.light, borderBottom:tab===id?"2px solid #0D7A5F":"2px solid transparent" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding:"24px 28px" }}>

        {/* ── FUNNEL ── */}
        {tab==="funnel" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"10px", marginBottom:"20px" }}>
              {STAGES.map(stage=>(
                <div key={stage} style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", padding:"14px", borderTop:`3px solid ${STAGE_COLORS[stage]}`, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:"24px", fontWeight:300, color:STAGE_COLORS[stage] }}>{funnelCounts[stage]}</div>
                  <div style={{ fontSize:"9px", color:S.light, marginTop:"4px", letterSpacing:".06em" }}>{stage.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
              <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:"10px", color:S.light, letterSpacing:".1em", marginBottom:"16px" }}>CONVERSION FUNNEL</div>
                {STAGES.map((stage,i)=>{
                  const count=funnelCounts[stage], target=Object.values(FUNNEL_TARGETS)[i], color=STAGE_COLORS[stage];
                  return (
                    <div key={stage} style={{ marginBottom:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:color }} />
                          <span style={{ fontSize:"11px", color:S.mid }}>{stage}</span>
                        </div>
                        <span style={{ fontSize:"11px" }}><span style={{ color, fontWeight:600 }}>{count}</span><span style={{ color:S.light }}> / {target}</span></span>
                      </div>
                      <div style={{ background:S.borderL, borderRadius:"2px", height:"4px", width:`${Math.max(8,100-i*14)}%` }}>
                        <div style={{ background:color, height:"100%", width:`${pct(count,target)}%`, borderRadius:"2px", transition:"width .5s", opacity:.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:"10px", color:S.light, letterSpacing:".1em", marginBottom:"16px" }}>8 BUCKETS · 200 COMPANIES</div>
                {BUCKETS.map(b=>{
                  const bcos=companies.filter(c=>c.bucket===b.id);
                  const roles=bcos.reduce((s,c)=>s+(c.openRoles||0),0);
                  const active=bcos.filter(c=>c.stage!=="Tracking").length;
                  return (
                    <div key={b.id} style={{ marginBottom:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                        <span style={{ fontSize:"11px", color:S.mid }}><span style={{ color:b.color, fontWeight:700 }}>B{b.id}</span> {b.label}</span>
                        <div style={{ fontSize:"10px", display:"flex", gap:"8px" }}>
                          <span style={{ color:b.color, fontWeight:600 }}>{bcos.length}</span>
                          <span style={{ color:S.light }}>·</span>
                          <span style={{ color:"#A0640A", fontWeight:500 }}>{roles} roles</span>
                          <span style={{ color:S.light }}>·</span>
                          <span style={{ color:S.mid }}>{active} active</span>
                        </div>
                      </div>
                      <div style={{ background:S.borderL, borderRadius:"2px", height:"4px" }}>
                        <div style={{ background:b.color, height:"100%", width:`${pct(bcos.length,b.target)}%`, borderRadius:"2px", opacity:.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background:"#F0FDF8", border:"1px solid #A7F3D0", borderRadius:"8px", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:"10px", color:"#6B9E8A", letterSpacing:".1em", marginBottom:"5px" }}>NORTH STAR</div>
                <div style={{ fontSize:"15px", color:"#0D7A5F", fontWeight:500 }}>1 Signed Offer ≥ $250K · H1B Transfer · May 31</div>
                <div style={{ fontSize:"11px", color:"#6B9E8A", marginTop:"3px" }}>20 years experience · Director / VP · 200 companies · {totalRoles} open roles tracked</div>
              </div>
              <div style={{ fontSize:"32px" }}>{funnelCounts["Offer"]>=1?"🎯":"⏳"}</div>
            </div>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {tab==="pipeline" && (
          <div>
            <div style={{ display:"flex", gap:"10px", marginBottom:"16px", alignItems:"center", flexWrap:"wrap" }}>
              <input className="si" placeholder="Search companies..." value={search} onChange={e=>setSearch(e.target.value)} />
              <select className="fs" value={bucketFilter} onChange={e=>setBucketFilter(Number(e.target.value))}>
                <option value={0}>All Buckets</option>
                {BUCKETS.map(b=><option key={b.id} value={b.id}>B{b.id} · {b.label}</option>)}
              </select>
              <select className="fs" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
                <option value="All">All Stages</option>
                {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select className="fs" value={prioFilter} onChange={e=>setPrioFilter(e.target.value)}>
                <option value="All">All Priority</option>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
              <div style={{ flex:1 }} />
              <span style={{ fontSize:"11px", color:S.light }}>{filtered.length} shown · {filtered.reduce((s,c)=>s+(c.openRoles||0),0)} roles</span>
              <button className="ab" onClick={()=>setShowAdd(true)}>+ ADD</button>
            </div>
            <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", overflow:"hidden", maxHeight:"68vh", overflowY:"auto", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead style={{ position:"sticky", top:0, zIndex:10 }}>
                  <tr style={{ borderBottom:`1px solid ${S.border}`, background:"#F7F4EF" }}>
                    {["#","COMPANY","BKT","PRIORITY","OPEN ROLES","STAGE","NOTES",""].map((h,i)=>(
                      <th key={i} style={{ padding:"9px 14px", textAlign:i===4?"center":"left", fontSize:"9px", color:S.light, letterSpacing:".1em", fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((co,idx)=>{
                    const bkt=BUCKETS.find(b=>b.id===co.bucket);
                    const pc={high:{bg:"#EDFAF5",text:"#0D7A5F"},medium:{bg:"#EBF3FF",text:"#1D5FA8"},low:{bg:"#F7F4EF",text:"#9C9590"}}[co.priority]||{bg:"#EBF3FF",text:"#1D5FA8"};
                    return (
                      <tr key={co.id} className="rh" style={{ borderBottom:`1px solid ${S.borderL}`, background:idx%2===0?"#fff":"#FDFCFA" }}>
                        <td style={{ padding:"9px 14px", fontSize:"10px", color:S.light, width:"36px" }}>{co.id}</td>
                        <td style={{ padding:"9px 14px", fontSize:"12px", color:S.text }}>{co.name}</td>
                        <td style={{ padding:"9px 14px" }}>
                          <span style={{ fontSize:"10px", color:bkt?.color, fontWeight:700, background:bkt?.bg, padding:"2px 6px", borderRadius:"3px" }}>B{co.bucket}</span>
                        </td>
                        <td style={{ padding:"9px 14px" }}>
                          <span className="pb" style={{ background:pc.bg, color:pc.text }}>{co.priority}</span>
                        </td>
                        <td style={{ padding:"9px 14px", textAlign:"center" }}>
                          {editingRolesId===co.id
                            ? <input className="ri" type="number" min="0" value={co.openRoles||0} onChange={e=>updateRoles(co.id,e.target.value)} onBlur={()=>setEditingRolesId(null)} autoFocus />
                            : <span onClick={()=>setEditingRolesId(co.id)} style={{ cursor:"pointer", fontSize:"12px", fontWeight:600, color:(co.openRoles||0)>0?"#A0640A":S.light, background:(co.openRoles||0)>0?"#FFF8EB":"transparent", padding:"2px 8px", borderRadius:"10px" }}>{co.openRoles||0}</span>
                          }
                        </td>
                        <td style={{ padding:"9px 14px", minWidth:"150px" }}>
                          <select className="sel" value={co.stage} onChange={e=>updateStage(co.id,e.target.value)} style={{ color:STAGE_COLORS[co.stage] }}>
                            {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding:"9px 14px", minWidth:"160px" }}>
                          {editingId===co.id
                            ? <textarea className="nt" rows={2} value={co.notes} onChange={e=>updateNotes(co.id,e.target.value)} onBlur={()=>setEditingId(null)} autoFocus />
                            : <span style={{ fontSize:"11px", color:co.notes?S.mid:S.borderL, cursor:"pointer" }} onClick={()=>setEditingId(co.id)}>{co.notes||"add note..."}</span>
                          }
                        </td>
                        <td style={{ padding:"9px 14px" }}>
                          <button className="xb" onClick={()=>removeCompany(co.id)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── JOB SCANNER ── */}
        {tab==="scanner" && (
          <div style={{ maxWidth:"800px" }}>

            {/* How it works */}
            <div style={{ background:"#EBF3FF", border:"1px solid #BFDBFE", borderRadius:"8px", padding:"16px 20px", marginBottom:"20px" }}>
              <div style={{ fontSize:"10px", color:"#1D5FA8", letterSpacing:".1em", marginBottom:"8px", fontWeight:600 }}>HOW IT WORKS</div>
              <div style={{ fontSize:"12px", color:"#374151", lineHeight:1.7 }}>
                <span style={{ display:"block", marginBottom:"4px" }}>1. Run <code style={{ background:"#DBEAFE", padding:"1px 5px", borderRadius:"3px", fontSize:"11px" }}>python pm_jobs.py</code> locally to scan 200 company career pages</span>
                <span style={{ display:"block", marginBottom:"4px" }}>2. It outputs <code style={{ background:"#DBEAFE", padding:"1px 5px", borderRadius:"3px", fontSize:"11px" }}>pm_jobs.json</code> in the same folder</span>
                <span style={{ display:"block" }}>3. Upload that file here — results populate instantly and Open Roles counts update in your pipeline</span>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                background: dragOver ? "#EBF3FF" : "#fff",
                border: `2px dashed ${dragOver ? "#1D5FA8" : S.border}`,
                borderRadius:"10px", padding:"40px 24px", marginBottom:"20px",
                textAlign:"center", transition:"all .2s", cursor:"pointer",
              }}
              onClick={() => document.getElementById("json-upload").click()}
            >
              <input id="json-upload" type="file" accept=".json" style={{ display:"none" }} onChange={handleFileInput} />
              <div style={{ fontSize:"28px", marginBottom:"10px" }}>📂</div>
              <div style={{ fontSize:"13px", color:S.text, fontWeight:500, marginBottom:"6px" }}>
                {dragOver ? "Drop pm_jobs.json here" : "Upload pm_jobs.json"}
              </div>
              <div style={{ fontSize:"11px", color:S.light }}>Drag & drop or click to browse · JSON files only</div>
            </div>

            {/* Last scan meta */}
            {scanMeta && (
              <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px", padding:"12px 16px", background:"#EDFAF5", border:"1px solid #A7F3D0", borderRadius:"6px" }}>
                <span style={{ fontSize:"16px" }}>✓</span>
                <div>
                  <div style={{ fontSize:"12px", color:"#0D7A5F", fontWeight:500 }}>{scanMeta.count} PM roles loaded from {scanMeta.filename}</div>
                  <div style={{ fontSize:"10px", color:"#6B9E8A", marginTop:"2px" }}>Uploaded {scanMeta.date} · Open Roles counts updated in pipeline</div>
                </div>
                <button onClick={() => { setScanResults([]); setScanMeta(null); }} style={{ marginLeft:"auto", background:"none", border:"1px solid #A7F3D0", color:"#6B9E8A", cursor:"pointer", padding:"3px 10px", borderRadius:"4px", fontSize:"11px", fontFamily:"inherit" }}>Clear</button>
              </div>
            )}

            {/* Results table */}
            {scanResults.length > 0 && (
              <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${S.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"10px", color:S.light, letterSpacing:".1em" }}>OPEN PM ROLES — {scanResults.length} FOUND</span>
                  <input
                    placeholder="Filter results..."
                    style={{ background:"#F7F4EF", border:`1px solid ${S.border}`, color:S.text, padding:"4px 10px", borderRadius:"4px", fontFamily:"inherit", fontSize:"11px", width:"160px" }}
                    onChange={e => {
                      const q = e.target.value.toLowerCase();
                      if (!q) return;
                    }}
                  />
                </div>
                <div style={{ maxHeight:"50vh", overflowY:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead style={{ position:"sticky", top:0 }}>
                      <tr style={{ background:"#F7F4EF", borderBottom:`1px solid ${S.border}` }}>
                        {["COMPANY","TITLE","LOCATION","ATS",""].map((h,i)=>(
                          <th key={i} style={{ padding:"9px 16px", textAlign:"left", fontSize:"9px", color:S.light, letterSpacing:".1em", fontWeight:500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scanResults.map((job,i)=>(
                        <tr key={i} className="rh fi" style={{ borderBottom:`1px solid ${S.borderL}`, background:i%2===0?"#fff":"#FDFCFA" }}>
                          <td style={{ padding:"10px 16px", fontSize:"12px", color:S.text, fontWeight:500 }}>{job.company}</td>
                          <td style={{ padding:"10px 16px", fontSize:"12px", color:"#1D5FA8" }}>{job.title}</td>
                          <td style={{ padding:"10px 16px", fontSize:"11px", color:S.mid }}>{job.location}</td>
                          <td style={{ padding:"10px 16px", fontSize:"10px", color:S.light }}>{job.ats || "—"}</td>
                          <td style={{ padding:"10px 16px" }}>
                            {job.url
                              ? <a href={job.url} target="_blank" rel="noreferrer" style={{ fontSize:"11px", color:"#0D7A5F", textDecoration:"none", border:"1px solid #A7F3D0", padding:"2px 8px", borderRadius:"4px" }}>Apply →</a>
                              : <span style={{ fontSize:"11px", color:S.light }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WEEKLY ── */}
        {tab==="weekly" && (
          <div style={{ maxWidth:"720px" }}>
            <div style={{ fontSize:"10px", color:S.light, letterSpacing:".1em", marginBottom:"20px" }}>WEEK {weekly.week} · RESET EVERY MONDAY</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"24px" }}>
              {[
                {label:"Applications",key:"applications",target:WEEKLY_TARGETS.applications,color:"#1D5FA8",bg:"#EBF3FF"},
                {label:"Networking",key:"networking",target:WEEKLY_TARGETS.networking,color:"#0D7A5F",bg:"#EDFAF5"},
                {label:"Recruiter Outreach",key:"recruiterOutreach",target:WEEKLY_TARGETS.recruiterOutreach,color:"#A0640A",bg:"#FFF8EB"},
              ].map(item=>{
                const val=weekly[item.key], done=val>=item.target;
                return (
                  <div key={item.key} style={{ background:done?item.bg:"#fff", border:`1px solid ${done?item.color+"44":S.border}`, borderRadius:"8px", padding:"18px", borderTop:`3px solid ${done?item.color:S.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:"10px", color:S.light, letterSpacing:".08em", marginBottom:"10px" }}>{item.label.toUpperCase()}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                      <button className="ib" onClick={()=>setWeekly(p=>({...p,[item.key]:Math.max(0,p[item.key]-1)}))}>−</button>
                      <span style={{ fontSize:"30px", fontWeight:300, color:done?item.color:S.text, minWidth:"44px", textAlign:"center" }}>{val}</span>
                      <button className="ib" onClick={()=>setWeekly(p=>({...p,[item.key]:p[item.key]+1}))}>+</button>
                    </div>
                    <div style={{ fontSize:"10px", color:S.light, marginBottom:"7px" }}>{done?"✓ DONE":`${item.target-val} left · target ${item.target}`}</div>
                    <div style={{ background:S.borderL, borderRadius:"2px", height:"3px" }}>
                      <div style={{ background:item.color, height:"100%", width:`${pct(val,item.target)}%`, borderRadius:"2px", transition:"width .3s", opacity:.8 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", padding:"20px", marginBottom:"16px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:"10px", color:S.light, letterSpacing:".1em", marginBottom:"14px" }}>WEEKLY CADENCE</div>
              {[["MON","LinkedIn insight post + 3 networking messages","45 min","#1D5FA8"],["TUE","Apply to 2–3 roles from pipeline","30 min","#6B3FA0"],["WED","LinkedIn behind-the-build post","20 min","#0D7A5F"],["THU","5 recruiter outreach messages","30 min","#A0640A"],["FRI","LinkedIn opinion post + follow-ups","30 min","#B03A2E"],["W/E","Long-form writing (every other week)","90 min","#9C9590"]].map(([day,action,time,color])=>(
                <div key={day} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"9px 0", borderBottom:`1px solid ${S.borderL}` }}>
                  <div style={{ width:"40px", fontSize:"10px", color, fontWeight:600, letterSpacing:".05em", flexShrink:0 }}>{day}</div>
                  <div style={{ fontSize:"11px", color:S.mid, flex:1 }}>{action}</div>
                  <div style={{ fontSize:"10px", color:S.light, flexShrink:0 }}>{time}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"8px", padding:"20px", marginBottom:"16px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:"10px", color:S.light, letterSpacing:".1em", marginBottom:"14px" }}>DEADLINE CHAIN</div>
              {[["Mar 13–31","Pipeline creation","#B03A2E",true],["Apr 1–May 30","Interview pipeline active","#A0640A",false],["May 31","Offer secured ✓","#0D7A5F",false],["Jun 15","H1B transfer initiated","#1D5FA8",false]].map(([date,label,color,current])=>(
                <div key={date} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"9px 0", borderBottom:`1px solid ${S.borderL}` }}>
                  <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:current?"#0D7A5F":color, flexShrink:0 }} />
                  <div style={{ fontSize:"11px", color:S.light, width:"100px", flexShrink:0 }}>{date}</div>
                  <div style={{ fontSize:"11px", color:current?"#0D7A5F":S.mid, fontWeight:current?500:400 }}>{label}</div>
                  {current&&<div style={{ fontSize:"9px", color:"#0D7A5F", marginLeft:"auto", background:"#EDFAF5", padding:"2px 6px", borderRadius:"3px" }}>NOW</div>}
                </div>
              ))}
            </div>
            <button onClick={()=>setWeekly({applications:0,networking:0,recruiterOutreach:0,week:getCurrentWeek()})} style={{ background:"none", border:`1px solid ${S.border}`, color:S.light, cursor:"pointer", padding:"7px 14px", borderRadius:"4px", fontSize:"10px", fontFamily:"inherit", letterSpacing:".08em" }}>RESET WEEK</button>
          </div>
        )}
      </div>

      {/* ── Add modal ── */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:"10px", padding:"26px", width:"360px", boxShadow:"0 12px 40px rgba(0,0,0,0.12)" }}>
            <div style={{ fontSize:"13px", fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:"18px" }}>ADD COMPANY</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              <input className="mi" placeholder="Company name" value={newCo.name} onChange={e=>setNewCo(p=>({...p,name:e.target.value}))} />
              <select className="ms" value={newCo.bucket} onChange={e=>setNewCo(p=>({...p,bucket:Number(e.target.value)}))}>
                {BUCKETS.map(b=><option key={b.id} value={b.id}>B{b.id} · {b.label}</option>)}
              </select>
              <select className="ms" value={newCo.priority} onChange={e=>setNewCo(p=>({...p,priority:e.target.value}))}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div style={{ display:"flex", gap:"10px", marginTop:"18px" }}>
              <button className="ab" onClick={addCompany} style={{ flex:1 }}>ADD</button>
              <button onClick={()=>setShowAdd(false)} style={{ flex:1, background:"none", border:`1px solid ${S.border}`, color:S.mid, cursor:"pointer", borderRadius:"6px", fontFamily:"inherit", fontSize:"12px" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
