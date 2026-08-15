import { useState } from "react";
import clsx from "clsx";
import Modal from "./Modal";
import { useJobsData } from "../context/jobsData";
import { useToast } from "../context/toast";
import { CATEGORIES, ITEM_STATUSES } from "../data/items";
import "./FormField.css";

function ItemFormModal({ item, onClose }) {
  const isEdit = Boolean(item);
  const { addItem, updateItem } = useJobsData();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    itemCode: item?.itemCode || "",
    itemName: item?.itemName || "",
    category: item?.category || "",
    description: item?.description || "",
    status: item?.status || "Active",
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.itemCode.trim()) nextErrors.itemCode = "Item code is required";
    if (!form.itemName.trim()) nextErrors.itemName = "Item name is required";
    if (!form.category) nextErrors.category = "Category is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      updateItem(item.id, form);
      showToast("Item updated successfully");
    } else {
      addItem(form);
      showToast("Item created successfully");
    }
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit Item" : "Add Item"}
      subtitle={isEdit ? `${item.itemCode} · ${item.itemName}` : "Add a new item to the product master"}
      size="md"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="item-form" className="btn btn-primary">
            Save Item
          </button>
        </>
      }
    >
      <form id="item-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className={clsx("form-field", errors.itemCode && "form-field--error")}>
            <label htmlFor="itemCode">Item Code</label>
            <input
              id="itemCode"
              type="text"
              value={form.itemCode}
              onChange={(e) => update("itemCode", e.target.value)}
              placeholder="ITM-016"
            />
            {errors.itemCode && <span className="form-field__error">{errors.itemCode}</span>}
          </div>

          <div className={clsx("form-field", errors.itemName && "form-field--error")}>
            <label htmlFor="itemName">Item Name</label>
            <input
              id="itemName"
              type="text"
              value={form.itemName}
              onChange={(e) => update("itemName", e.target.value)}
              placeholder="e.g. Corporate Brochures"
            />
            {errors.itemName && <span className="form-field__error">{errors.itemName}</span>}
          </div>

          <div className={clsx("form-field", errors.category && "form-field--error")}>
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="form-field__error">{errors.category}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={(e) => update("status", e.target.value)}>
              {ITEM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field form-field--span2">
            <label htmlFor="description">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief description of this item"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ItemFormModal;
