import React, { useState } from "react";
import QRCode from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function DataSync() {

  const [qrData, setQrData] = useState("");
  const [scanning, setScanning] = useState(false);

  // 📤 GENERATE QR
  const handleGenerateQR = () => {
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    // ⚠️ limit size for QR
    const recent = data.slice(-25);

    const payload = JSON.stringify(recent);

    setQrData(payload);
  };

  // 📥 START SCANNER
  const startScanner = () => {
    setScanning(true);

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const imported = JSON.parse(decodedText);

          const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

          const map = {};

          [...existing, ...imported].forEach(entry => {
            map[entry.id] = entry;
          });

          const merged = Object.values(map);

          localStorage.setItem("scoutingData", JSON.stringify(merged));

          alert("QR Data Merged!");

          scanner.clear();
          setScanning(false);

        } catch (err) {
          console.error(err);
          alert("Invalid QR Data");
        }
      },
      (error) => {
        // ignore scan errors
      }
    );
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>QR Sync</h1>

      {/* EXPORT */}
      <button
        onClick={handleGenerateQR}
        style={{ width: "100%", padding: "15px", marginBottom: "15px" }}
      >
        Generate QR Code
      </button>

      {qrData && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <QRCode value={qrData} size={250} />
          <p>Have another device scan this</p>
        </div>
      )}

      {/* IMPORT */}
      {!scanning && (
        <button
          onClick={startScanner}
          style={{ width: "100%", padding: "15px" }}
        >
          Scan QR Code
        </button>
      )}

      {/* CAMERA */}
      {scanning && (
        <div id="reader" style={{ marginTop: "20px" }} />
      )}
    </div>
  );
}
