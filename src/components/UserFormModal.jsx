import { useState } from "react";
import clsx from "clsx";
import { Wand2 } from "lucide-react";
import Modal from "./Modal";
import { useUsersData } from "../context/usersData";
import { useToast } from "../context/toast";
import { ROLES, getRoleDescription } from "../data/roles";
import "./FormField.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function UserFormModal({ user, onClose }) {
  const isEdit = Boolean(user);
  const { users, addUser, updateUser } = useUsersData();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    status: user?.status || "Active",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleGeneratePassword() {
    const pwd = generatePassword();
    setForm((prev) => ({ ...prev, password: pwd, confirmPassword: pwd }));
    setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    } else {
      const duplicate = users.some(
        (u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && u.id !== user?.id
      );
      if (duplicate) nextErrors.email = "This email is already in use";
    }
    if (!form.role) nextErrors.role = "Role is required";

    if (!isEdit) {
      if (!form.password) nextErrors.password = "Temporary password is required";
      if (!form.confirmPassword) {
        nextErrors.confirmPassword = "Please confirm the password";
      } else if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: form.status,
    };

    if (isEdit) {
      updateUser(user.id, payload);
      showToast("User updated successfully");
    } else {
      addUser(payload);
      showToast("User created successfully");
    }
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit User" : "Add User"}
      subtitle={isEdit ? `${user.name} · ${user.email}` : "Create a new system user"}
      size="md"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="user-form" className="btn btn-primary">
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <p className="form-section__title">Personal Information</p>
          <div className="form-grid">
            <div className={clsx("form-field", "form-field--span2", errors.name && "form-field--error")}>
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Arun Kumar" />
              {errors.name && <span className="form-field__error">{errors.name}</span>}
            </div>
            <div className={clsx("form-field", errors.email && "form-field--error")}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@veesham.com" />
              {errors.email && <span className="form-field__error">{errors.email}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="phone">
                Phone Number <span className="optional">(optional)</span>
              </label>
              <input id="phone" type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+971 50 000 0000" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-section__title">Access</p>
          <div className="form-grid">
            <div className={clsx("form-field", errors.role && "form-field--error")}>
              <label htmlFor="role">Role</label>
              <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}>
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.value}
                  </option>
                ))}
              </select>
              {errors.role && <span className="form-field__error">{errors.role}</span>}
              {form.role && <span className="form-hint">{getRoleDescription(form.role)}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={(e) => update("status", e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {!isEdit && (
          <div className="form-section">
            <div className="form-section__title-row">
              <p className="form-section__title">Login</p>
              <button type="button" className="form-section__action" onClick={handleGeneratePassword}>
                <Wand2 size={13} strokeWidth={2} />
                Generate Password
              </button>
            </div>
            <div className="form-grid">
              <div className={clsx("form-field", errors.password && "form-field--error")}>
                <label htmlFor="password">Temporary Password</label>
                <input
                  id="password"
                  type="text"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Enter a temporary password"
                  autoComplete="new-password"
                />
                {errors.password && <span className="form-field__error">{errors.password}</span>}
              </div>
              <div className={clsx("form-field", errors.confirmPassword && "form-field--error")}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="text"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Re-enter the password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <span className="form-field__error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}

export default UserFormModal;
