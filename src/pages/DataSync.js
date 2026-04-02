import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  // 🔒 Safe conversion
  const uint8ToBase64 = (u8) => {
    let binary = "";import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    try {
      const scoutingData = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const compressed = pako.deflate(JSON.stringify(scoutingData));
      const encoded = btoa(
        String.fromCharCode(...compressed)
      );

      setExportText(encoded);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  const handleImport = () => {
    try {
      const binary = atob(importText.trim());
      const bytes = new Uint8Array(
        [...binary].map((c) => c.charCodeAt(0))
      );

      const decompressed = pako.inflate(bytes, { to: "string" });
      const incoming = JSON.parse(decompressed);

      if (!Array.isArray(incoming)) {
        throw new Error("Invalid format");
      }

      const existing = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const merged = [...existing];

      incoming.forEach((entry) => {
        const exists = merged.some(
          (e) =>
            e.team === entry.team &&
            e.matchNumber === entry.matchNumber
        );

        if (!exists) merged.push(entry);
      });

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Import successful");
      setImportText("");
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Scout Data Sync</h1>

      <button onClick={handleExport}>
        Export Scout Data
      </button>

      {exportText && (
        <textarea
          value={exportText}
          readOnly
          style={{ width: "100%", height: "150px" }}
        />
      )}

      <textarea
        placeholder="Paste import code..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      />

      <button onClick={handleImport}>
        Import Data
      </button>
    </div>
  );
}
    const chunkSize = 0x8000;

    for (let i = 0; i < u8.length; i += chunkSize) {
      binary += String.fromCharCode.apply(
        null,
        u8.subarray(i, i + chunkSize)
      );
    }

    return btoa(binary);
  };

  const base64ToUint8 = (b64) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  };

  // 📤 EXPORT ONLY SCOUT DATA
  const handleExport = () => {
    try {
      const scoutingData = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const payload = {
        version: 1,
        timestamp: Date.now(),
        scoutingData,
      };

      const compressed = pako.deflate(JSON.stringify(payload));
      const encoded = uint8ToBase64(compressed);

      setExportText(encoded);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  // 📥 IMPORT + MERGE
  const handleImport = () => {
    try {
      const binary = base64ToUint8(importText.trim());
      const decompressed = pako.inflate(binary, { to: "string" });

      const parsed = JSON.parse(decompressed);

      if (!parsed || !Array.isArray(parsed.scoutingData)) {
        throw new Error("Invalid format");
      }

      const existing = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const merged = [...existing];

      parsed.scoutingData.forEach((entry) => {
        const exists = merged.some(
          (e) =>
            e.team === entry.team &&
            e.matchNumber === entry.matchNumber
        );

        if (!exists) {
          merged.push(entry);
        }
      });

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Import successful");
      setImportText("");
    } catch (err) {
      console.error(err);
      alert("Import failed - invalid or corrupted data");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Scout Data Sync</h1>

      <button
        onClick={handleExport}
        style={{ width: "100%", padding: "15px", marginBottom: "10px" }}
      >
        Export Scout Data
      </button>

      {exportText && (
        <textarea
          value={exportText}
          readOnly
          style={{ width: "100%", height: "150px", marginBottom: "20px" }}
        />
      )}

      <textarea
        placeholder="Paste import code..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        style={{ width: "100%", height: "150px", marginBottom: "10px" }}
      />

      <button
        onClick={handleImport}
        style={{ width: "100%", padding: "15px" }}
      >
        Import Scout Data
      </button>
    </div>
  );
}        throw new Error("Invalid data");
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
