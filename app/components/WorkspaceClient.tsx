"use client";

import { useEffect, useMemo, useState } from "react";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";

type RunKind = "baseline" | "recheck";
type Platform = "ChatGPT" | "Gemini" | "Perplexity" | "Other";
type Channel = "Website article" | "LinkedIn post" | "YouTube script" | "FAQ answer" | "Publisher outreach";
type Prompt = { id: string; text: string; category: string };
type Run = { id: string; kind: RunKind; createdAt: string; label: string };
type Observation = {
  id: string;
  runId: string;
  promptId: string;
  platform: Platform;
  answer: string;
  citations: string;
  recordedAt: string;
};
type Draft = {
  id: string;
  title: string;
  channel: Channel;
  prompt: string;
  content: string;
  rationale: string;
  claimsToVerify: string[];
  createdAt: string;
};
type Profile = {
  brand: string;
  website: string;
  category: string;
  audience: string;
  competitors: string;
  differentiators: string;
};
type WorkspaceData = {
  profile: Profile;
  prompts: Prompt[];
  runs: Run[];
  observations: Observation[];
  drafts: Draft[];
  activeRunId: string;
};
type Generated = {
  title: string;
  draft: string;
  rationale: string;
  claimsToVerify: string[];
};

const STORAGE_KEY = "citeglance.workspace.v1";
const CHANNELS: Channel[] = ["Website article", "LinkedIn post", "YouTube script", "FAQ answer", "Publisher outreach"];
const PLATFORMS: Platform[] = ["ChatGPT", "Gemini", "Perplexity", "Other"];
const EMPTY_DATA: WorkspaceData = {
  profile: { brand: "", website: "", category: "B2B SaaS", audience: "", competitors: "", differentiators: "" },
  prompts: [],
  runs: [],
  observations: [],
  drafts: [],
  activeRunId: "",
};

function makeId(prefix: string) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}
function niceDate(value: string) {
  try {
    return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return value;
  }
}
function safeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) || "citeglance-workspace";
}
function downloadFile(filename: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}
function sourceUrls(value: string) {
  return value.split(/\n|,/).map(function (line) { return line.trim(); }).filter(Boolean).filter(function (line) {
    try {
      const url = new URL(line);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  });
}

export default function WorkspaceClient() {
  const [data, setData] = useState<WorkspaceData>(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<"research" | "content" | "measure">("research");
  const [promptInput, setPromptInput] = useState("");
  const [observationPrompt, setObservationPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("ChatGPT");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState("");
  const [contentPromptId, setContentPromptId] = useState("");
  const [channel, setChannel] = useState<Channel>("Website article");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [editableDraft, setEditableDraft] = useState("");
  const [contentBusy, setContentBusy] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(function () {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WorkspaceData>;
        setData({
          profile: { ...EMPTY_DATA.profile, ...(parsed.profile || {}) },
          prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
          runs: Array.isArray(parsed.runs) ? parsed.runs : [],
          observations: Array.isArray(parsed.observations) ? parsed.observations : [],
          drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
          activeRunId: typeof parsed.activeRunId === "string" ? parsed.activeRunId : "",
        });
      }
    } catch {
      setNotice("Saved workspace data could not be read. You can keep working and export a backup.");
    }
    setHydrated(true);
  }, []);

  useEffect(function () {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setNotice("Browser storage is full. Export a JSON backup before adding more research.");
    }
  }, [data, hydrated]);

  const activeRun = data.runs.find(function (run) { return run.id === data.activeRunId; });
  const baselineRun = data.runs.filter(function (run) { return run.kind === "baseline"; }).sort(function (a, b) { return a.createdAt.localeCompare(b.createdAt); })[0];
  const latestRecheck = data.runs.filter(function (run) { return run.kind === "recheck"; }).sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); })[0];
  const selectedContentPrompt = data.prompts.find(function (prompt) { return prompt.id === contentPromptId; }) || data.prompts[0];
  const evidenceForContent = useMemo(function () {
    if (!selectedContentPrompt) return undefined;
    return data.observations
      .filter(function (item) { return item.promptId === selectedContentPrompt.id && item.answer.trim().length > 0; })
      .sort(function (a, b) { return b.recordedAt.localeCompare(a.recordedAt); })[0];
  }, [data.observations, selectedContentPrompt]);

  function updateProfile(key: keyof Profile, value: string) {
    setData(function (current) {
      return { ...current, profile: { ...current.profile, [key]: value } };
    });
  }

  function addPrompt(text: string, category: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (data.prompts.some(function (item) { return item.text.toLowerCase() === trimmed.toLowerCase(); })) {
      setNotice("That prompt is already in your list.");
      return;
    }
    const prompt = { id: makeId("prompt"), text: trimmed, category: category };
    setData(function (current) { return { ...current, prompts: [...current.prompts, prompt] }; });
    setPromptInput("");
    setObservationPrompt(function (old) { return old || prompt.id; });
    setContentPromptId(function (old) { return old || prompt.id; });
    setNotice("Prompt added. Run it on the selected AI platform and record the observed answer.");
  }

  function addSuggestedPrompts() {
    const brand = data.profile.brand.trim() || "your product";
    const category = data.profile.category.trim() || "software";
    const audience = data.profile.audience.trim() || "growing teams";
    const competitors = data.profile.competitors.split(",").map(function (name) { return name.trim(); }).filter(Boolean);
    const suggestions = [
      { category: "Category discovery", text: "What are the best " + category + " tools for " + audience + "?" },
      { category: "Buying criteria", text: "What should buyers compare when choosing " + category + " software?" },
      { category: "Use-case fit", text: "Which " + category + " platforms are suitable for " + audience + "?" },
      { category: "Brand discovery", text: "What does " + brand + " do, and who is it best suited for?" },
      { category: "Alternatives", text: "What are the best alternatives to " + brand + "?" },
    ];
    if (competitors.length) {
      suggestions.push({ category: "Competitor comparison", text: "Compare " + brand + " with " + competitors[0] + " for " + audience + "." });
      if (competitors[1]) suggestions.push({ category: "Competitor comparison", text: "What are the main differences between " + brand + " and " + competitors[1] + "?" });
    }
    const existing = new Set(data.prompts.map(function (item) { return item.text.toLowerCase(); }));
    const added = suggestions.filter(function (item) { return !existing.has(item.text.toLowerCase()); })
      .map(function (item) { return { id: makeId("prompt"), text: item.text, category: item.category }; });
    if (!added.length) {
      setNotice("Your suggested prompts are already in the list.");
      return;
    }
    setData(function (current) { return { ...current, prompts: [...current.prompts, ...added] }; });
    setObservationPrompt(function (old) { return old || added[0].id; });
    setContentPromptId(function (old) { return old || added[0].id; });
    setNotice(added.length + " buyer-intent prompts added. Edit them to match real buying language before testing.");
  }

  function startRun(kind: RunKind) {
    if (kind === "recheck" && !baselineRun) {
      setPageError("Create a baseline run before starting a recheck.");
      return;
    }
    const run: Run = {
      id: makeId(kind),
      kind: kind,
      createdAt: new Date().toISOString(),
      label: kind === "baseline" ? "Baseline" : "Recheck " + (data.runs.filter(function (item) { return item.kind === "recheck"; }).length + 1),
    };
    setData(function (current) { return { ...current, runs: [...current.runs, run], activeRunId: run.id }; });
    setStage("research");
    setPageError("");
    setNotice(run.label + " started. Use the same prompts and similar settings for a meaningful comparison.");
  }

  function recordObservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPageError("");
    if (!activeRun) {
      setPageError("Start a baseline or recheck run before recording answers.");
      return;
    }
    if (!observationPrompt || !data.prompts.some(function (item) { return item.id === observationPrompt; })) {
      setPageError("Add or select a buyer-intent prompt first.");
      return;
    }
    if (!answer.trim()) {
      setPageError("Paste the answer you actually observed on the AI platform.");
      return;
    }
    const observation: Observation = {
      id: makeId("observation"),
      runId: activeRun.id,
      promptId: observationPrompt,
      platform: platform,
      answer: answer.trim(),
      citations: citations.trim(),
      recordedAt: new Date().toISOString(),
    };
    setData(function (current) { return { ...current, observations: [...current.observations, observation] }; });
    setAnswer("");
    setCitations("");
    setNotice("Observed answer saved to " + activeRun.label + ".");
  }

  function statsForRun(runId?: string) {
    const entries = runId ? data.observations.filter(function (item) { return item.runId === runId && item.answer.trim(); }) : [];
    const brand = data.profile.brand.trim().toLowerCase();
    const competitorNames = data.profile.competitors.split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    const brandMentions = brand ? entries.filter(function (item) { return item.answer.toLowerCase().includes(brand); }).length : 0;
    const foundCompetitors = competitorNames.filter(function (name) {
      return entries.some(function (entry) { return entry.answer.toLowerCase().includes(name.toLowerCase()); });
    });
    const domains = new Set<string>();
    entries.forEach(function (entry) {
      sourceUrls(entry.citations).forEach(function (urlText) {
        try { domains.add(new URL(urlText).hostname.replace(/^www\./, "").toLowerCase()); } catch {}
      });
    });
    return {
      answers: entries.length,
      brandMentions: brandMentions,
      mentionRate: entries.length && brand ? Math.round((brandMentions / entries.length) * 100) : null,
      competitorBrands: foundCompetitors,
      sourceDomains: Array.from(domains).sort(),
    };
  }

  const activeStats = statsForRun(activeRun && activeRun.id);
  const baselineStats = statsForRun(baselineRun && baselineRun.id);
  const recheckStats = statsForRun(latestRecheck && latestRecheck.id);

  async function generateContent() {
    setPageError("");
    setNotice("");
    setGenerated(null);
    if (!data.profile.brand.trim()) {
      setPageError("Add your brand name above before generating content.");
      return;
    }
    if (!selectedContentPrompt) {
      setPageError("Add a buyer-intent prompt first.");
      return;
    }
    if (!evidenceForContent) {
      setPageError("Record an actual AI answer for this prompt first. CiteGlance uses that evidence to shape the draft.");
      return;
    }
    setContentBusy(true);
    try {
      const response = await fetch("/api/workspace/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: data.profile.brand,
          website: data.profile.website,
          category: data.profile.category,
          audience: data.profile.audience,
          competitors: data.profile.competitors,
          differentiators: data.profile.differentiators,
          prompt: selectedContentPrompt.text,
          sourcePlatform: evidenceForContent.platform,
          observedAnswer: evidenceForContent.answer,
          citations: sourceUrls(evidenceForContent.citations),
          channel: channel,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Content generation could not be completed.");
      const item = body as Generated;
      setGenerated(item);
      setEditableDraft(item.draft);
      setNotice("Draft generated from the selected buyer prompt and recorded evidence. Review every claim before publishing.");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Content generation failed.");
    } finally {
      setContentBusy(false);
    }
  }

  function saveDraft() {
    if (!generated || !editableDraft.trim()) return;
    const draft: Draft = {
      id: makeId("draft"),
      title: generated.title,
      channel: channel,
      prompt: selectedContentPrompt ? selectedContentPrompt.text : "",
      content: editableDraft,
      rationale: generated.rationale,
      claimsToVerify: generated.claimsToVerify,
      createdAt: new Date().toISOString(),
    };
    setData(function (current) { return { ...current, drafts: [draft, ...current.drafts] }; });
    setNotice("Draft saved in this browser's workspace.");
  }

  function exportWorkspace() {
    downloadFile(safeFilename(data.profile.brand) + "-citeglance-workspace.json", JSON.stringify(data, null, 2), "application/json");
  }

  function copyText(value: string) {
    if (!navigator.clipboard) {
      setPageError("Clipboard access is unavailable in this browser. Select the text and copy it manually.");
      return;
    }
    navigator.clipboard.writeText(value).then(function () {
      setNotice("Copied to clipboard.");
    }).catch(function () {
      setPageError("Clipboard access was blocked. Select the text and copy it manually.");
    });
  }

  const citationsForEvidence = evidenceForContent ? sourceUrls(evidenceForContent.citations) : [];
  const observationsForActiveRun = activeRun ? data.observations.filter(function (item) { return item.runId === activeRun.id; }).sort(function (a, b) { return b.recordedAt.localeCompare(a.recordedAt); }) : [];

  return (
    <main className="cg-workspace-page">
      <div className="cg-workspace-shell">
        <header className="cg-workspace-hero">
          <div>
            <div className="cg-work-eyebrow"><span className="cg-work-live-dot" /> CITEGLANCE / RESEARCH WORKSPACE</div>
            <h1>From AI answers to <em>content that earns attention.</em></h1>
            <p>Capture what buyers actually see, trace the sources, create evidence-led content, then run the same checks again.</p>
          </div>
          <div className="cg-work-hero-actions">
            <span className="cg-work-local-badge">{hydrated ? "Saved in this browser" : "Loading workspace"}</span>
            <button className="cg-work-button cg-work-button-light" type="button" onClick={exportWorkspace}>Export workspace ↗</button>
          </div>
        </header>

        <section className="cg-work-panel cg-work-profile">
          <div className="cg-work-section-head">
            <div><div className="cg-work-eyebrow">01 / BRAND SETUP</div><h2>Define who you are researching</h2></div>
            <span className="cg-work-step-count">START HERE</span>
          </div>
          <div className="cg-work-profile-grid">
            <label>Brand name<input value={data.profile.brand} onChange={function (event) { updateProfile("brand", event.target.value); }} placeholder="e.g. Acme Procurement" /></label>
            <label>Website URL<input value={data.profile.website} onChange={function (event) { updateProfile("website", event.target.value); }} placeholder="https://example.com" /></label>
            <label>Product category<input value={data.profile.category} onChange={function (event) { updateProfile("category", event.target.value); }} placeholder="B2B procurement software" /></label>
            <label>Target buyer / audience<input value={data.profile.audience} onChange={function (event) { updateProfile("audience", event.target.value); }} placeholder="Procurement leaders at mid-market firms" /></label>
            <label>Competitors (comma-separated)<input value={data.profile.competitors} onChange={function (event) { updateProfile("competitors", event.target.value); }} placeholder="Competitor A, Competitor B" /></label>
            <label className="cg-work-wide-field">Verified product facts / differentiators<textarea value={data.profile.differentiators} onChange={function (event) { updateProfile("differentiators", event.target.value); }} placeholder="Only verifiable details: supported workflows, integrations, published customer outcomes, limits and pricing. These notes ground generated content." rows={3} /></label>
          </div>
          <p className="cg-work-helper">Treat the competitor list as tracking targets. Keep company facts accurate; generated content should never invent features, performance numbers, customers or testimonials.</p>
        </section>

        <section className="cg-work-runbar">
          <div className="cg-work-current-run">
            <span className="cg-work-eyebrow">ACTIVE RESEARCH RUN</span>
            <strong>{activeRun ? activeRun.label : "No run started yet"}</strong>
            <span>{activeRun ? niceDate(activeRun.createdAt) : "Start with a baseline before capturing answers."}</span>
          </div>
          <div className="cg-work-run-actions">
            {!baselineRun && <button type="button" className="cg-work-button cg-work-button-dark" onClick={function () { startRun("baseline"); }}>Start baseline ↗</button>}
            {baselineRun && <button type="button" className="cg-work-button cg-work-button-dark" onClick={function () { startRun("recheck"); }}>Start recheck ↻</button>}
            {baselineRun && <button type="button" className="cg-work-button cg-work-button-light" onClick={function () { setData(function (current) { return { ...current, activeRunId: baselineRun.id }; }); setNotice("Baseline run selected."); }}>View baseline</button>}
            {latestRecheck && <button type="button" className="cg-work-button cg-work-button-light" onClick={function () { setData(function (current) { return { ...current, activeRunId: latestRecheck.id }; }); setNotice("Latest recheck selected."); }}>View latest recheck</button>}
          </div>
        </section>

        {pageError && <div className="cg-work-feedback cg-work-error" role="alert">{pageError}</div>}
        {notice && <div className="cg-work-feedback" role="status">{notice}</div>}

        <TabsRoot value={stage} onValueChange={(value) => setStage(value as "research" | "content" | "measure")} className="cg21-tabs-root cg-work-stage-tabs">
          <TabsList className="cg-work-stage-nav" aria-label="Workspace stages">
            <TabsTrigger value="research" className="cg-work-stage-trigger"><span>01</span> Research answers</TabsTrigger>
            <TabsTrigger value="content" className="cg-work-stage-trigger"><span>02</span> Create content</TabsTrigger>
            <TabsTrigger value="measure" className="cg-work-stage-trigger"><span>03</span> Recheck impact</TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="cg-work-stage-content">
          <div className="cg-work-main-grid">
            <div className="cg-work-stack">
              <section className="cg-work-panel">
                <div className="cg-work-section-head">
                  <div><div className="cg-work-eyebrow">PROMPT SET</div><h2>Questions buyers actually ask</h2></div>
                  <button type="button" className="cg-work-button cg-work-button-light" onClick={addSuggestedPrompts}>+ Suggest prompts</button>
                </div>
                <p className="cg-work-intro">Create a consistent set of non-branded and comparison questions. Suggested prompts are drafts; edit them to match the way your customers talk.</p>
                <form className="cg-work-inline-form" onSubmit={function (event) { event.preventDefault(); addPrompt(promptInput, "Custom prompt"); }}>
                  <input value={promptInput} onChange={function (event) { setPromptInput(event.target.value); }} placeholder="Add a buyer-intent question…" aria-label="New buyer-intent question" />
                  <button type="submit" className="cg-work-button cg-work-button-dark">Add prompt</button>
                </form>
                {data.prompts.length ? (
                  <div className="cg-work-prompt-list">
                    {data.prompts.map(function (prompt, index) {
                      return <div className="cg-work-prompt-row" key={prompt.id}>
                        <span className="cg-work-prompt-number">{String(index + 1).padStart(2, "0")}</span>
                        <div><span className="cg-work-tag">{prompt.category}</span><p>{prompt.text}</p></div>
                        <button type="button" className="cg-work-icon-button" aria-label={"Remove prompt " + prompt.text} onClick={function () { setData(function (current) { return { ...current, prompts: current.prompts.filter(function (item) { return item.id !== prompt.id; }) }; }); if (observationPrompt === prompt.id) setObservationPrompt(""); if (contentPromptId === prompt.id) setContentPromptId(""); }}>×</button>
                      </div>;
                    })}
                  </div>
                ) : (
                  <div className="cg-work-empty"><strong>No prompts yet</strong><p>Add a prompt or use the suggested set to begin your baseline research.</p></div>
                )}
              </section>

              <section className="cg-work-panel">
                <div className="cg-work-section-head">
                  <div><div className="cg-work-eyebrow">OBSERVED EVIDENCE</div><h2>Record an AI answer</h2></div>
                  <span className="cg-work-tag">{activeRun ? activeRun.label : "RUN REQUIRED"}</span>
                </div>
                <p className="cg-work-intro">Open the selected platform yourself, run the prompt, then paste the exact response and citation links. This workspace does not claim to query an engine automatically.</p>
                <form className="cg-work-evidence-form" onSubmit={recordObservation}>
                  <label>Buyer prompt<select value={observationPrompt} onChange={function (event) { setObservationPrompt(event.target.value); }} required><option value="">Select a saved prompt</option>{data.prompts.map(function (item) { return <option key={item.id} value={item.id}>{item.text}</option>; })}</select></label>
                  <label>AI platform<select value={platform} onChange={function (event) { setPlatform(event.target.value as Platform); }}>{PLATFORMS.map(function (item) { return <option key={item} value={item}>{item}</option>; })}</select></label>
                  <label className="cg-work-wide-field">Observed answer<textarea value={answer} onChange={function (event) { setAnswer(event.target.value); }} rows={7} placeholder="Paste the answer you actually saw, including brand names and source references…" required /></label>
                  <label className="cg-work-wide-field">Citation / source URLs (one per line)<textarea value={citations} onChange={function (event) { setCitations(event.target.value); }} rows={3} placeholder={"https://publisher.example/article\nhttps://brand.example/product"} /></label>
                  {citations.trim() && sourceUrls(citations).length === 0 && <p className="cg-work-validation">No valid HTTP(S) source URLs detected yet. Invalid lines will not be included when content is generated.</p>}
                  <div className="cg-work-form-foot"><span>Captured at save time · keep test conditions consistent</span><button type="submit" className="cg-work-button cg-work-button-dark" disabled={!activeRun || !data.prompts.length}>Save observation ↗</button></div>
                </form>
              </section>
            </div>

            <aside className="cg-work-stack">
              <section className="cg-work-metrics-panel">
                <div className="cg-work-eyebrow">RUN SNAPSHOT</div>
                <h2>{activeRun ? activeRun.label : "Your baseline starts here"}</h2>
                <div className="cg-work-metrics-grid">
                  <div><strong>{activeStats.answers}</strong><span>Answers recorded</span></div>
                  <div><strong>{activeStats.mentionRate === null ? "—" : activeStats.mentionRate + "%"}</strong><span>Brand mention rate</span></div>
                  <div><strong>{activeStats.competitorBrands.length}</strong><span>Competitors found</span></div>
                  <div><strong>{activeStats.sourceDomains.length}</strong><span>Distinct source domains</span></div>
                </div>
                <p>Metrics use only the answers you recorded for this run. A blank result is not treated as a zero-visibility finding.</p>
              </section>

              <section className="cg-work-panel cg-work-baseline-tip">
                <div className="cg-work-eyebrow">KEEP THE COMPARISON CLEAN</div>
                <h3>Same prompt. Same platform. New date.</h3>
                <p>For useful before/after results, reuse the prompt set and note meaningful changes to location, plan, model or settings. AI answers naturally vary.</p>
                <button type="button" className="cg-work-text-action" onClick={function () { setStage("measure"); }}>See recheck comparison ↗</button>
              </section>

              <section className="cg-work-panel">
                <div className="cg-work-section-head"><div><div className="cg-work-eyebrow">THIS RUN</div><h2>Saved observations</h2></div><span className="cg-work-tag">{observationsForActiveRun.length}</span></div>
                {observationsForActiveRun.length ? observationsForActiveRun.map(function (item) {
                  const prompt = data.prompts.find(function (entry) { return entry.id === item.promptId; });
                  return <article className="cg-work-observation-card" key={item.id}>
                    <div className="cg-work-observation-meta"><span>{item.platform}</span><time>{niceDate(item.recordedAt)}</time></div>
                    <strong>{prompt ? prompt.text : "Prompt removed"}</strong>
                    <p>{item.answer.length > 250 ? item.answer.slice(0, 250) + "…" : item.answer}</p>
                    <small>{sourceUrls(item.citations).length} valid source link(s)</small>
                    {sourceUrls(item.citations).length > 0 && <div className="cg-work-citation-list" aria-label="Cited sources">
                      {sourceUrls(item.citations).slice(0, 3).map(function (url) { return <a key={url} href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname.replace(/^www\./, "")}<span aria-hidden="true">↗</span></a>; })}
                      {sourceUrls(item.citations).length > 3 && <span className="cg-work-citation-more">+{sourceUrls(item.citations).length - 3} more</span>}
                    </div>}
                  </article>;
                }) : <div className="cg-work-empty"><p>Saved answers will appear here after you record your first observation.</p></div>}
              </section>
            </aside>
          </div>
        </TabsContent>

          <TabsContent value="content" className="cg-work-stage-content">
          <div className="cg-work-content-layout">
            <section className="cg-work-panel cg-work-content-controls">
              <div className="cg-work-eyebrow">EVIDENCE-LED CONTENT STUDIO</div>
              <h2>Turn a visibility gap into a useful asset.</h2>
              <p className="cg-work-intro">Choose a prompt with a recorded answer. The draft is grounded in your verified product notes, the observed answer, and the available citations—not invented rankings.</p>
              <label>Buyer-intent prompt<select value={selectedContentPrompt ? selectedContentPrompt.id : ""} onChange={function (event) { setContentPromptId(event.target.value); setGenerated(null); }}><option value="">Select a prompt</option>{data.prompts.map(function (item) { return <option key={item.id} value={item.id}>{item.text}</option>; })}</select></label>
              <label>Publishing channel<select value={channel} onChange={function (event) { setChannel(event.target.value as Channel); setGenerated(null); }}>{CHANNELS.map(function (item) { return <option key={item} value={item}>{item}</option>; })}</select></label>
              <div className="cg-work-evidence-summary">
                <span className="cg-work-eyebrow">EVIDENCE TO USE</span>
                {evidenceForContent ? <>
                  <strong>{evidenceForContent.platform} · {niceDate(evidenceForContent.recordedAt)}</strong>
                  <p>{evidenceForContent.answer.slice(0, 500)}{evidenceForContent.answer.length > 500 ? "…" : ""}</p>
                  <span>{citationsForEvidence.length} valid source URLs captured</span>
                  {citationsForEvidence.length > 0 && <div className="cg-work-citation-list" aria-label="Evidence sources">
                    {citationsForEvidence.slice(0, 4).map(function (url) { return <a key={url} href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname.replace(/^www\./, "")}<span aria-hidden="true">↗</span></a>; })}
                    {citationsForEvidence.length > 4 && <span className="cg-work-citation-more">+{citationsForEvidence.length - 4} more</span>}
                  </div>}
                </> : <p>Record an actual answer for a prompt before creating evidence-linked content.</p>}
              </div>
              <button type="button" className="cg-work-button cg-work-button-dark cg-work-generate" onClick={generateContent} disabled={contentBusy || !evidenceForContent}>
                {contentBusy ? "Building your draft…" : "Generate evidence-led draft ↗"}
              </button>
              <p className="cg-work-helper">Generated drafts may still contain errors. Review facts and links, then approve before publishing.</p>
            </section>

            <section className="cg-work-panel cg-work-draft-panel">
              <div className="cg-work-section-head"><div><div className="cg-work-eyebrow">DRAFT WORKSPACE</div><h2>{generated ? generated.title : "Your content will appear here"}</h2></div>{generated && <span className="cg-work-tag">AI DRAFT</span>}</div>
              {generated ? <>
                <div className="cg-work-draft-rationale"><strong>Why this asset</strong><p>{generated.rationale}</p></div>
                <label className="cg-work-draft-label">Edit before saving<textarea className="cg-work-draft-editor" value={editableDraft} onChange={function (event) { setEditableDraft(event.target.value); }} rows={17} /></label>
                {generated.claimsToVerify.length > 0 && <div className="cg-work-verify"><strong>Verify before publishing</strong><ul>{generated.claimsToVerify.map(function (claim, index) { return <li key={index}>{claim}</li>; })}</ul></div>}
                <div className="cg-work-draft-actions">
                  <button type="button" className="cg-work-button cg-work-button-dark" onClick={saveDraft}>Save to drafts</button>
                  <button type="button" className="cg-work-button cg-work-button-light" onClick={function () { copyText(editableDraft); }}>Copy draft</button>
                  <button type="button" className="cg-work-button cg-work-button-light" onClick={function () { downloadFile(safeFilename(generated.title) + ".md", "# " + generated.title + "\n\n" + editableDraft + "\n\n## Why this content\n" + generated.rationale + "\n\n## Verify before publishing\n" + generated.claimsToVerify.map(function (item) { return "- " + item; }).join("\n"), "text/markdown"); }}>Download .md</button>
                </div>
              </> : <div className="cg-work-empty cg-work-empty-large"><span className="cg-work-empty-symbol">✳</span><strong>Start from evidence, not guesses.</strong><p>Pick a recorded buyer question, select a publishing channel and generate a draft with citation context and claim checks.</p></div>}
            </section>

            <section className="cg-work-panel cg-work-saved-drafts">
              <div className="cg-work-section-head"><div><div className="cg-work-eyebrow">SAVED CONTENT</div><h2>Drafts ready for review</h2></div><span className="cg-work-tag">{data.drafts.length}</span></div>
              {data.drafts.length ? data.drafts.map(function (draft) {
                return <article className="cg-work-saved-draft" key={draft.id}>
                  <div><span className="cg-work-tag">{draft.channel}</span><h3>{draft.title}</h3><p>{draft.prompt}</p><small>Saved {niceDate(draft.createdAt)}</small></div>
                  <div className="cg-work-saved-draft-actions"><button type="button" className="cg-work-text-action" onClick={function () { setGenerated({ title: draft.title, draft: draft.content, rationale: draft.rationale, claimsToVerify: draft.claimsToVerify }); setEditableDraft(draft.content); setChannel(draft.channel); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Reopen ↗</button><button type="button" className="cg-work-text-action" onClick={function () { copyText(draft.content); }}>Copy</button></div>
                </article>;
              }) : <div className="cg-work-empty"><p>Save a generated draft to keep it here for editing and export.</p></div>}
            </section>
          </div>
        </TabsContent>

          <TabsContent value="measure" className="cg-work-stage-content">
          <div className="cg-work-measure-layout">
            <section className="cg-work-panel">
              <div className="cg-work-section-head"><div><div className="cg-work-eyebrow">BASELINE VS RECHECK</div><h2>Did visibility change?</h2></div><button type="button" className="cg-work-button cg-work-button-dark" onClick={function () { startRun("recheck"); }}>Start another recheck ↻</button></div>
              <p className="cg-work-intro">Run the same prompts again after content has been published or updated. Record the real answers under the new recheck run; no results are fabricated or inferred from publication alone.</p>
              {baselineRun ? <div className="cg-work-comparison-grid">
                <div className="cg-work-comparison-card"><span className="cg-work-eyebrow">BASELINE</span><strong>{niceDate(baselineRun.createdAt)}</strong><p>{baselineStats.answers} recorded answer(s)</p></div>
                <div className="cg-work-comparison-card"><span className="cg-work-eyebrow">LATEST RECHECK</span><strong>{latestRecheck ? niceDate(latestRecheck.createdAt) : "Not recorded yet"}</strong><p>{latestRecheck ? recheckStats.answers + " recorded answer(s)" : "Start a recheck and capture answers."}</p></div>
                <div className="cg-work-comparison-metric"><span>Brand mention rate</span><strong>{baselineStats.mentionRate === null ? "—" : baselineStats.mentionRate + "%"} <i>→</i> {latestRecheck && recheckStats.mentionRate !== null ? recheckStats.mentionRate + "%" : "—"}</strong><small>{latestRecheck && baselineStats.mentionRate !== null && recheckStats.mentionRate !== null ? (recheckStats.mentionRate - baselineStats.mentionRate > 0 ? "+" : "") + (recheckStats.mentionRate - baselineStats.mentionRate) + " percentage points" : "Need comparable answers in both runs"}</small></div>
                <div className="cg-work-comparison-metric"><span>Distinct citation domains</span><strong>{baselineStats.sourceDomains.length} <i>→</i> {latestRecheck ? recheckStats.sourceDomains.length : "—"}</strong><small>Count of different domains in recorded source URLs</small></div>
                <div className="cg-work-comparison-metric"><span>Competitor brands mentioned</span><strong>{baselineStats.competitorBrands.length} <i>→</i> {latestRecheck ? recheckStats.competitorBrands.length : "—"}</strong><small>Distinct competitors in the answer set, not recommendation quality</small></div>
              </div> : <div className="cg-work-empty"><strong>No baseline yet</strong><p>Return to Research answers, add buyer prompts and start a baseline before comparing results.</p><button type="button" className="cg-work-button cg-work-button-dark" onClick={function () { setStage("research"); }}>Set up research ↗</button></div>}
              <p className="cg-work-helper">These are descriptive before/after measures. AI responses vary, and this comparison alone cannot prove that a particular post caused a visibility change.</p>
            </section>
            <section className="cg-work-panel">
              <div className="cg-work-section-head"><div><div className="cg-work-eyebrow">RUN HISTORY</div><h2>Research sessions</h2></div><span className="cg-work-tag">{data.runs.length}</span></div>
              {data.runs.length ? [...data.runs].sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); }).map(function (run) {
                const stats = statsForRun(run.id);
                return <button type="button" key={run.id} className={activeRun && activeRun.id === run.id ? "cg-work-run-history is-selected" : "cg-work-run-history"} onClick={function () { setData(function (current) { return { ...current, activeRunId: run.id }; }); setStage("research"); }}>
                  <span><strong>{run.label}</strong><small>{niceDate(run.createdAt)}</small></span><span>{stats.answers} answers · {stats.mentionRate === null ? "brand n/a" : stats.mentionRate + "% brand mentions"}</span><span aria-hidden="true">↗</span>
                </button>;
              }) : <div className="cg-work-empty"><p>No research sessions saved yet.</p></div>}
            </section>
          </div>
          </TabsContent>
        </TabsRoot>

        <footer className="cg-work-footer">
          <p><strong>Evidence policy:</strong> CiteGlance stores observations you enter. It does not automatically query AI engines, guarantee citation changes, or publish posts on your behalf in this first workspace version.</p>
          <p>Your workspace data is stored in this browser only. Export a JSON backup before changing devices or clearing browser data. This is a single-browser prototype, not yet a multi-user cloud workspace.</p>
          <button type="button" className="cg-work-text-action" onClick={function () { setPageError(""); if (window.confirm("Delete the saved workspace from this browser? Export a backup first if you need it.")) { window.localStorage.removeItem(STORAGE_KEY); setData(EMPTY_DATA); setGenerated(null); setEditableDraft(""); setNotice("Local workspace reset."); } }}>Reset local workspace</button>
        </footer>
      </div>
    </main>
  );
}
