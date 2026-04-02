import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {

  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  // 📤 EXPORT
  const handleExport = () => {

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const compressed = btoa(
      String.fromCharCode(...pako.deflate(JSON.stringify(data)))
    );

    setExportText(compressed);
  };

  // 📥 IMPORT
  const handleImport = () => {

    try {
      const binary = Uint8Array.from(
        atob(importText),
        c => c.charCodeAt(0)
      );

      const decompressed = pako.inflate(binary, { to: "string" });

      const imported = JSON.parse(decompressed);

      console.log("IMPORTED:", imported);

      if (!Array.isArray(imported)) {
        throw new Error("Invalid data");
      }

      // 🔥 FILTER ONLY VALID ENTRIES
      const valid = imported.filter(e =>
        e &&
        typeof e === "object" &&
        e.team &&
        e.matchNumber
      );

      console.log("VALID:", valid);

      const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

      // 🔥 APPEND ONLY (NO OVERWRITE)
      const merged = [...existing];

      valid.forEach(newEntry => {

        const exists = merged.some(e =>
          e.team === newEntry.team &&
          e.matchNumber === newEntry.matchNumber
        );

        if (!exists) {
          merged.push(newEntry);
        }
      });

      console.log("FINAL:", merged);

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Import complete (no overwrite)");

      setImportText("");

    } catch (err) {
      console.error("IMPORT ERROR:", err);
      alert("Import failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Sync</h1>

      <button
        onClick={handleExport}
        style={{ width: "100%", padding: "15px", marginBottom: "10px" }}
      >
        Generate Export Code
      </button>

      {exportText && (
        <textarea
          value={exportText}
          readOnly
          style={{ width: "100%", height: "150px", marginBottom: "20px" }}
        />
      )}

      <textarea
        placeholder="Paste data here..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        style={{ width: "100%", height: "150px", marginBottom: "10px" }}
      />

      <button
        onClick={handleImport}
        style={{ width: "100%", padding: "15px" }}
      >
        Import Data
      </button>
    </div>
  );
}
