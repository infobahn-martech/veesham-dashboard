import { useState } from "react";
import clsx from "clsx";
import { Wand2 } from "lucide-react";
import Modal from "./Modal";
import { useToast } from "../context/toast";
import "./FormField.css";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function ResetPasswordModal({ user, onClose }) {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  function handleGenerate() {
    const pwd = generatePassword();
    setPassword(pwd);
    setConfirmPassword(pwd);
    setErrors({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!password) nextErrors.password = "New password is required";
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm the password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    showToast(`Password reset for ${user.name}`);
    onClose();
  }

  return (
    <Modal
      title="Reset Password"
      subtitle={`Reset password for ${user.name}?`}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="reset-password-form" className="btn btn-primary">
            Reset Password
          </button>
        </>
      }
    >
      <form id="reset-password-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <div className="form-section__title-row">
            <p className="form-section__title">New Login</p>
            <button type="button" className="form-section__action" onClick={handleGenerate}>
              <Wand2 size={13} strokeWidth={2} />
              Generate Password
            </button>
          </div>
          <div className="form-grid form-grid--single">
            <div className={clsx("form-field", errors.password && "form-field--error")}>
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Enter a new password"
                autoComplete="new-password"
              />
              {errors.password && <span className="form-field__error">{errors.password}</span>}
            </div>
            <div className={clsx("form-field", errors.confirmPassword && "form-field--error")}>
              <label htmlFor="confirm-new-password">Confirm Password</label>
              <input
                id="confirm-new-password"
                type="text"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Re-enter the password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-field__error">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ResetPasswordModal;
