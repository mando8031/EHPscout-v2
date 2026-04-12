import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  const getData = () =>
    JSON.parse(localStorage.getItem("scoutingData") || "[]");

  const handleExport = () => {
    try {
      const data = getData();
      const compressed = pako.deflate(JSON.stringify(data));
      const encoded = btoa(String.fromCharCode(...compressed));
      setExportText(encoded);
    } catch {
      alert("Export failed");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy");
    }
  };

  const handleImport = () => {
    try {
      const binary = atob(importText.trim());
      const bytes = new Uint8Array(
        [...binary].map((c) => c.charCodeAt(0))
      );
      const incoming = JSON.parse(
        pako.inflate(bytes, { to: "string" })
      );

      if (!Array.isArray(incoming)) throw new Error();

      const existing = getData();
      const merged = [...existing];

      incoming.forEach((entry) => {
        const exists = merged.some(
          (e) =>
            e.team === entry.team &&
            e.match === entry.match &&
            e.event === entry.event
        );
        if (!exists) merged.push(entry);
      });

      localStorage.setItem("scoutingData", JSON.stringify(merged));
      alert(`Imported ${incoming.length} entries`);
      setImportText("");
    } catch {
      alert("Import failed - invalid data");
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete ALL scouting data? This cannot be undone.")) {
      localStorage.removeItem("scoutingData");
      setExportText("");
      alert("All data cleared");
    }
  };

  const dataCount = getData().length;

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        paddingTop: 8
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Data Sync</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            Share data between devices
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 16,
        marginBottom: 16,
        borderRadius: 14,
        background: "#12121a",
        border: "1px solid #2a2a38"
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background: "#1a1a24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="24" height="24" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f0f0f5" }}>
            {dataCount}
          </div>
          <div style={{ fontSize: 13, color: "#6b6b78" }}>
            Entries stored locally
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div style={{
        padding: 16,
        marginBottom: 16,
        borderRadius: 14,
        background: "#12121a",
        border: "1px solid #2a2a38"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        }}>
          <svg width="18" height="18" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Export Data</h3>
        </div>
        <p style={{ fontSize: 13, color: "#6b6b78", marginBottom: 12 }}>
          Generate a code to share your scouting data with other devices.
        </p>

        <button
          onClick={handleExport}
          style={{
            width: "100%",
            padding: 14,
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: 10,
            fontWeight: 600,
            marginBottom: exportText ? 12 : 0
          }}
        >
          Generate Export Code
        </button>

        {exportText && (
          <>
            <textarea
              value={exportText}
              readOnly
              style={{
                height: 100,
                fontSize: 12,
                fontFamily: "monospace",
                background: "#0a0a0f",
                marginBottom: 8
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                width: "100%",
                padding: 12,
                background: copied ? "#22c55e" : "#1a1a24",
                border: "1px solid #2a2a38",
                color: copied ? "white" : "#9898a8",
                borderRadius: 10,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              {copied ? (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Import Section */}
      <div style={{
        padding: 16,
        marginBottom: 16,
        borderRadius: 14,
        background: "#12121a",
        border: "1px solid #2a2a38"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        }}>
          <svg width="18" height="18" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Import Data</h3>
        </div>
        <p style={{ fontSize: 13, color: "#6b6b78", marginBottom: 12 }}>
          Paste an export code to merge data from another device.
        </p>

        <textarea
          placeholder="Paste export code here..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={{
            height: 100,
            fontSize: 12,
            fontFamily: "monospace",
            marginBottom: 12
          }}
        />

        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          style={{
            width: "100%",
            padding: 14,
            background: importText.trim() ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "#1a1a24",
            borderRadius: 10,
            fontWeight: 600,
            color: importText.trim() ? "white" : "#6b6b78"
          }}
        >
          Import Data
        </button>
      </div>

      {/* Danger Zone */}
      <div style={{
        padding: 16,
        borderRadius: 14,
        background: "rgba(239, 68, 68, 0.05)",
        border: "1px solid rgba(239, 68, 68, 0.2)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        }}>
          <svg width="18" height="18" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 style={{ margin: 0, fontSize: 15, color: "#ef4444" }}>Danger Zone</h3>
        </div>

        <button
          onClick={handleClearData}
          style={{
            width: "100%",
            padding: 14,
            background: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            borderRadius: 10,
            fontWeight: 600
          }}
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}
