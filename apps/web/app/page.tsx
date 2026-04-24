import { Job } from "@repo/types";

async function getJobs(): Promise<Job[]> {
  const res = await fetch("http://localhost:5000/api/jobs", {
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Page() {
  const jobs = await getJobs();

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Latest Jobs
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: "1px solid #eaeaea",
                borderRadius: "8px",
                padding: "1.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
                <h2
                  style={{ margin: 0, color: "#0070f3", fontSize: "1.25rem" }}
                >
                  {job.title}
                </h2>
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
              <p
                style={{
                  margin: "0 0 1rem 0",
                  color: "#333",
                  lineHeight: "1.5",
                }}
              >
                {job.description}
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
                <span style={{ color: "#888", fontSize: "0.875rem" }}>
                  {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No jobs found. Make sure the API is running.
          </p>
        )}
      </div>
    </div>
  );
}
