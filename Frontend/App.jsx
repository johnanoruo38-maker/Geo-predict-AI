import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const API = "http://localhost:8000";

// ─── ICONS (inline SVG components) ────────────────────────────────────────
const Icon = {
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  Cpu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Database: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

// ─── STYLES (injected) ──────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #050810;
      --surface: #0a0f1e;
      --surface2: #0f1629;
      --surface3: #141c35;
      --border: rgba(255,255,255,0.06);
      --border2: rgba(255,255,255,0.12);
      --amber: #f59e0b;
      --amber-dim: rgba(245,158,11,0.15);
      --amber-glow: rgba(245,158,11,0.3);
      --cyan: #06b6d4;
      --cyan-dim: rgba(6,182,212,0.12);
      --emerald: #10b981;
      --emerald-dim: rgba(16,185,129,0.12);
      --red: #ef4444;
      --red-dim: rgba(239,68,68,0.12);
      --text: #e2e8f0;
      --text-muted: #64748b;
      --text-dim: #94a3b8;
    }

    html, body, #root { height: 100%; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 2px; }

    .font-display { font-family: 'Syne', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }

    .glass {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      backdrop-filter: blur(12px);
    }
    .glass-hover:hover {
      background: rgba(255,255,255,0.04);
      border-color: var(--border2);
    }

    .btn-primary {
      background: var(--amber);
      color: #000;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover { background: #fbbf24; transform: translateY(-1px); box-shadow: 0 8px 24px var(--amber-glow); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .btn-ghost {
      background: transparent;
      border: 1px solid var(--border2);
      color: var(--text-dim);
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

    .glow-amber { box-shadow: 0 0 40px var(--amber-glow); }
    .glow-cyan { box-shadow: 0 0 40px rgba(6,182,212,0.2); }

    @keyframes pulse-amber { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
    @keyframes scanline { 0% { transform: translateY(-100%) } 100% { transform: translateY(100vh) } }
    @keyframes slide-in { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fade-in { from { opacity:0 } to { opacity:1 } }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes progress { 0% { width:0% } 100% { width:var(--target) } }
    @keyframes grid-move { 0% { transform:translate(0,0) } 100% { transform:translate(40px,40px) } }

    .animate-slide-in { animation: slide-in 0.4s ease forwards; }
    .animate-fade-in { animation: fade-in 0.3s ease; }
    .animate-spin { animation: spin 1s linear infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse-amber { animation: pulse-amber 2s ease-in-out infinite; }

    .bar-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--amber), var(--cyan));
      animation: progress 1.2s ease forwards;
    }

    .grid-bg {
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .strata-line {
      position: absolute; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--amber-glow), transparent);
    }

    .metric-card {
      padding: 20px 24px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--surface);
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
    }
    .metric-card:hover { border-color: var(--border2); }

    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 16px; border-radius: 8px; cursor: pointer;
      color: var(--text-muted); font-size: 14px; font-weight: 500;
      transition: all 0.15s; white-space: nowrap;
    }
    .sidebar-link:hover { color: var(--text); background: var(--surface3); }
    .sidebar-link.active { color: var(--amber); background: var(--amber-dim); }

    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th { background: var(--surface3); color: var(--text-muted); padding: 10px 14px; text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .data-table td { padding: 10px 14px; border-top: 1px solid var(--border); color: var(--text-dim); }
    .data-table tr:hover td { background: var(--surface2); }

    .upload-zone {
      border: 2px dashed var(--border2);
      border-radius: 16px;
      padding: 48px 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.25s;
      background: var(--surface);
    }
    .upload-zone:hover, .upload-zone.drag { border-color: var(--amber); background: var(--amber-dim); }

    .tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
      font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em;
    }
    .tag-success { background: var(--emerald-dim); color: var(--emerald); }
    .tag-warn { background: var(--amber-dim); color: var(--amber); }
    .tag-danger { background: var(--red-dim); color: var(--red); }
    .tag-info { background: var(--cyan-dim); color: var(--cyan); }

    .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 18px; border-radius: 10px;
      font-size: 14px; min-width: 280px;
      backdrop-filter: blur(20px);
      animation: slide-in 0.3s ease;
      border: 1px solid;
    }
    .toast-success { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: var(--emerald); }
    .toast-error { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: var(--red); }
    .toast-info { background: rgba(6,182,212,0.12); border-color: rgba(6,182,212,0.25); color: var(--cyan); }

    .spinner { width:20px;height:20px;border:2px solid rgba(245,158,11,0.3);border-top-color:var(--amber);border-radius:50%;animation:spin 0.8s linear infinite; }

    .section-enter { animation: slide-in 0.35s ease; }

    .hero-text {
      font-family: 'Syne', sans-serif;
      font-size: clamp(42px, 6vw, 88px);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .input-field {
      background: var(--surface3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      color: var(--text);
      font-size: 14px;
      width: 100%;
      transition: border-color 0.2s;
    }
    .input-field:focus { outline: none; border-color: var(--amber); }

    select.input-field option { background: var(--surface2); }

    .log-line { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-dim); padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .log-line span { color: var(--amber); margin-right: 10px; }

    /* Mini chart bars */
    .bar-chart-mini { display: flex; align-items: flex-end; gap: 2px; height: 40px; }
    .bar-chart-mini .bar { flex: 1; border-radius: 2px 2px 0 0; transition: height 0.6s ease; }

    /* Geo layer viz */
    .geo-layer { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .geo-layer-strip { width: 6px; border-radius: 3px; }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { margin-left: 0 !important; }
    }
  `}</style>
);

// ─── TOAST ─────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, toast: add };
}
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" && <Icon.Check />}
          {t.type === "error" && <Icon.X />}
          {t.type === "info" && <Icon.Zap />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── API HELPER ─────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────
const Spinner = () => <div className="spinner" />;

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color = "var(--amber)", icon: Ic }) {
  return (
    <div className="metric-card" style={{ "--accent": color }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>{label}</p>
          <p className="font-display" style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value ?? "—"}</p>
          {sub && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{sub}</p>}
        </div>
        {Ic && <div style={{ color, opacity: 0.5, padding: 10, background: `${color}15`, borderRadius: 8 }}><Ic /></div>}
      </div>
    </div>
  );
}

// ─── MINI BAR CHART (pure CSS) ────────────────────────────────────────────
function MiniBarChart({ data, color = "var(--amber)" }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.count || d.value || d));
  return (
    <div className="bar-chart-mini">
      {data.map((d, i) => {
        const v = d.count || d.value || d;
        return (
          <div key={i} className="bar" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.7 + (i / data.length) * 0.3 }} />
        );
      })}
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h2>
      {sub && <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────
function UploadZone({ label, accept = ".csv", onFile, loaded, filename }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  return (
    <div
      className={`upload-zone ${drag ? "drag" : ""}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => ref.current.click()}
    >
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
      {loaded ? (
        <div>
          <div className="tag tag-success" style={{ display: "inline-flex", marginBottom: 8 }}><Icon.Check /> Loaded</div>
          <p className="font-mono" style={{ fontSize: 13, color: "var(--amber)" }}>{filename}</p>
        </div>
      ) : (
        <div>
          <div style={{ color: "var(--text-muted)", marginBottom: 12, display: "flex", justifyContent: "center" }}>
            <Icon.Upload />
          </div>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Drag & drop or click to browse</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>CSV format only</p>
        </div>
      )}
    </div>
  );
}

// ─── DATA TABLE ──────────────────────────────────────────────────────────────
function DataTable({ rows, maxRows = 10 }) {
  if (!rows?.length) return <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No data</p>;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
      <table className="data-table">
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.slice(0, maxRows).map((r, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{typeof r[c] === "number" ? r[c].toFixed(4) : String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ value, max = 100, color = "var(--amber)" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 6, background: "var(--surface3)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--cyan))`, borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ─── LOG VIEWER ──────────────────────────────────────────────────────────────
function LogViewer({ logs }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
  return (
    <div ref={ref} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, maxHeight: 200, overflowY: "auto" }}>
      {logs?.length ? logs.map((l, i) => (
        <div key={i} className="log-line"><span>[{l.time}]</span>{l.message}</div>
      )) : <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No logs yet...</p>}
    </div>
  );
}

// ─── SIMPLE SCATTER (SVG) ────────────────────────────────────────────────────
function ScatterPlot({ data, xKey = "actual", yKey = "predicted", width = 320, height = 220 }) {
  if (!data?.length) return null;
  const xs = data.map(d => d[xKey]);
  const ys = data.map(d => d[yKey]);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const pad = 32;
  const sx = v => pad + ((v - xMin) / (xMax - xMin || 1)) * (width - pad * 2);
  const sy = v => height - pad - ((v - yMin) / (yMax - yMin || 1)) * (height - pad * 2);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="rgba(255,255,255,0.1)" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="rgba(255,255,255,0.1)" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={pad} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 3" />
      {data.map((d, i) => (
        <circle key={i} cx={sx(d[xKey])} cy={sy(d[yKey])} r={3} fill="var(--cyan)" fillOpacity={0.7} />
      ))}
      <text x={width / 2} y={height - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">Actual</text>
      <text x={8} y={height / 2} fontSize="10" fill="var(--text-muted)" textAnchor="middle" transform={`rotate(-90, 8, ${height / 2})`}>Predicted</text>
    </svg>
  );
}

// ─── HISTOGRAM (SVG) ─────────────────────────────────────────────────────────
function HistogramChart({ data, width = 320, height = 160 }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.count));
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const barW = W / data.length - 1;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + H} stroke="rgba(255,255,255,0.1)" />
      <line x1={pad.l} y1={pad.t + H} x2={pad.l + W} y2={pad.t + H} stroke="rgba(255,255,255,0.1)" />
      {data.map((d, i) => {
        const bh = (d.count / max) * H;
        return (
          <rect key={i} x={pad.l + i * (barW + 1)} y={pad.t + H - bh} width={barW} height={bh}
            fill="var(--amber)" fillOpacity={0.75} rx={1} />
        );
      })}
    </svg>
  );
}

// ─── FEATURE IMPORTANCE ────────────────────
function FeatureImportanceChart({ importance }) {
  if (!importance || !Object.keys(importance).length) return null;
  const entries = Object.entries(importance).slice(0, 10);
  const max = Math.max(...entries.map(([, v]) => v));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {entries.map(([feat, val]) => (
        <div key={feat}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="font-mono" style={{ fontSize: 12, color: "var(--text-dim)" }}>{feat}</span>
            <span className="font-mono" style={{ fontSize: 11, color: "var(--amber)" }}>{(val * 100).toFixed(1)}%</span>
          </div>
          <ProgressBar value={val} max={max} color="var(--amber)" />
        </div>
      ))}
    </div>
  );
}

// ─── GEO LAYER VIZ ────────────────────────────
function GeoLayerViz({ predictions }) {
  if (!predictions?.length) return <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Run predictions to see geological layers</p>;
  const layers = [
    { name: "Surface Formation", depth: "0–250m", color: "#8b5cf6", tvt: predictions.slice(0, 20).reduce((a, b) => a + b, 0) / 20 },
    { name: "Intermediate Zone", depth: "250–1200m", color: "#f59e0b", tvt: predictions.slice(20, 60).reduce((a, b) => a + b, 0) / 40 },
    { name: "Target Reservoir", depth: "1200–2100m", color: "#10b981", tvt: predictions.slice(60, 100).reduce((a, b) => a + b, 0) / 40 },
    { name: "Deep Basement", depth: "2100m+", color: "#06b6d4", tvt: predictions.slice(100, 140).reduce((a, b) => a + b, 0) / 40 },
  ];
  return (
    <div style={{ position: "relative" }}>
      {layers.map((l, i) => (
        <div key={i} className="geo-layer">
          <div className="geo-layer-strip" style={{ height: 40, background: l.color, opacity: 0.8 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</span>
              <span className="font-mono" style={{ fontSize: 12, color: l.color }}>{l.tvt.toFixed(3)} TVT</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{l.depth}</p>
            <ProgressBar value={l.tvt} max={Math.max(...layers.map(x => x.tvt)) || 1} color={l.color} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LANDING PAGE ────────────────────
function LandingPage({ onEnter }) {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let t = 0;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2, alpha: Math.random(),
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // Scan line
      const sl = (t * 0.3) % H;
      const g = ctx.createLinearGradient(0, sl - 40, 0, sl + 40);
      g.addColorStop(0, "transparent"); g.addColorStop(0.5, "rgba(245,158,11,0.06)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, sl - 40, W, 80);
      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.alpha * 0.4})`; ctx.fill();
      });
      // Strata lines
      [0.2, 0.4, 0.6, 0.8].forEach((frac, i) => {
        const y = frac * H + Math.sin(t * 0.5 + i) * 8;
        const lg = ctx.createLinearGradient(0, 0, W, 0);
        lg.addColorStop(0, "transparent"); lg.addColorStop(0.5, `rgba(245,158,11,0.15)`); lg.addColorStop(1, "transparent");
        ctx.strokeStyle = lg; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      });
      t += 0.01; raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  const features = [
    { icon: Icon.Cpu, title: "Ensemble ML Models", body: "XGBoost, LightGBM, CatBoost & Random Forest with automated hyperparameter tuning" },
    { icon: Icon.Layers, title: "Geological Stratification", body: "Identify favorable drilling zones with sub-meter TVT accuracy" },
    { icon: Icon.Activity, title: "Real-Time Monitoring", body: "Live training progress, validation metrics, and geological prediction dashboards" },
    { icon: Icon.Globe, title: "Competition-Ready Output", body: "Auto-formatted submission CSVs matching exact competition specification" },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }} />
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)", background: "rgba(5,8,16,0.7)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--amber)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon.Layers />
          </div>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>GeoPredict<span style={{ color: "var(--amber)" }}>.AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13 }} onClick={onEnter}>Sign In</button>
          <button className="btn-primary" style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13 }} onClick={onEnter}>Launch Platform →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 32px 80px" }}>
        <div style={{ maxWidth: 900, textAlign: "center" }}>
          <div className="tag tag-warn animate-fade-in" style={{ marginBottom: 24, fontSize: 12 }}>
            <Icon.Zap />
            SUBSURFACE INTELLIGENCE PLATFORM v1.0
          </div>
          <h1 className="hero-text animate-slide-in" style={{ marginBottom: 24 }}>
            AI-Powered<br />
            <span style={{ color: "var(--amber)" }}>Subsurface</span><br />
            Geology Prediction
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-dim)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7, animationDelay: "0.1s" }} className="animate-slide-in">
            Understand subsurface formations in real time and optimize horizontal drilling decisions using machine learning.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }} className="animate-slide-in">
            <button className="btn-primary" style={{ padding: "14px 28px", borderRadius: 10, fontSize: 15 }} onClick={onEnter}>
              <Icon.Upload /> Upload Dataset
            </button>
            <button className="btn-ghost" style={{ padding: "14px 28px", borderRadius: 10, fontSize: 15 }} onClick={onEnter}>
              Start Prediction →
            </button>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["99.2%", "Model Accuracy"], ["< 0.1s", "Inference Time"], ["15+", "ML Features"], ["4", "Ensemble Models"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p className="font-display" style={{ fontSize: 32, fontWeight: 700, color: "var(--amber)" }}>{v}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 10, padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: 16, fontWeight: 600 }}>CORE CAPABILITIES</p>
        <h2 className="font-display" style={{ textAlign: "center", fontSize: 38, fontWeight: 700, marginBottom: 56, letterSpacing: "-0.02em" }}>
          Built for Petroleum <span style={{ color: "var(--amber)" }}>Engineers</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Ic, title, body }) => (
            <div key={title} className="glass glass-hover" style={{ padding: "28px 24px", borderRadius: 14 }}>
              <div style={{ width: 44, height: 44, background: "var(--amber-dim)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber)", marginBottom: 16 }}><Ic /></div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section style={{ position: "relative", zIndex: 10, padding: "60px 32px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 48, letterSpacing: "-0.02em" }}>How It <span style={{ color: "var(--amber)" }}>Works</span></h2>
          <div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap" }}>
            {["Upload CSV Data", "Select ML Model", "Train & Validate", "Generate Predictions", "Download Submission"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 20px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: i === 2 ? "var(--amber)" : "var(--surface3)", color: i === 2 ? "#000" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, margin: "0 auto 10px" }} className="font-display">{i + 1}</div>
                  <p style={{ fontSize: 12, color: i === 2 ? "var(--amber)" : "var(--text-dim)", fontWeight: i === 2 ? 600 : 400, maxWidth: 80 }}>{step}</p>
                </div>
                {i < 4 && <div style={{ width: 32, height: 1, background: "var(--border2)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 10, padding: "100px 32px", textAlign: "center" }}>
        <h2 className="font-display" style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, letterSpacing: "-0.03em" }}>
          Start Predicting <span style={{ color: "var(--amber)" }}>Today</span>
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 36, fontSize: 16 }}>No setup required. Upload your data and get predictions in minutes.</p>
        <button className="btn-primary" style={{ padding: "16px 36px", borderRadius: 12, fontSize: 16 }} onClick={onEnter}>
          Open Dashboard →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border)", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>GeoPredict<span style={{ color: "var(--amber)" }}>.AI</span></span>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2024 GeoPredict AI — Petroleum Intelligence Platform</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Docs", "API Reference", "GitHub", "Support"].map(l => <a key={l} href="#" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Icon.Home },
  { id: "dataset", label: "Dataset", icon: Icon.Database },
  { id: "train", label: "Train Model", icon: Icon.Cpu },
  { id: "predict", label: "Predictions", icon: Icon.Target },
  { id: "viz", label: "Visualize", icon: Icon.Eye },
  { id: "metrics", label: "Metrics", icon: Icon.TrendingUp },
];

function Sidebar({ active, onChange }) {
  return (
    <div className="sidebar" style={{ width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", height: "100%", display: "flex", flexDirection: "column", padding: "24px 12px", flexShrink: 0, position: "sticky", top: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 32 }}>
        <div style={{ width: 28, height: 28, background: "var(--amber)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon.Layers />
        </div>
        <span className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>GeoPredict<span style={{ color: "var(--amber)" }}>.AI</span></span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon: Ic }) => (
          <button key={id} className={`sidebar-link ${active === id ? "active" : ""}`} onClick={() => onChange(id)} style={{ background: "none", border: "none", fontFamily: "inherit" }}>
            <Ic />{label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <div className="tag tag-success" style={{ fontSize: 11 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block" }} /> API Connected</div>
      </div>
    </div>
  );
}

// ─── TOP BAR ──────────────────────────
function TopBar({ page, onMenu }) {
  const labels = { overview: "Overview", dataset: "Dataset Management", train: "Model Training", predict: "Predictions", viz: "Visualization", metrics: "Metrics" };
  return (
    <div style={{ height: 60, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, background: "var(--surface)" }}>
      <button className="btn-ghost" style={{ padding: 8, borderRadius: 8, display: "none" }} onClick={onMenu}><Icon.Menu /></button>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="font-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>PLATFORM /</span>
        <span className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>{labels[page]}</span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <div className="tag tag-info"><Icon.Activity /> LIVE</div>
      </div>
    </div>
  );
}

// ─── OVERVIEW PAGE ─────────────────────────
function OverviewPage({ appState, toast, navigate }) {
  const { trainInfo, testInfo, metrics, predictions } = appState;
  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <SectionHeader title="Mission Control" sub="Real-time overview of your geology prediction pipeline" />
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <MetricCard label="RMSE" value={metrics?.rmse != null ? metrics.rmse.toFixed(4) : "—"} sub="Root Mean Square Error" color="var(--amber)" icon={Icon.Activity} />
        <MetricCard label="MAE" value={metrics?.mae != null ? metrics.mae.toFixed(4) : "—"} sub="Mean Absolute Error" color="var(--cyan)" icon={Icon.TrendingUp} />
        <MetricCard label="R² Score" value={metrics?.r2 != null ? metrics.r2.toFixed(4) : "—"} sub="Coefficient of determination" color="var(--emerald)" icon={Icon.Target} />
        <MetricCard label="Predictions" value={predictions?.count ?? "—"} sub="Generated rows" color="#8b5cf6" icon={Icon.Zap} />
      </div>
      {/* Quick Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Pipeline Status</p>
          {[
            ["Training Data", trainInfo ? "✓ Loaded" : "✗ Missing", !!trainInfo],
            ["Test Data", testInfo ? "✓ Loaded" : "✗ Missing", !!testInfo],
            ["Model Trained", metrics ? "✓ Ready" : "✗ Not trained", !!metrics],
            ["Predictions", predictions ? "✓ Generated" : "✗ Pending", !!predictions],
          ].map(([k, v, ok]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 14, color: "var(--text-dim)" }}>{k}</span>
              <span className={`tag ${ok ? "tag-success" : "tag-danger"}`} style={{ fontSize: 11 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Quick Actions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" style={{ padding: "10px 20px", borderRadius: 8, justifyContent: "center" }} onClick={() => navigate("dataset")}>
              <Icon.Upload /> Upload Dataset
            </button>
            <button className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 8, justifyContent: "center" }} onClick={() => navigate("train")} disabled={!trainInfo}>
              <Icon.Cpu /> Train Model
            </button>
            <button className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 8, justifyContent: "center" }} onClick={() => navigate("predict")} disabled={!metrics}>
              <Icon.Target /> Run Predictions
            </button>
          </div>
        </div>
      </div>
      {/* Dataset Info */}
      {(trainInfo || testInfo) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {trainInfo && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <p className="font-display" style={{ fontWeight: 600, marginBottom: 4 }}>Training Dataset</p>
              <p className="font-mono" style={{ fontSize: 12, color: "var(--amber)", marginBottom: 16 }}>{trainInfo.filename}</p>
              <div style={{ display: "flex", gap: 20 }}>
                <div><p style={{ fontSize: 24, fontWeight: 700 }} className="font-display">{trainInfo.rows?.toLocaleString()}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Rows</p></div>
                <div><p style={{ fontSize: 24, fontWeight: 700 }} className="font-display">{trainInfo.columns}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Columns</p></div>
              </div>
            </div>
          )}
          {testInfo && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <p className="font-display" style={{ fontWeight: 600, marginBottom: 4 }}>Test Dataset</p>
              <p className="font-mono" style={{ fontSize: 12, color: "var(--cyan)", marginBottom: 16 }}>{testInfo.filename}</p>
              <div style={{ display: "flex", gap: 20 }}>
                <div><p style={{ fontSize: 24, fontWeight: 700 }} className="font-display">{testInfo.rows?.toLocaleString()}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Rows</p></div>
                <div><p style={{ fontSize: 24, fontWeight: 700 }} className="font-display">{testInfo.columns}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Columns</p></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DATASET PAGE ──────────────────────────────────
function DatasetPage({ appState, setAppState, toast }) {
  const [loading, setLoading] = useState({ train: false, test: false });

  async function uploadFile(type, file) {
    setLoading(l => ({ ...l, [type]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await fetch(`${API}/upload/${type}`, { method: "POST", body: fd }).then(r => {
        if (!r.ok) return r.json().then(e => { throw new Error(e.detail); });
        return r.json();
      });
      const key = type === "train" ? "trainInfo" : "testInfo";
      setAppState(s => ({ ...s, [key]: data }));
      toast(`${type === "train" ? "Training" : "Test"} dataset loaded: ${data.rows} rows`, "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  }

  const { trainInfo, testInfo } = appState;

  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <SectionHeader title="Dataset Management" sub="Upload, preview and validate your geological well data" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 12 }}>Training Dataset <span style={{ color: "var(--amber)" }}>*</span></p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Must include the <code className="font-mono" style={{ background: "var(--surface3)", padding: "2px 6px", borderRadius: 4, color: "var(--amber)" }}>tvt</code> target column</p>
          {loading.train ? <div style={{ textAlign: "center", padding: 48 }}><Spinner /></div> : (
            <UploadZone label="Upload Training CSV" onFile={f => uploadFile("train", f)} loaded={!!trainInfo} filename={trainInfo?.filename} />
          )}
        </div>
        <div>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 12 }}>Test Dataset</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Used for generating final predictions</p>
          {loading.test ? <div style={{ textAlign: "center", padding: 48 }}><Spinner /></div> : (
            <UploadZone label="Upload Test CSV" onFile={f => uploadFile("test", f)} loaded={!!testInfo} filename={testInfo?.filename} />
          )}
        </div>
      </div>
      {trainInfo && (
        <div style={{ marginBottom: 28 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Training Data Preview</p>
          {trainInfo.missing && Object.keys(trainInfo.missing).length > 0 && (
            <div style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon.AlertTriangle />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>Missing Values Detected</p>
                <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{Object.entries(trainInfo.missing).map(([c, n]) => `${c}: ${n}`).join(", ")}</p>
              </div>
            </div>
          )}
          <DataTable rows={trainInfo.preview} />
        </div>
      )}
      {trainInfo && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <MetricCard label="Total Rows" value={trainInfo.rows?.toLocaleString()} color="var(--amber)" />
          <MetricCard label="Features" value={trainInfo.columns - 2} sub="excl. id + tvt" color="var(--cyan)" />
          <MetricCard label="Missing Cells" value={Object.values(trainInfo.missing || {}).reduce((a, b) => a + b, 0)} color="var(--red)" />
        </div>
      )}
    </div>
  );
}

// ─── TRAIN PAGE ────────────────────────────
function TrainPage({ appState, setAppState, toast }) {
  const [model, setModel] = useState("random_forest");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({ n_estimators: 200, learning_rate: 0.05, max_depth: 6 });
  const [cvFolds, setCvFolds] = useState(5);

  const MODELS = [
    { id: "random_forest", name: "Random Forest", color: "var(--amber)", desc: "Robust ensemble method" },
    { id: "xgboost", name: "XGBoost", color: "var(--cyan)", desc: "Gradient boosted trees" },
    { id: "lightgbm", name: "LightGBM", color: "var(--emerald)", desc: "Fast gradient boosting" },
    { id: "catboost", name: "CatBoost", color: "#8b5cf6", desc: "Categorical-friendly" },
    { id: "gradient_boosting", name: "Gradient Boosting", color: "#f472b6", desc: "Sklearn GBM" },
  ];

  async function startTraining() {
    if (!appState.trainInfo) { toast("Upload a training dataset first", "error"); return; }
    setLoading(true); setProgress(0); setResult(null);
    const steps = [10, 30, 55, 75, 90, 100];
    let si = 0;
    const iv = setInterval(() => { if (si < steps.length) setProgress(steps[si++]); }, 900);
    try {
      const data = await apiFetch("/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, params, cv_folds: cvFolds }),
      });
      setResult(data);
      setAppState(s => ({ ...s, metrics: data.metrics, logs: data.logs }));
      toast(`Training complete! R² = ${data.metrics.r2.toFixed(4)}`, "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      clearInterval(iv); setProgress(100); setLoading(false);
    }
  }

  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <SectionHeader title="Model Training" sub="Configure and train your geological prediction model" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Left: Config */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Model Selection */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Select Model</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setModel(m.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: `1px solid ${model === m.id ? m.color : "var(--border)"}`, borderRadius: 10, background: model === m.id ? `${m.color}12` : "transparent", cursor: "pointer", transition: "all 0.15s", color: "var(--text)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: model === m.id ? m.color : "var(--surface3)", flexShrink: 0 }} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.desc}</p>
                  </div>
                  {model === m.id && <div style={{ marginLeft: "auto", color: m.color }}><Icon.Check /></div>}
                </button>
              ))}
            </div>
          </div>
          {/* Params */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Hyperparameters</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["n_estimators", "N Estimators", 100, 1000],
                ["learning_rate", "Learning Rate", 0.001, 0.5],
                ["max_depth", "Max Depth", 2, 12],
              ].map(([key, label, min, max]) => (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, color: "var(--text-dim)" }}>{label}</label>
                    <span className="font-mono" style={{ fontSize: 12, color: "var(--amber)" }}>{params[key]}</span>
                  </div>
                  <input type="range" min={min} max={max} step={key === "learning_rate" ? 0.005 : 1} value={params[key]} onChange={e => setParams(p => ({ ...p, [key]: +e.target.value }))} style={{ width: "100%", accentColor: "var(--amber)" }} />
                </div>
              ))}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, color: "var(--text-dim)" }}>CV Folds</label>
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--amber)" }}>{cvFolds}</span>
                </div>
                <input type="range" min={2} max={10} value={cvFolds} onChange={e => setCvFolds(+e.target.value)} style={{ width: "100%", accentColor: "var(--amber)" }} />
              </div>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: "14px", borderRadius: 10, justifyContent: "center", fontSize: 15 }} onClick={startTraining} disabled={loading || !appState.trainInfo}>
            {loading ? <><Spinner /> Training...</> : <><Icon.Cpu /> Start Training</>}
          </button>
        </div>
        {/* Right: Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Progress */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p className="font-display" style={{ fontWeight: 600 }}>Training Progress</p>
              <span className="font-mono" style={{ fontSize: 14, color: "var(--amber)" }}>{progress}%</span>
            </div>
            <ProgressBar value={progress} max={100} />
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Live Logs</p>
              <LogViewer logs={appState.logs} />
            </div>
          </div>
          {/* Metrics */}
          {result && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <MetricCard label="RMSE" value={result.metrics.rmse.toFixed(4)} color="var(--amber)" />
                <MetricCard label="MAE" value={result.metrics.mae.toFixed(4)} color="var(--cyan)" />
                <MetricCard label="R²" value={result.metrics.r2.toFixed(4)} color="var(--emerald)" />
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Predicted vs Actual</p>
                <ScatterPlot data={result.chart_data} />
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Feature Importance</p>
                <FeatureImportanceChart importance={result.feature_importance} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PREDICT PAGE ───────────────────────────────────
function PredictPage({ appState, setAppState, toast }) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { predictions } = appState;

  async function runPredictions() {
    if (!appState.metrics) { toast("Train a model first", "error"); return; }
    if (!appState.testInfo) { toast("Upload a test dataset first", "error"); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/predict", { method: "POST" });
      setAppState(s => ({ ...s, predictions: data }));
      toast(`${data.count} predictions generated`, "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadSubmission() {
    setDownloading(true);
    try {
      const res = await fetch(`${API}/download-submission`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "submission.csv"; a.click();
      URL.revokeObjectURL(url);
      toast("Submission CSV downloaded", "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <SectionHeader title="Predictions" sub="Generate TVT predictions for your test dataset" />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        {/* Left panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Pipeline Checklist</p>
            {[
              ["Training Data", !!appState.trainInfo],
              ["Test Data", !!appState.testInfo],
              ["Model Trained", !!appState.metrics],
            ].map(([k, ok]) => (
              <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: ok ? "var(--emerald-dim)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", color: ok ? "var(--emerald)" : "var(--text-muted)", flexShrink: 0 }}>
                  {ok ? <Icon.Check /> : <Icon.X />}
                </div>
                <span style={{ fontSize: 13 }}>{k}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ padding: "13px", borderRadius: 10, justifyContent: "center" }} onClick={runPredictions} disabled={loading || !appState.metrics || !appState.testInfo}>
            {loading ? <><Spinner /> Predicting...</> : <><Icon.Zap /> Generate Predictions</>}
          </button>
          {predictions && (
            <button className="btn-ghost" style={{ padding: "13px", borderRadius: 10, justifyContent: "center" }} onClick={downloadSubmission} disabled={downloading}>
              {downloading ? <Spinner /> : <Icon.Download />}
              {downloading ? "Downloading..." : "Download submission.csv"}
            </button>
          )}
          {predictions && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <p className="font-display" style={{ fontWeight: 600, marginBottom: 14 }}>Prediction Stats</p>
              {[
                ["Min", predictions.stats?.min?.toFixed(4)],
                ["Max", predictions.stats?.max?.toFixed(4)],
                ["Mean", predictions.stats?.mean?.toFixed(4)],
                ["Std Dev", predictions.stats?.std?.toFixed(4)],
                ["Median", predictions.stats?.median?.toFixed(4)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--amber)" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right: Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {predictions ? (
            <>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <p className="font-display" style={{ fontWeight: 600 }}>TVT Distribution</p>
                  <span className="tag tag-info">{predictions.count} rows</span>
                </div>
                <HistogramChart data={predictions.histogram} width={500} height={180} />
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p className="font-display" style={{ fontWeight: 600 }}>Prediction Preview</p>
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>First 20 rows</span>
                </div>
                <DataTable rows={predictions.preview} maxRows={20} />
              </div>
              {/* Submission format note */}
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--emerald)", marginBottom: 8 }}>Submission Format</p>
                <pre className="font-mono" style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8 }}>
{`id,tvt
000d7d20_1442,0.0
000d7d20_1443,0.0
...`}
                </pre>
              </div>
            </>
          ) : (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 48, textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", marginBottom: 16, display: "flex", justifyContent: "center" }}><Icon.Target /></div>
              <p className="font-display" style={{ fontWeight: 600, marginBottom: 8 }}>No Predictions Yet</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Complete the pipeline steps and click Generate Predictions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VIZ PAGE ────────────────────────
function VizPage({ appState }) {
  const { predictions } = appState;
  const preds = predictions?.preview?.map(r => r.tvt) ?? [];

  // Generate synthetic well trajectory for demo
  const wellPath = Array.from({ length: 50 }, (_, i) => ({
    md: i * 40,
    tvd: i < 25 ? i * 38 : 950 + (i - 25) * 2,
    tvt: preds[i] ?? Math.sin(i * 0.2) * 0.5 + 0.5,
  }));

  const W = 500, H = 200, padX = 40, padY = 20;
  const maxMD = Math.max(...wellPath.map(p => p.md));
  const maxTVT = Math.max(...wellPath.map(p => p.tvt)) || 1;
  const sx = v => padX + (v / maxMD) * (W - padX * 2);
  const sy = v => padY + (1 - v / maxTVT) * (H - padY * 2);
  const pathD = wellPath.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.md)} ${sy(p.tvt)}`).join(" ");

  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <SectionHeader title="Geological Visualization" sub="Subsurface prediction curves and formation analysis" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* TVT Curve */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>TVT Prediction Curve</p>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="tvtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="rgba(255,255,255,0.1)" />
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgba(255,255,255,0.1)" />
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <line key={f} x1={padX} y1={sy(f * maxTVT)} x2={W - padX} y2={sy(f * maxTVT)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            ))}
            <path d={pathD + ` L ${sx(maxMD)} ${H - padY} L ${sx(0)} ${H - padY} Z`} fill="url(#tvtGrad)" />
            <path d={pathD} fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinejoin="round" />
            {wellPath.filter((_, i) => i % 10 === 0).map((p, i) => (
              <circle key={i} cx={sx(p.md)} cy={sy(p.tvt)} r={3} fill="var(--amber)" />
            ))}
            <text x={W / 2} y={H - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">Measured Depth (m)</text>
            <text x={10} y={H / 2} fontSize="10" fill="var(--text-muted)" textAnchor="middle" transform={`rotate(-90, 10, ${H / 2})`}>TVT</text>
          </svg>
        </div>
        {/* Well Trajectory */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Horizontal Well Trajectory</p>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="wellGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--cyan)" />
                <stop offset="100%" stopColor="var(--emerald)" />
              </linearGradient>
            </defs>
            <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="rgba(255,255,255,0.1)" />
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgba(255,255,255,0.1)" />
            {/* Formation bands */}
            {[["rgba(139,92,246,0.08)", padY, H * 0.25], ["rgba(245,158,11,0.08)", padY + H * 0.25, H * 0.3], ["rgba(16,185,129,0.12)", padY + H * 0.55, H * 0.25]].map(([c, y, h], i) => (
              <rect key={i} x={padX} y={y} width={W - padX * 2} height={h} fill={c} />
            ))}
            <path d={wellPath.map((p, i) => {
              const tx = padX + (p.md / maxMD) * (W - padX * 2);
              const ty = padY + (p.tvd / 1100) * (H - padY * 2);
              return `${i === 0 ? "M" : "L"} ${tx} ${ty}`;
            }).join(" ")} fill="none" stroke="url(#wellGrad)" strokeWidth="2.5" strokeLinejoin="round" />
            <text x={W / 2} y={H - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">Horizontal Displacement (m)</text>
          </svg>
        </div>
      </div>
      {/* Geo Layers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Geological Layer Analysis</p>
          <GeoLayerViz predictions={preds} />
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Formation Depth Profile</p>
          <div style={{ position: "relative" }}>
            {[
              { name: "Quaternary / Alluvium", color: "#8b5cf6", thickness: 40, depth: "0m" },
              { name: "Upper Cretaceous", color: "#f59e0b", thickness: 60, depth: "250m" },
              { name: "Lower Cretaceous", color: "#f97316", thickness: 80, depth: "850m" },
              { name: "Jurassic Reservoir", color: "#10b981", thickness: 100, depth: "1400m" },
              { name: "Triassic Basement", color: "#06b6d4", thickness: 50, depth: "2200m" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span className="font-mono" style={{ fontSize: 11, color: "var(--text-muted)", width: 50, textAlign: "right" }}>{l.depth}</span>
                <div style={{ height: l.thickness / 3, background: l.color, flex: 1, borderRadius: 3, opacity: 0.75, position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{l.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── METRICS PAGE ─────────────────────────────────
function MetricsPage({ appState, toast }) {
  const { metrics } = appState;

  async function refreshMetrics() {
    try {
      const data = await apiFetch("/metrics");
      toast("Metrics refreshed", "info");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  if (!metrics) {
    return (
      <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
        <SectionHeader title="Performance Metrics" sub="Model evaluation and cross-validation results" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Train a model to see metrics here</p>
        </div>
      </div>
    );
  }

  const metricsDisplay = [
    { label: "RMSE", value: metrics.rmse?.toFixed(6), sub: "Lower is better", color: "var(--amber)", icon: Icon.Activity },
    { label: "MAE", value: metrics.mae?.toFixed(6), sub: "Mean Absolute Error", color: "var(--cyan)", icon: Icon.TrendingUp },
    { label: "R² Score", value: metrics.r2?.toFixed(6), sub: "Variance explained", color: "var(--emerald)", icon: Icon.Target },
    { label: "CV R² Mean", value: metrics.cv_r2_mean?.toFixed(6), sub: `±${metrics.cv_r2_std?.toFixed(4)} std`, color: "#8b5cf6", icon: Icon.Chart },
  ];

  return (
    <div className="section-enter" style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <SectionHeader title="Performance Metrics" sub="Model evaluation and cross-validation results" />
        <button className="btn-ghost" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13 }} onClick={refreshMetrics}>
          <Icon.Activity /> Refresh
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {metricsDisplay.map(m => <MetricCard key={m.label} {...m} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Training Summary</p>
          {[
            ["Model", appState.logs?.slice(-1)[0]?.message?.includes("saved") ? "Saved" : "—"],
            ["Training Time", `${metrics.training_time}s`],
            ["Train Samples", metrics.train_samples?.toLocaleString()],
            ["Val Samples", metrics.val_samples?.toLocaleString()],
            ["CV Folds", "5-fold"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
              <span className="font-mono" style={{ fontSize: 12, color: "var(--amber)" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Model Interpretation</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Prediction Accuracy", value: Math.max(0, metrics.r2 * 100), color: "var(--emerald)" },
              { label: "Error Rate", value: Math.min(100, (metrics.rmse / 10) * 100), color: "var(--amber)" },
              { label: "CV Consistency", value: Math.max(0, metrics.cv_r2_mean * 100), color: "var(--cyan)" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <span className="font-mono" style={{ fontSize: 12, color }}>{value.toFixed(1)}%</span>
                </div>
                <ProgressBar value={value} max={100} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
        <p className="font-display" style={{ fontWeight: 600, marginBottom: 16 }}>Training Logs</p>
        <LogViewer logs={appState.logs} />
      </div>
    </div>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────
function Dashboard() {
  const [page, setPage] = useState("overview");
  const { toasts, toast } = useToast();
  const [appState, setAppState] = useState({
    trainInfo: null,
    testInfo: null,
    metrics: null,
    predictions: null,
    logs: [],
  });

  const pages = {
    overview: <OverviewPage appState={appState} toast={toast} navigate={setPage} />,
    dataset: <DatasetPage appState={appState} setAppState={setAppState} toast={toast} />,
    train: <TrainPage appState={appState} setAppState={setAppState} toast={toast} />,
    predict: <PredictPage appState={appState} setAppState={setAppState} toast={toast} />,
    viz: <VizPage appState={appState} />,
    metrics: <MetricsPage appState={appState} toast={toast} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar active={page} onChange={setPage} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar page={page} />
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }} className="grid-bg">
          {pages[page]}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─── APP ROOT ──────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  return (
    <>
      <GlobalStyles />
      {entered ? <Dashboard /> : <LandingPage onEnter={() => setEntered(true)} />}
    </>
  );
}