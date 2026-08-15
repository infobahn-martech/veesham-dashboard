import Modal from "./Modal";
import { getInitials } from "../utils/initials";
import { formatDate, formatLastLogin, formatTimelineTimestamp } from "../utils/format";
import "./DetailView.css";
import "./FormField.css";
import "./JobViewModal.css";
import "./UserViewModal.css";
import "../pages/UserManagement.css";

function UserViewModal({ user, onClose }) {
  return (
    <Modal title={user.name} subtitle={user.role} size="md" onClose={onClose}>
      <div className="user-view__header">
        <span className="user-view__avatar">{getInitials(user.name)}</span>
        <div>
          <p className="user-view__name">{user.name}</p>
          <span className={`user-status-pill user-status-pill--${user.status.toLowerCase()}`}>{user.status}</span>
        </div>
      </div>

      <div className="job-view">
        <div className="job-view__section">
          <p className="form-section__title">Personal Information</p>
          <dl className="detail-view">
            <div className="detail-view__row">
              <dt>Full Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Phone</dt>
              <dd>{user.phone || "—"}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Status</dt>
              <dd>
                <span className={`user-status-pill user-status-pill--${user.status.toLowerCase()}`}>{user.status}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="job-view__section">
          <p className="form-section__title">Access</p>
          <dl className="detail-view">
            <div className="detail-view__row">
              <dt>Role</dt>
              <dd>
                <span className="user-role-pill">{user.role}</span>
              </dd>
            </div>
            <div className="detail-view__row">
              <dt>Account Status</dt>
              <dd>{user.status}</dd>
            </div>
          </dl>
        </div>

        <div className="job-view__section">
          <p className="form-section__title">Activity</p>
          <dl className="detail-view">
            <div className="detail-view__row">
              <dt>Last Login</dt>
              <dd>{formatLastLogin(user.lastLogin)}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Account Created</dt>
              <dd>{formatDate(user.createdDate)}</dd>
            </div>
            <div className="detail-view__row">
              <dt>Last Updated</dt>
              <dd>{formatDate(user.updatedDate || user.createdDate)}</dd>
            </div>
          </dl>
        </div>

        <div className="job-view__section">
          <p className="form-section__title">Recent Activity</p>
          <ul className="job-view__timeline">
            {(user.activity || []).map((entry, index) => (
              <li key={index}>
                <span className="job-view__timeline-ts">{formatTimelineTimestamp(entry.ts)}</span>
                <span className="job-view__timeline-msg">{entry.message}</span>
              </li>
            ))}
            {(!user.activity || user.activity.length === 0) && (
              <li className="job-view__timeline-empty">No activity recorded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export default UserViewModal;
