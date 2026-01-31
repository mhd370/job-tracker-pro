import React, { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useLocalStorage("jobs", []);

  const addJob = useCallback(
    (job) => {
      setJobs((prev) => [job, ...prev]);
    },
    [setJobs]
  );

  const updateJob = useCallback(
    (id, updates) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
      );
    },
    [setJobs]
  );

  const deleteJob = useCallback(
    (id) => {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    },
    [setJobs]
  );

  const value = useMemo(
    () => ({ jobs, addJob, updateJob, deleteJob }),
    [jobs, addJob, updateJob, deleteJob]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside JobsProvider");
  return ctx;
}
