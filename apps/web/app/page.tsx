import { Job } from "@repo/types";
import Link from "next/link";
import SaveButton from "./components/SaveButton";

async function getJobs(
  query?: string,
  type?: string,
  location?: string,
): Promise<Job[]> {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (type) params.append("type", type);
  if (location) params.append("location", location);

  const queryString = params.toString();
  const url = `http://localhost:5000/api/jobs${queryString ? "?" + queryString : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query =
    typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const type =
    typeof resolvedParams.type === "string" ? resolvedParams.type : undefined;
  const location =
    typeof resolvedParams.location === "string"
      ? resolvedParams.location
      : undefined;
  const jobs = await getJobs(query, type, location);

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

      <form
        method="GET"
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          name="q"
          defaultValue={query || ""}
          placeholder="Search jobs by title, company, or description..."
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <select
          name="type"
          defaultValue={type || ""}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            backgroundColor: "white",
          }}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <input
          type="text"
          name="location"
          defaultValue={location || ""}
          placeholder="Location..."
          style={{
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Search
        </button>
      </form>

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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h2
                    style={{ margin: 0, fontSize: "1.25rem" }}
                  >
                    <Link
                      href={`/jobs/${job.id}`}
                      style={{ color: "#0070f3", textDecoration: "none" }}
                    >
                      {job.title}
                    </Link>
                  </h2>
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
