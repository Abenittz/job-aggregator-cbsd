import { Job } from "@repo/types";
import Link from "next/link";
import SaveButton from "../components/SaveButton";

async function getDashboardData(): Promise<{
  savedJobs: Job[];
  recentJobs: Job[];
}> {
  const res = await fetch(`http://localhost:5000/api/jobs/dashboard`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { savedJobs: [], recentJobs: [] };
  }
  return res.json();
}

function JobCard({ job }: { job: Job }) {
  return (
    <div
      style={{
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
            <Link
              href={`/jobs/${job.id}`}
              style={{ color: "#0070f3", textDecoration: "none" }}
            >
              {job.title}
            </Link>
          </h3>
          <SaveButton jobId={job.id} initialSaved={job.isSaved} />
        </div>
        <span
          style={{
            background: "#e0f7fa",
            color: "#006064",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.875rem",
            fontWeight: "bold",
          }}
        >
          {job.type}
        </span>
      </div>
      <p
        style={{
          margin: "0 0 1rem 0",
          color: "#555",
          fontWeight: "500",
        }}
      >
        {job.company} • {job.location}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #eaeaea",
          paddingTop: "1rem",
        }}
      >
        <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
          {job.salary}
        </span>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { savedJobs, recentJobs } = await getDashboardData();

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, color: "#333" }}>User Dashboard</h1>
        <Link
          href="/"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Browse All Jobs &rarr;
        </Link>
      </div>

      <section style={{ marginBottom: "4rem" }}>
        <h2
          style={{
            color: "#444",
            borderBottom: "2px solid #eaeaea",
            paddingBottom: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Saved Jobs ({savedJobs.length})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p style={{ color: "#888", fontStyle: "italic" }}>
              You haven't saved any jobs yet.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2
          style={{
            color: "#444",
            borderBottom: "2px solid #eaeaea",
            paddingBottom: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Recently Viewed
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {recentJobs.length > 0 ? (
            recentJobs.map((job) => <JobCard key={`recent-${job.id}`} job={job} />)
          ) : (
            <p style={{ color: "#888", fontStyle: "italic" }}>
              You haven't viewed any jobs recently.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
