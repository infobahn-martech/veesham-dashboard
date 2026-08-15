import { useEffect, useState } from "react";
import { jobs as seedJobs } from "../data/jobs";
import { items as seedItems } from "../data/items";
import { generateId } from "../utils/format";
import { JobsDataContext } from "./jobsData";

const JOBS_KEY = "veesham_jobs";
const ITEMS_KEY = "veesham_items";

function nowIso() {
  return new Date().toISOString();
}

function loadInitialJobs() {
  try {
    const stored = localStorage.getItem(JOBS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through to seed data
  }
  return seedJobs.map((job) => ({
    ...job,
    notes: job.notes || "",
    archived: false,
    activity: [{ ts: nowIso(), message: "Job created" }],
  }));
}

function loadInitialItems() {
  try {
    const stored = localStorage.getItem(ITEMS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through to seed data
  }
  return seedItems;
}

export function JobsDataProvider({ children }) {
  const [jobs, setJobs] = useState(loadInitialJobs);
  const [items, setItems] = useState(loadInitialItems);

  useEffect(() => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }, [items]);

  function addJob(jobInput) {
    const totalQty = Number(jobInput.totalQty) || 0;
    const deliveredQty = Number(jobInput.deliveredQty) || 0;
    const job = {
      id: generateId("job"),
      ...jobInput,
      totalQty,
      deliveredQty,
      balanceQty: totalQty - deliveredQty,
      archived: false,
      activity: [{ ts: nowIso(), message: "Job created" }],
    };
    setJobs((prev) => [job, ...prev]);
    return job;
  }

  function updateJob(id, patch) {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;
        const merged = { ...job, ...patch };
        const totalQty = Number(merged.totalQty) || 0;
        const deliveredQty = Number(merged.deliveredQty) || 0;
        merged.totalQty = totalQty;
        merged.deliveredQty = deliveredQty;
        merged.balanceQty = totalQty - deliveredQty;

        const activity = [...job.activity];
        if (patch.status && patch.status !== job.status) {
          activity.push({ ts: nowIso(), message: `Status changed to ${patch.status}` });
        }
        if (patch.deliveredQty !== undefined && Number(patch.deliveredQty) !== job.deliveredQty) {
          activity.push({ ts: nowIso(), message: `Delivered quantity updated to ${deliveredQty.toLocaleString()}` });
        }
        merged.activity = activity;
        return merged;
      })
    );
  }

  function updateJobStatus(id, status, note) {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== id) return job;
        const message = note ? `Status changed to ${status} — ${note}` : `Status changed to ${status}`;
        return { ...job, status, activity: [...job.activity, { ts: nowIso(), message }] };
      })
    );
  }

  function archiveJob(id) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, archived: true, activity: [...job.activity, { ts: nowIso(), message: "Job archived" }] }
          : job
      )
    );
  }

  function addItem(itemInput) {
    const item = {
      id: generateId("itm"),
      ...itemInput,
      createdDate: new Date().toISOString().slice(0, 10),
      updatedDate: new Date().toISOString().slice(0, 10),
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }

  function updateItem(id, patch) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...patch, updatedDate: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
  }

  function setItemStatus(id, status) {
    updateItem(id, { status });
  }

  return (
    <JobsDataContext.Provider
      value={{ jobs, items, addJob, updateJob, updateJobStatus, archiveJob, addItem, updateItem, setItemStatus }}
    >
      {children}
    </JobsDataContext.Provider>
  );
}
