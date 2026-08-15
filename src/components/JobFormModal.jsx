import { useState } from "react";
import clsx from "clsx";
import Modal from "./Modal";
import { useJobsData, suggestStatus } from "../context/jobsData";
import { useToast } from "../context/toast";
import { STATUSES } from "../data/jobs";
import "./FormField.css";

function JobFormModal({ job, onClose }) {
  const isEdit = Boolean(job);
  const { items, addJob, updateJob } = useJobsData();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    jobNo: job?.jobNo || "",
    client: job?.client || "",
    salesperson: job?.salesperson || "",
    item: job?.item || "",
    totalQty: job?.totalQty ?? "",
    deliveredQty: job?.deliveredQty ?? "",
    deliveryDate: job?.deliveryDate || "",
    status: job?.status || "Pending",
    notes: job?.notes || "",
  });
  const [errors, setErrors] = useState({});

  const activeItems = items.filter((i) => i.status === "Active" || i.itemName === form.item);
  const totalQty = Number(form.totalQty) || 0;
  const deliveredQty = Number(form.deliveredQty) || 0;
  const balanceQty = Math.max(totalQty - deliveredQty, 0);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "totalQty" || field === "deliveredQty") {
        const nextTotal = Number(field === "totalQty" ? value : prev.totalQty) || 0;
        const nextDelivered = Number(field === "deliveredQty" ? value : prev.deliveredQty) || 0;
        next.status = suggestStatus(prev.status, nextDelivered, nextTotal);
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.jobNo.trim()) nextErrors.jobNo = "Job No. is required";
    if (!form.client.trim()) nextErrors.client = "Client is required";
    if (!form.salesperson.trim()) nextErrors.salesperson = "Salesperson is required";
    if (!form.item) nextErrors.item = "Item is required";
    if (!form.deliveryDate) nextErrors.deliveryDate = "Delivery date is required";
    if (totalQty <= 0) nextErrors.totalQty = "Total quantity must be greater than 0";
    if (deliveredQty < 0) nextErrors.deliveredQty = "Delivered quantity cannot be negative";
    if (deliveredQty > totalQty) nextErrors.deliveredQty = "Delivered quantity cannot exceed total quantity";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      jobNo: form.jobNo.trim(),
      client: form.client.trim(),
      salesperson: form.salesperson.trim(),
      item: form.item,
      totalQty,
      deliveredQty,
      deliveryDate: form.deliveryDate,
      status: form.status,
      notes: form.notes.trim(),
    };

    if (isEdit) {
      updateJob(job.id, payload);
      showToast("Job updated successfully");
    } else {
      addJob(payload);
      showToast("Job created successfully");
    }
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit Job" : "Create Job"}
      subtitle={isEdit ? `${job.jobNo} · ${job.client}` : "Set up a new production job"}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="job-form" className="btn btn-primary">
            {isEdit ? "Save Changes" : "Create Job"}
          </button>
        </>
      }
    >
      <form id="job-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <p className="form-section__title">Basic Information</p>
          <div className="form-grid">
            <div className={clsx("form-field", errors.jobNo && "form-field--error")}>
              <label htmlFor="jobNo">Job No.</label>
              <input id="jobNo" type="text" value={form.jobNo} onChange={(e) => update("jobNo", e.target.value)} placeholder="JB-2421" />
              {errors.jobNo && <span className="form-field__error">{errors.jobNo}</span>}
            </div>
            <div className={clsx("form-field", errors.client && "form-field--error")}>
              <label htmlFor="client">Client</label>
              <input id="client" type="text" value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="Client name" />
              {errors.client && <span className="form-field__error">{errors.client}</span>}
            </div>
            <div className={clsx("form-field", errors.salesperson && "form-field--error")}>
              <label htmlFor="salesperson">Salesperson</label>
              <input id="salesperson" type="text" value={form.salesperson} onChange={(e) => update("salesperson", e.target.value)} placeholder="Salesperson name" />
              {errors.salesperson && <span className="form-field__error">{errors.salesperson}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-section__title">Item Information</p>
          <div className="form-grid">
            <div className={clsx("form-field", "form-field--span2", errors.item && "form-field--error")}>
              <label htmlFor="item">Item</label>
              <select id="item" value={form.item} onChange={(e) => update("item", e.target.value)}>
                <option value="">Select item</option>
                {activeItems.map((i) => (
                  <option key={i.id} value={i.itemName}>
                    {i.itemCode} — {i.itemName}
                  </option>
                ))}
              </select>
              {errors.item && <span className="form-field__error">{errors.item}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-section__title">Quantity</p>
          <div className="form-grid">
            <div className={clsx("form-field", errors.totalQty && "form-field--error")}>
              <label htmlFor="totalQty">Total Quantity</label>
              <input id="totalQty" type="number" min="0" value={form.totalQty} onChange={(e) => update("totalQty", e.target.value)} />
              {errors.totalQty && <span className="form-field__error">{errors.totalQty}</span>}
            </div>
            <div className={clsx("form-field", errors.deliveredQty && "form-field--error")}>
              <label htmlFor="deliveredQty">Delivered Quantity</label>
              <input id="deliveredQty" type="number" min="0" value={form.deliveredQty} onChange={(e) => update("deliveredQty", e.target.value)} />
              {errors.deliveredQty && <span className="form-field__error">{errors.deliveredQty}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="balanceQty">Balance Quantity</label>
              <input id="balanceQty" type="text" value={balanceQty.toLocaleString()} readOnly />
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-section__title">Delivery &amp; Status</p>
          <div className="form-grid">
            <div className={clsx("form-field", errors.deliveryDate && "form-field--error")}>
              <label htmlFor="deliveryDate">Delivery Date</label>
              <input id="deliveryDate" type="date" value={form.deliveryDate} onChange={(e) => update("deliveryDate", e.target.value)} />
              {errors.deliveryDate && <span className="form-field__error">{errors.deliveryDate}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={(e) => update("status", e.target.value)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-field">
            <label htmlFor="notes">
              Notes <span className="optional">(optional)</span>
            </label>
            <textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any additional notes for this job" />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default JobFormModal;
