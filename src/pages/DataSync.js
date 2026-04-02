import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

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

  const handleImport = () => {
    try {
      const binary = atob(importText.trim());
      const bytes = new Uint8Array(
        [...binary].map((c) => c.charCodeAt(0))
      );

      const incoming = JSON.parse(
        pako.inflate(bytes, { to: "string" })
      );

      if (!Array.isArray(incoming)) {
        throw new Error();
      }

      const existing = getData();
      const merged = [...existing];

      incoming.forEach((entry) => {
        const exists = merged.some(
          (e) =>
            e.team === entry.team &&
            e.match === entry.match && // ✅ FIXED
            e.event === entry.event
        );

        if (!exists) merged.push(entry);
      });

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert(`Imported ${incoming.length} entries`);
      setImportText("");
    } catch {
      alert("Import failed");
    }
  };

  const container = {
    padding: "15px",
    color: "white",
    maxWidth: "600px",
    margin: "auto"
  };

  const card = {
    background: "#1e1e1e",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px"
  };

  const button = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#4caf50",
    color: "white",
    fontSize: "16px",
    marginBottom: "10px"
  };

  const textarea = {
    width: "100%",
    height: "120px",
    marginTop: "10px",
    borderRadius: "8px",
    padding: "10px",
    background: "#111",
    color: "white",
    border: "1px solid #333"
  };

  const dataCount = getData().length;

  return (
    <div style={container}>
      <h2>Data Sync</h2>

      <div style={card}>
        <p>Stored entries: <b>{dataCount}</b></p>

        <button style={button} onClick={handleExport}>
          Export Scout Data
        </button>

        {exportText && (
          <textarea value={exportText} readOnly style={textarea} />
        )}
      </div>

      <div style={card}>
        <textarea
          placeholder="Paste import code..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={textarea}
        />

        <button style={button} onClick={handleImport}>
          Import Data
        </button>
      </div>
    </div>
  );
}
