import Modal from "./Modal";
import { formatDate } from "../utils/format";
import "./DetailView.css";
import "../pages/Items.css";

function ItemViewModal({ item, onClose }) {
  return (
    <Modal title={item.itemName} subtitle={item.itemCode} size="md" onClose={onClose}>
      <dl className="detail-view">
        <div className="detail-view__row">
          <dt>Item Code</dt>
          <dd className="mono">{item.itemCode}</dd>
        </div>
        <div className="detail-view__row">
          <dt>Item Name</dt>
          <dd>{item.itemName}</dd>
        </div>
        <div className="detail-view__row">
          <dt>Category</dt>
          <dd>{item.category}</dd>
        </div>
        <div className="detail-view__row">
          <dt>Description</dt>
          <dd>{item.description || "—"}</dd>
        </div>
        <div className="detail-view__row">
          <dt>Status</dt>
          <dd>
            <span className={`item-status-pill item-status-pill--${item.status.toLowerCase()}`}>{item.status}</span>
          </dd>
        </div>
        <div className="detail-view__row">
          <dt>Created Date</dt>
          <dd>{formatDate(item.createdDate)}</dd>
        </div>
        <div className="detail-view__row">
          <dt>Last Updated</dt>
          <dd>{formatDate(item.updatedDate)}</dd>
        </div>
      </dl>
    </Modal>
  );
}

export default ItemViewModal;
