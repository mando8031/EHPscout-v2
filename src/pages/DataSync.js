import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {

  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  // 📤 EXPORT
  const handleExport = () => {

    const rawData = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    console.log("EXPORTING:", rawData);

    const cleaned = rawData.map(e => ({
      t: e.team,
      m: e.matchNumber,
      a: e.auton,
      ac: e.accuracy,
      c: e.climb,
      mv: e.movement,
      i: e.intake
    }));

    const compressed = btoa(
      String.fromCharCode(...pako.deflate(JSON.stringify(cleaned)))
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

      const importedShort = JSON.parse(decompressed);

      console.log("RAW IMPORT:", importedShort);

      if (!Array.isArray(importedShort)) {
        throw new Error("Invalid format");
      }

      // 🔥 EXPAND
      const imported = importedShort.map(e => ({
        team: e.t,
        matchNumber: e.m,
        auton: e.a,
        accuracy: e.ac,
        climb: e.c,
        movement: e.mv,
        intake: e.i
      }));

      const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

      console.log("EXISTING:", existing);

      const map = {};

      // ✅ LOAD EXISTING FIRST
      existing.forEach(entry => {
        if (!entry.team || !entry.matchNumber) return;

        const key = `${entry.team}-${entry.matchNumber}`;
        map[key] = entry;
      });

      // ✅ MERGE NEW SAFELY
      imported.forEach(entry => {

        if (!entry.team || !entry.matchNumber) {
          console.warn("Skipping invalid entry:", entry);
          return;
        }

        const key = `${entry.team}-${entry.matchNumber}`;

        const existingEntry = map[key];

        // 🧠 KEEP BEST DATA
        if (!existingEntry) {
          map[key] = entry;
          return;
        }

        // Only replace if new data is more complete
        const score = (e) =>
          [e.auton, e.accuracy, e.climb, e.movement, e.intake]
            .filter(v => v !== null && v !== undefined).length;

        if (score(entry) >= score(existingEntry)) {
          map[key] = entry;
        }
      });

      const merged = Object.values(map);

      console.log("FINAL MERGED:", merged);

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Import successful!");

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
