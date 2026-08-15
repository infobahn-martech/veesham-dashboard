import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";
import "./ActionMenu.css";

function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="action-menu" ref={rootRef}>
      <button
        type="button"
        className="action-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open actions menu"
        aria-expanded={open}
      >
        <MoreVertical size={16} strokeWidth={2} />
      </button>
      {open && (
        <div className="action-menu__list" role="menu">
          {items.map(({ label, icon: Icon, onClick, tone }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              className={clsx("action-menu__item", tone === "danger" && "action-menu__item--danger")}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
            >
              {Icon && <Icon size={15} strokeWidth={2} />}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
