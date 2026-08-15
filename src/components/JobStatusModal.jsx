import { useState } from "react";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { useJobsData } from "../context/jobsData";
import { useToast } from "../context/toast";
import { STATUSES } from "../data/jobs";
import "./FormField.css";

function JobStatusModal({ job, onClose }) {
  const { updateJobStatus } = useJobsData();
  const { showToast } = useToast();
  const [status, setStatus] = useState(job.status);
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    updateJobStatus(job.id, status, note.trim());
    showToast("Status updated successfully");
    onClose();
  }

  return (
    <Modal
      title="Update Status"
      subtitle={`${job.jobNo} · ${job.client}`}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="status-form" className="btn btn-primary" disabled={status === job.status && !note.trim()}>
            Update
          </button>
        </>
      }
    >
      <form id="status-form" onSubmit={handleSubmit} className="form-grid form-grid--single">
        <div className="form-field">
          <label>Current Status</label>
          <div>
            <StatusBadge status={job.status} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="new-status">New Status</label>
          <select id="new-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status-note">
            Note <span className="optional">(optional)</span>
          </label>
          <textarea id="status-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this status change" />
        </div>
      </form>
    </Modal>
  );
}

export default JobStatusModal;
