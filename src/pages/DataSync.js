import React, { useState } from "react";
import pako from "pako";
import { PageHeader, Card } from "./EventSelect";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [copied,     setCopied]     = useState(false);

  const getData = () => JSON.parse(localStorage.getItem("scoutingData") || "[]");

  const handleExport = () => {
    try {
      const compressed = pako.deflate(JSON.stringify(getData()));
      setExportText(btoa(String.fromCharCode(...compressed)));
    } catch { alert("Export failed"); }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { alert("Failed to copy"); }
  };

  const handleImport = () => {
    try {
      const binary   = atob(importText.trim());
      const bytes    = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
      const incoming = JSON.parse(pako.inflate(bytes, { to: "string" }));
      if (!Array.isArray(incoming)) throw new Error();
      const existing = getData();
      const merged   = [...existing];
      incoming.forEach(entry => {
        const dup = merged.some(e => e.team === entry.team && e.match === entry.match && e.event === entry.event);
        if (!dup) merged.push(entry);
      });
      localStorage.setItem("scoutingData", JSON.stringify(merged));
      alert(`Imported ${incoming.length} entries`);
      setImportText("");
    } catch { alert("Import failed — invalid data"); }
  };

  const handleClear = () => {
    if (window.confirm("Delete ALL scouting data? This cannot be undone.")) {
      localStorage.removeItem("scoutingData");
      setExportText("");
      alert("All data cleared");
    }
  };

  const count = getData().length;

  const iconBlue = (
    <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <div style={{ padding: "0 14px 16px", maxWidth: 600, margin: "0 auto" }}>
      <PageHeader title="Data Sync" subtitle="Share data between devices" iconBg="var(--blue)" icon={iconBlue} />

      {/* Count */}
      <Card style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" fill="none" stroke="var(--blue)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{count}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Entries stored locally</div>
        </div>
      </Card>

      {/* Export */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" fill="none" stroke="var(--blue)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <h3 style={{ fontSize: 14 }}>Export Data</h3>
        </div>
        <p style={{ fontSize: 13, marginBottom: 12 }}>Generate a compressed code to share your data.</p>
        <button onClick={handleExport} style={{ width: "100%", padding: 13, fontWeight: 600, marginBottom: exportText ? 10 : 0 }}>
          Generate Export Code
        </button>
        {exportText && (
          <>
            <textarea value={exportText} readOnly style={{ height: 90, fontSize: 11, fontFamily: "monospace", background: "var(--bg-base)", marginBottom: 8 }} />
            <button
              onClick={handleCopy}
              style={{
                width: "100%", padding: 12,
                background: copied ? "rgba(34,197,94,0.15)" : "var(--bg-elevated)",
                border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                color: copied ? "#22c55e" : "var(--text-secondary)",
                borderRadius: 10, fontSize: 13, fontWeight: 500
              }}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </>
        )}
      </Card>

      {/* Import */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <h3 style={{ fontSize: 14 }}>Import Data</h3>
        </div>
        <p style={{ fontSize: 13, marginBottom: 12 }}>Paste a code from another device to merge data.</p>
        <textarea
          placeholder="Paste export code here..."
          value={importText}
          onChange={e => setImportText(e.target.value)}
          style={{ height: 90, fontSize: 11, fontFamily: "monospace", marginBottom: 10 }}
        />
        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          style={{
            width: "100%", padding: 13, fontWeight: 600,
            background: importText.trim() ? "rgba(34,197,94,0.9)" : "var(--bg-elevated)",
            color: importText.trim() ? "white" : "var(--text-muted)"
          }}
        >
          Import & Merge
        </button>
      </Card>

      {/* Danger */}
      <Card style={{ background: "rgba(239,68,68,0.05)", border: "1px solid var(--red-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" fill="none" stroke="var(--red)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 style={{ fontSize: 14, color: "var(--red)" }}>Danger Zone</h3>
        </div>
        <button onClick={handleClear} style={{ width: "100%", padding: 13, background: "transparent", border: "1px solid var(--red)", color: "var(--red)", fontWeight: 600, borderRadius: 10 }}>
          Clear All Data
        </button>
      </Card>
    </div>
  );
}
