import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { formatDate, formatNumber, formatTimelineTimestamp } from "../utils/format";
import "./DetailView.css";
import "./FormField.css";
import "./JobViewModal.css";

function JobViewModal({ job, onClose }) {
  const progress = job.totalQty > 0 ? Math.min(100, (job.deliveredQty / job.totalQty) * 100) : 0;

  return (
    <Modal title={job.jobNo} subtitle={job.client} size="lg" onClose={onClose}>
      <div className="job-view">
        <div className="job-view__section">
          <p className="form-section__title">Overview</p>
          <dl className="detail-view">
            <div className="detail-view__row">
              <dt>Job No.</dt>
              <dd className="mono">{job.jobNo}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Client</dt>
              <dd>{job.client}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Salesperson</dt>
              <dd>{job.salesperson}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Item</dt>
              <dd>{job.item}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Status</dt>
              <dd>
                <StatusBadge status={job.status} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="job-view__section">
          <p className="form-section__title">Quantity Progress</p>
          <div className="job-view__qty-row">
            <span>Total</span>
            <span className="job-view__qty-value">{formatNumber(job.totalQty)}</span>
          </div>
          <div className="job-view__qty-row">
            <span>Delivered</span>
            <span className="job-view__qty-value">{formatNumber(job.deliveredQty)}</span>
          </div>
          <div className="job-view__qty-row">
            <span>Balance</span>
            <span className="job-view__qty-value">{formatNumber(job.balanceQty)}</span>
          </div>
          <div className="job-view__progress-track">
            <div className="job-view__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="job-view__section">
          <p className="form-section__title">Delivery</p>
          <dl className="detail-view">
            <div className="detail-view__row">
              <dt>Delivery Date</dt>
              <dd>{formatDate(job.deliveryDate)}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Current Status</dt>
              <dd>
                <StatusBadge status={job.status} />
              </dd>
            </div>
          </dl>
        </div>

        {job.notes && (
          <div className="job-view__section">
            <p className="form-section__title">Notes</p>
            <p className="job-view__notes">{job.notes}</p>
          </div>
        )}

        <div className="job-view__section">
          <p className="form-section__title">Activity / Status Timeline</p>
          <ul className="job-view__timeline">
            {(job.activity || []).map((entry, index) => (
              <li key={index}>
                <span className="job-view__timeline-ts">{formatTimelineTimestamp(entry.ts)}</span>
                <span className="job-view__timeline-msg">{entry.message}</span>
              </li>
            ))}
            {(!job.activity || job.activity.length === 0) && (
              <li className="job-view__timeline-empty">No activity recorded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export default JobViewModal;
