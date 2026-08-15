import { CheckCircle2, AlertCircle, X } from "lucide-react";
import clsx from "clsx";
import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={clsx("toast", `toast--${type}`)} role="alert">
      <Icon size={17} strokeWidth={2} />
      <span className="toast__message">{message}</span>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Dismiss notification">
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export default Toast;
