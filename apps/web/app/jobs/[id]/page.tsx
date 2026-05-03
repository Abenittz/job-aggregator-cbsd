import { Job } from "@repo/types";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getJob(id: string): Promise<Job | null> {
  const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch job");
  }
  return res.json();
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const job = await getJob(resolvedParams.id);

  if (!job) {
    notFound();
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#0070f3",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "2rem",
          fontWeight: "bold",
        }}
      >
        &larr; Back to Jobs
      </Link>

      <div
        style={{
          border: "1px solid #eaeaea",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <h1 style={{ margin: 0, color: "#333", fontSize: "2rem" }}>
            {job.title}
          </h1>
          <span
            style={{
              background: "#e0f7fa",
              color: "#006064",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {job.type}
          </span>
        </div>

        <h2 style={{ margin: "0 0 1.5rem 0", color: "#555", fontSize: "1.25rem" }}>
          {job.company} • {job.location}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #eaeaea",
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", color: "#888", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              Salary
            </span>
            <span style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "1.125rem" }}>
              {job.salary}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", color: "#888", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              Posted
            </span>
            <span style={{ color: "#333", fontWeight: "bold", fontSize: "1.125rem" }}>
              {new Date(job.postedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#333", fontSize: "1.25rem" }}>
            Job Description
          </h3>
          <p
            style={{
              margin: 0,
              color: "#444",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {job.description}
          </p>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <button
            style={{
              padding: "1rem 2rem",
              fontSize: "1.125rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#0070f3",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
