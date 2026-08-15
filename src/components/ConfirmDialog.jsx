import Modal from "./Modal";
import "./ConfirmDialog.css";

function ConfirmDialog({ title, message, confirmLabel = "Confirm", tone = "primary", onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      size="sm"
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={tone === "danger" ? "btn btn-danger" : "btn btn-primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="confirm-dialog__message">{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
