"use client";

import { useState } from "react";

export default function SaveButton({
  jobId,
  initialSaved,
}: {
  jobId: number;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(!!initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ save: !saved }),
      });

      if (res.ok) {
        setSaved(!saved);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      style={{
        background: "transparent",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: saved ? "#e91e63" : "#ccc",
        transition: "color 0.2s",
      }}
      title={saved ? "Unsave Job" : "Save Job"}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
}
