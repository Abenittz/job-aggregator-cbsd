import { Job } from "@repo/types";

const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description:
      "We are looking for an experienced frontend developer proficient in React and Next.js.",
    postedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSync",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description:
      "Join our data infrastructure team building high-performance Node.js microservices.",
    postedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignCo",
    location: "San Francisco, CA",
    type: "Contract",
    salary: "$60 - $80 / hr",
    description:
      "Looking for a talented designer to revamp our core product interface.",
    postedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const savedJobIds = new Set<number>();

export const JobModel = {
  findAll: (query?: string, type?: string, location?: string) => {
    let filtered = jobs;
    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(lower) ||
          j.company.toLowerCase().includes(lower) ||
          j.description.toLowerCase().includes(lower)
      );
    }
    if (type) {
      filtered = filtered.filter((j) => j.type === type);
    }
    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(loc)
      );
    }

    return filtered.map((j) => ({ ...j, isSaved: savedJobIds.has(j.id) }));
  },

  findById: (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return null;
    return { ...job, isSaved: savedJobIds.has(job.id) };
  },

  saveJob: (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      savedJobIds.add(id);
      return true;
    }
    return false;
  },

  unsaveJob: (id: number) => {
    savedJobIds.delete(id);
    return true;
  },
};
